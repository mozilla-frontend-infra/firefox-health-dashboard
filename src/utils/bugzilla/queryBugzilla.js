import { fetchJson, URL } from '../../vendor/requests';
import BZ_HOST from './settings';
import advancedSearchToRestApi from './advancedSearchToRestApi';

const generateBugzillaRestApiUrl = queryParameters => {
  const transformedParameters = advancedSearchToRestApi(queryParameters);

  return URL({
    path: [BZ_HOST, '/rest/bug'],
    query: transformedParameters,
  });
};

const queryBugzilla = async queryParameters =>
  fetchJson(generateBugzillaRestApiUrl(queryParameters));

export default queryBugzilla;
