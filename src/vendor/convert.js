import { frum, toPairs } from './queryOps';

function URL2Object(url) {
  return frum(new URLSearchParams(url).entries())
    .map(([k, v]) => [v, k])
    .args()
    .fromPairs();
}

function Object2URL(value) {
  return toPairs(value)
    .map((v, k) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .concatenate('&');
}

export { URL2Object, Object2URL };
