import { selectFrom } from '../vectors';
import { exists } from '../utils';
import { bytesToBase64URL } from '../convert';
import { Exception } from '../logs';

const DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS = 60;
const TIMEOUT_ERROR = { error: 'timeout', error_description: 'Timeout' };

export const unionScopes = (...scopes) => selectFrom(scopes)
  .filter(exists)
  .map(x => x.split(' '))
  .flatten()
  .filter(exists)
  .union()
  .sort()
  .join(' ');


export const runIframe = (authorizeUrl, eventOrigin) => new Promise((res, rej) => {
  const iframe = window.document.createElement('iframe');
  iframe.setAttribute('width', '0');
  iframe.setAttribute('height', '0');
  iframe.style.display = 'none';

  const timeoutSetTimeoutId = setTimeout(() => {
    rej(TIMEOUT_ERROR);
    window.document.body.removeChild(iframe);
  }, 60 * 1000);

  const iframeEventHandler = (e) => {
    if (e.origin !== eventOrigin) return;
    if (!e.data || e.data.type !== 'authorization_response') return;
    (e.source).close();
    if (e.data.response.error) {
      rej(new Exception(e.data.response));
    } else {
      res(e.data.response);
    }
    clearTimeout(timeoutSetTimeoutId);
    window.removeEventListener('message', iframeEventHandler, false);
    window.document.body.removeChild(iframe);
  };
  window.addEventListener('message', iframeEventHandler, false);
  window.document.body.appendChild(iframe);
  iframe.setAttribute('src', authorizeUrl);
});

export const openPopup = () => {
  const popup = window.open(
    '',
    'auth0:authorize:popup',
    'left=100,top=100,width=400,height=600,resizable,scrollbars=yes,status=1',
  );
  if (!popup) {
    throw new Error('Could not open popup');
  }
  return popup;
};

export const runPopup = (
  popup,
  authorizeUrl,
  config,
) => {
  // eslint-disable-next-line no-param-reassign
  popup.location.href = authorizeUrl;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Exception('Timeout Error'));
    }, (config.timeoutInSeconds || DEFAULT_AUTHORIZE_TIMEOUT_IN_SECONDS) * 1000);


    window.addEventListener('message', (e) => {
      if (!e.data || e.data.type !== 'authorization_response') {
        return;
      }
      clearTimeout(timeoutId);
      popup.close();
      if (e.data.response.error) {
        return reject(new Exception(e.data.response));
      }
      resolve(e.data.response);
    });
  });
};

export const createRandomString = () => bytesToBase64URL(crypto.getRandomValues(new Uint8Array(32)));


export const sha256 = async (s) => {
  const response = await Promise.resolve(
    window.crypto.subtle.digest(
      { name: 'SHA-256' },
      new TextEncoder().encode(s),
    ),
  );
  // msCrypto (IE11) uses the old spec, which is not Promise based
  // https://msdn.microsoft.com/en-us/expression/dn904640(v=vs.71)
  // Instead of returning a promise, it returns a CryptoOperation
  // with a `result` property in it
  if ((response).result) {
    return (response).result;
  }
  return response;
};
