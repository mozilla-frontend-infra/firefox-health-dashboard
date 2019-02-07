import { stringify } from 'query-string';
import BZ_HOST from './settings';
import queryBugzilla from './queryBugzilla';

const DEFAULT_COLUMNLIST = [
  'priority',
  'component',
  'assigned_to',
  'bug_status',
  'short_desc',
  'status_whiteboard',
  'changeddate',
].join(',');
const generateBugzillaUrl = queryParameters => {
  const query = stringify({
    order: !queryParameters.order ? 'Bug Number' : queryParameters.order,
    columnlist: !queryParameters.columnlist
      ? DEFAULT_COLUMNLIST
      : !queryParameters.columnlist,
    ...queryParameters,
  });

  return `${BZ_HOST}/buglist.cgi?${query}`;
};

const generateBugzillaUrls = async (queries, includeBugCount) =>
  Promise.all(
    queries.map(async ({ parameters, text }) => {
      const urlInfo = {
        text,
        url: generateBugzillaUrl(parameters),
      };

      if (includeBugCount) {
        // eslint-disable-next-line no-param-reassign
        parameters.count_only = 1;
        const { bugCount } = await queryBugzilla(parameters);

        urlInfo.bugCount = bugCount;
      }

      return urlInfo;
    })
  );

export default generateBugzillaUrls;
