import { stringify } from 'query-string';
import fetchJson from '../fetchJson';
import BZ_HOST from './settings';
import advancedSearchToRestApi from './advancedSearchToRestApi';

const generateBugzillaRestApiUrl = (queryParameters) => {
    const transformedParameters = advancedSearchToRestApi(queryParameters);
    const query = stringify({ ...transformedParameters });
    return `${BZ_HOST}/rest/bug?${query}`;
};

const queryBugzilla = async queryParameters => (
    fetchJson(generateBugzillaRestApiUrl(queryParameters)));

export default queryBugzilla;
