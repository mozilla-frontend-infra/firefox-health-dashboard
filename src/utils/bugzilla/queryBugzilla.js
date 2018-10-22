import { stringify } from 'query-string';
import fetchJson from '../fetchJson';
import BZ_HOST from './settings';

const generateBugzillaRestApiUrl = (queryParameters) => {
    const query = stringify({ ...queryParameters });
    return `${BZ_HOST}/rest/bug?${query}`;
};

const queryBugzilla = async queryParameters => (
    fetchJson(generateBugzillaRestApiUrl(queryParameters)));

export default queryBugzilla;
