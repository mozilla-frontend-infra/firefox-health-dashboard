import queryBugzilla from '../queryBugzilla';
import burndownDataFormatter from './burndownDataFormatter';

// It formats the data and options to meet chartJs' data structures
const getBurndownData = async (queries = [], startDate) => {
    const data = await Promise.all(
        queries.map(async ({ label, parameters }) => ({
            label,
            ...(await queryBugzilla(parameters)),
        })));
    return burndownDataFormatter(data, startDate);
};

export default getBurndownData;
