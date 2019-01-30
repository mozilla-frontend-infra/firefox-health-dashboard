import BackendClient from '../BackendClient';

const CLIENT = new BackendClient();
const fetchNimbledroidData = products =>
  CLIENT.getData('nimbledroid', { products });

export default fetchNimbledroidData;
