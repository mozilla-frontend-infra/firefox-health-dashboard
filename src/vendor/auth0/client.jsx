/* eslint-disable camelcase */
import React from 'react';
import {
  createRandomString, runIframe, sha256, unionScopes,
} from './utils';
import { decode as decodeJwt } from './jwt';
import {
  fetchJson, fromQueryString, toQueryString, URL,
} from '../requests';
import { Log } from '../logs';
import { exists } from '../utils';
import { bytesToBase64URL, value2json } from '../convert';
import { Cache } from './cache';
import { GMTDate as Date } from '../dates';
import { Signal, sleep, Timer } from '../signals';
import { toPairs } from '../vectors';
import SETTINGS from '../../config.json';

const DEFAULT_SCOPE = '';

/**
 * A inter-session auth0 interface object
 * only one allowed per page
 */
class Auth0Client {
  constructor({
    domain, leeway = 10, client_id, audience, scope, redirect_uri, onStateChange, api,
  }) {
    if (Auth0Client.CLIENT) Log.error('There can be only one');
    if (!api.cookie.name) Log.error('Expecting a cookie.name parameter');

    Auth0Client.CLIENT = this;
    this.options = {
      leeway, client_id, audience, scope, redirect_uri,
    };
    const pleaseStop = new Signal();
    this.pleaseStop = pleaseStop;
    this.authorizeSilentlyWorks = true; // optimism
    this.cache = new Cache({ name: 'auth0.client', onStateChange, pleaseStop });
    this.authenticateCallbackState = new Cache({ name: 'auth0.client.callback', pleaseStop });
    this.domainUrl = `https://${domain}`;
    this.api = api;
    this.keepAliveDaemon();
  }

  async fetchJson(url, options = {}) {
    const now = Date.now().unix();
    const session = this.getCookie();
    if (!session) {
      Log.error('require session to call api');
    }
    /* eslint-disable-next-line no-param-reassign */
    options.credentials = 'include';

    try {
      const response = await fetchJson(url, options);
      this.last_used = now;
      return response;
    } catch (error) {
      if (error.includes('must authorize first')) {
        this.clearCookie();
      }
      Log.error('Call to API failed', error);
    }
  }

  getRawAccessToken() {
    const { header, payload, signature } = this.cache.get('access_token.encoded');
    return `${header}.${payload}.${signature}`;
  }

  getAccessToken() {
    return this.cache.get('access_token');
  }

  getIdToken() {
    return this.cache.get('id_token');
  }

  getRefreshToken() {
    return this.cache.get('refresh_token');
  }

  getCookie() {
    return this.cache.get('cookie');
  }

  setCookie(cookie) {
    const str = (v, k) => {
      if (v === true) {
        return k;
      } if (v === false) {
        return '';
      }
      return `${k}=${v}`;
    };
    const {
      domain, path, secure, httponly, expires, name, value,
    } = cookie;
    const rest = {
      domain, path, secure, httponly, expires,
    };
    const cookie_text = `${name}=${value};${
      toPairs(rest).map(str).filter(exists).join(';')}`;
    this.cache.set({ cookie });
    document.cookie = cookie_text;
  }

  clearCookie() {
    // Set-Cookie: annotation_session=7e092d6a-0783-4922-9456-7b306360898b; Domain=dev.localhost; Expires=Mon, 25-Nov-2019 12:49:05 GMT; Path=/
    const cookie = this.getCookie();
    if (cookie) {
      document.cookie = `${cookie.name}=;path=${cookie.path};domain=${cookie.domain};expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      this.cache.clear('cookie');
    }
  }

  async refreshAccessToken() {
    const { client_id } = this.options;
    const { refresh_token } = this.cache.get();
    const authResult = await fetchJson(
      `${this.domainUrl}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toQueryString({
          grant_type: 'refresh_token',
          client_id,
          refresh_token,
        }),
      },
    );

