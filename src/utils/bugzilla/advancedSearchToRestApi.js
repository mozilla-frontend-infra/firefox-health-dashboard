/* eslint-disable no-param-reassign */
const TRANSFORM_FIELD = {
  chfieldfrom: 'creation_time',
};
const advancedSearchToRestApi = parameters =>
  Object.keys(parameters).reduce((result, key) => {
    const newKey = TRANSFORM_FIELD[key] || key;

    result[newKey] = parameters[key];

    return result;
  }, {});

export default advancedSearchToRestApi;
