import { stringify } from 'query-string';
import fetchJson from '../fetchJson';

const BZ_HOST = 'https://bugzilla.mozilla.org';

const DEFAULT_COLUMNLIST = [
    'priority',
    'component',
    'assigned_to',
    'bug_status',
    'short_desc',
    'status_whiteboard',
    'changeddate',
].join(',');

const generateBugzillaUrl = (queryParameters) => {
    const query = stringify({
        order: !queryParameters.order ? 'Bug Number' : queryParameters.order,
        columnlist: !queryParameters.columnlist ? DEFAULT_COLUMNLIST : !queryParameters.columnlist,
        ...queryParameters,
    });
    return `${BZ_HOST}/buglist.cgi?${query}`;
};

const generateBugzillaRestApiUrl = (queryParameters) => {
    const query = stringify({ ...queryParameters });
    return `${BZ_HOST}/rest/bug?${query}`;
};

const generateBugzillaUrls = async (queries, includeBugCount) => (
    Promise.all(
        queries.map(async ({ parameters, text }) => {
            const urlInfo = {
                text,
                url: generateBugzillaUrl(parameters),
            };
            if (includeBugCount) {
                const { bugs } = await fetchJson(generateBugzillaRestApiUrl(parameters));
                urlInfo.bugCount = bugs.length;
            }
            return urlInfo;
        }))
);

export default generateBugzillaUrls;