    this.cache.set(authResult);
  }

  async revokeRefeshToken() {
    const { client_id } = this.options;
    const token = this.cache.refresh_token;
    await fetchJson(
      `${this.domainUrl}/oauth/revoke`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: value2json({
          client_id,
          token,
        }),
      },
    );
    this.cache.set({ refresh_token: null });
  }

  async authorizeWithRedirect() {
    /*
    Leave the page to perform login
     */
    try {
      const {
        client_id, audience, scope, redirect_uri, telemetry,
      } = this.options;

      const state = createRandomString();
      const nonce = createRandomString();
      const code_verifier = createRandomString();
      const code_challenge = bytesToBase64URL(await sha256(code_verifier));

      const url = URL({
        path: `${this.domainUrl}/authorize`,
        query: {
          client_id,
          redirect_uri,
          audience,
          scope,
          response_type: 'code',
          response_mode: 'query',
          state, // https://auth0.com/docs/protocols/oauth2/oauth-state
          nonce, // https://openid.net/specs/openid-connect-core-1_0.html#ImplicitAuthRequest
          code_challenge,
          code_challenge_method: 'S256',
          telemetry,
        },
      });
      this.authenticateCallbackState.set({
        state,
        nonce,
        code_verifier,
        audience, // FOR RECOVERY LATER
        scope, // FOR RECOVERY LATER
      });
      Log.note('GOTO: {{url}}', { url });
      window.location.assign(url);
    } catch (error) {
      Log.error('Problem with login', error);
    }
  }

  /**
   * If there's a valid token stored, do nothing.
   * Otherwise, opens an iframe with the `/authorize` URL.
   * If that fails, open a new window to allow user to login.
   *
   * Cross-tab state will ensure the
   * original page gets updated when logged back in.
   */
  async authorizeSilently() {
    if (Date.now().unix() < this.cache.get('access_token.claims.exp')) return;

    const {
      client_id, audience, scope, redirect_uri, telemetry,
    } = this.options;

    const state = createRandomString();
    const nonce = createRandomString();
    const code_verifier = createRandomString();
    const code_challenge = bytesToBase64URL(await sha256(code_verifier));

    const url = URL({
      path: `${this.domainUrl}/authorize`,
      query: {
        client_id,
        redirect_uri,
        audience,
        scope,
        response_type: 'code',
        state,
        nonce,
        code_challenge,
        code_challenge_method: 'S256',
        prompt: 'none',
        response_mode: 'web_message',
        telemetry,
      },
    });

    try {
      if (this.authorizeSilentlyWorks) {
        const { code, ...authResult } = await runIframe(url, this.domainUrl);
        if (state !== authResult.state) Log.error('Invalid state');
        this.verifyAuthorizeCode({ code_verifier, nonce, code });
        return;
      }
    } catch (e) {
      // EXPECTED PATH DURING DEVELOPMENT
      // https://github.com/auth0/auth0.js/issues/435#issuecomment-302113245
      this.authorizeSilentlyWorks = false;
    }
    window.open(url, '_blank');
  }


  /**
   * Performs a device authentication flow
   * https://auth0.com/docs/flows/concepts/device-auth
   * It will provide a URL for another device to perform the authentication
   */
  async authorizeWithDevice() {
    const { client_id, audience, scope } = this.options;
    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      expires_in,
      interval,
    } = await fetchJson(
      `${this.domainUrl}/oauth/device/code`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toQueryString({
          client_id,
          audience,
          scope,
        }),
      },
    );

    const isDone = this.pollForDeviceResponse({ device_code, expires_in, interval });
    return {
      user_code, verification_uri, verification_uri_complete, isDone,
    };
  }

  /*
  start polling for access token
  return a Signal, which will be triggered when tokens are acquired
   */
  pollForDeviceResponse({ device_code, expires_in, interval }) {
    // POLL FOR RESPONSE
    const isDone = new Signal();
    (async () => {
      const { client_id } = this.options;
      const timeout = new Timer(Date.now().addSecond(expires_in));
      try {
        while (!timeout.done) {
          /* eslint-disable-next-line no-await-in-loop */
          await sleep(interval);

          try {
            /* eslint-disable-next-line no-await-in-loop */
            const authResult = await fetchJson(
              `${this.domainUrl}/oauth/token`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: toQueryString({
                  grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                  client_id,
                  device_code,
                }),
              },
            );
            /* eslint-disable-next-line no-await-in-loop */
            await this.saveResult(authResult);
            return;
          } catch (e) {
            const { error, description } = e.cause.props.details;

            if (error === 'authorization_pending') {
              /* eslint-disable-next-line no-continue */
              continue;
            }
            if (error === 'slow_down') {
              // DOUBLE THE SLEEP TIME
              /* eslint-disable-next-line no-await-in-loop */
              await sleep(interval);
              /* eslint-disable-next-line no-continue */
              continue;
            }
            if (error === 'expired_token') {
              Log.error('Device auth opportunity timed out: {{description}}', { description });
            }
            if (error === 'access_denied') {
              Log.error('Device auth broken in some way: {{description}}', { description });
            }
            Log.warning('Do not know what to do: {{description}}', { description });
          }
        }
      } finally {
        isDone.go();
      }
    })();
    return isDone;
  }

  /*
  After user authentication, call back to auth0 to get all the
  tokens.  Verify the id token.
   */
  async verifyAuthorizeCode({ code_verifier, code }) {
    const { client_id, redirect_uri } = this.options;
    const authResult = await fetchJson(
      `${this.domainUrl}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id,
          redirect_uri,
          code_verifier,
          code,
          grant_type: 'authorization_code',
        }),
      },
    );

    await this.saveResult(authResult);
  }

  async saveResult(authResult) {
    const { leeway, audience, scope } = this.options;

    const {
      id_token: rawIdToken, access_token: rawAccessToken, expires_in, ...result
    } = authResult;
    const access_token = decodeJwt(rawAccessToken, leeway);
    let id_token = null;
    if (rawIdToken) {
      id_token = decodeJwt(rawIdToken, leeway);
    }

    this.cache.set({
      ...result,
      access_token,
      id_token,
      audience,
      scope,
    });

    await this.login({ rawAccessToken });

    new Timer(new Date(access_token.claims.exp * 1000)).then(
      () => this.cache.clear('access_token'),
    );
  }

  async login({ rawAccessToken }) {
    /*
    GO TO API TO GET A SESSION
     */
    try {
      const api_cookie = await fetchJson(this.api.login, {
        headers: {
          Authorization: `Bearer ${rawAccessToken}`,
        },
      });

      this.setCookie(api_cookie);
    } catch (error) {
      this.clearCookie();
      throw error;
    }
  }

  async keepAlive() {
    try {
      return this.fetchJson(this.api.keep_alive);
    } catch (e) {
      Log.warning('Lost session', e);
      this.cache.clear();
    }
  }

  async keepAliveDaemon() {
    /*
    KEEP SESSION COOKIE ALIVE BY PINGING THE API 2MIN BEFORE EXPIRY
     */
    while (!this.pleaseStop.valueOf()) {
      const now = Date.now().unix();
      const cookie = this.getCookie();
      if (cookie && now > this.last_used + cookie.inactive_lifetime - 120) {
        try {
          /* eslint-disable-next-line no-await-in-loop */
          await this.keepAlive();
        } catch (e) {
          Log.warning('Can not keep session alive', e);
        }
      }
      /* eslint-disable-next-line no-await-in-loop */
      await sleep(15);
    }
  }

  async logout() {
    /*
    INVALIDATE THE SESSION COOKIE
     */
    try {
      await this.fetchJson(this.api.logout);
    } catch (e) {
      Log.warning('problem calling logout endpoint', e);
    }
    this.cache.clear();
  }
}


async function newInstance({ onStateChange, ...options }) {
  /*
  RESPONSIBLE FOR RECOVERING STATE OF PREVIOUS VISIT, OR
  RETURNING A SINGLTON
   */
  if (exists(Auth0Client.CLIENT)) return Auth0Client.CLIENT;

  if (!window.crypto && (window).msCrypto) {
    (window).crypto = (window).msCrypto;
  }
  if (!window.crypto) {
    throw new Error(
      'For security reasons, `window.crypto` is required to run `auth0-spa-js`.',
    );
  }
  if (typeof window.crypto.subtle === 'undefined') {
    throw new Error(`
      auth0-spa-js must run on a secure origin.
      See https://github.com/auth0/auth0-spa-js/blob/master/FAQ.md#why-do-i-get-error-invalid-state-in-firefox-when-refreshing-the-page-immediately-after-a-login 
      for more information.
    `);
  }

  const redirect_uri = options.redirect_uri || window.location.origin + window.location.pathname;
  if (options.home_path) {
    const location = window.location.origin + options.home_path;
    if (redirect_uri !== location) {
      Log.error('expecting this application to be located at {{location}}', { location });
    }
  }

  const {
    state, code, error, error_description,
  } = fromQueryString(window.location.search);
  if (error) {
    Log.error('problem with callback {{detail|json}}', { detail: { error, error_description, state } });
  }

  const { audience } = options;
  const scope = unionScopes(options.scope, DEFAULT_SCOPE);

  const auth0 = new Auth0Client({
    ...options,
    audience,
    scope,
    redirect_uri,
    onStateChange,
  });

  if (exists(state) && exists(code)) {
    // THIS MAY BE A CALLBACK, AND WE CAN RECOVER THE AUTH STATE
    const transaction = auth0.authenticateCallbackState.get();
    if (transaction && transaction.state === state) {
      auth0.options.audience = transaction.audience;
      auth0.options.scope = transaction.scope;
      auth0.authenticateCallbackState.clear();
      await auth0.verifyAuthorizeCode({ code, ...transaction });
    }
    window.history.replaceState(null, null, redirect_uri);
  }

  await auth0.keepAlive();

  return auth0;
}

Auth0Client.CLIENT = null;
Auth0Client.newInstance = newInstance;


const AuthContext = React.createContext(null);

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.update();
  }

  async update() {
    const authenticator = await Auth0Client.newInstance({ onStateChange: () => this.update(), ...SETTINGS.auth0 });
    this.setState({
      authenticator,
      cookie: exists(authenticator.getCookie()),
    });
  }

  render() {
    const { authenticator, cookie } = this.state;
    return (
      <AuthContext.Provider value={{ authenticator, cookie }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}


export { AuthContext, AuthProvider, Auth0Client }; // eslint-disable-line import/prefer-default-export
