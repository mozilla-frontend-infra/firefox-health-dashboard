import fetchJson from '../fetch/json';

const BASE = 'https://bugzilla.mozilla.org/rest/bug';

// Reference query for ${current}: https://bugzilla.mozilla.org/buglist.cgi?o5=equals&keywords=regression%2C&keywords_type=allwords&list_id=13003786&v11=INCOMPLETE&j2=OR&o1=anywordssubstr&o9=notequals&v10=WORKSFORME&f13=CP&v5=---&f12=resolution&v9=WONTFIX&o4=equals&j15=OR&o12=notequals&v1=fixed%2C%20verified&v4=%3F&f10=resolution&f1=cf_status_firefox${current}&o3=equals&f8=resolution&v3=unaffected&o11=notequals&f15=OP&f9=resolution&f4=cf_status_firefox${prior}&query_format=advanced&o10=notequals&f3=cf_status_firefox${prior}&f2=OP&v12=EXPIRED&f11=resolution&f5=cf_status_firefox${prior}&v8=INVALID&f6=CP&f7=OP&o8=notequals

function searchQuery(version) {
  const current = parseInt(version);
  const prior = current - 1;
  return `o5=equals&keywords=regression%2C&keywords_type=allwords&list_id=13003816&v11=INCOMPLETE&o1=anyexact&j2=OR&o9=notequals&v10=WORKSFORME&o16=notequals&f13=CP&v5=---&f12=resolution&v9=WONTFIX&o4=equals&o12=notequals&v1=fixed%2C verified&v16=DUPLICATE&v4=%3F&f10=resolution&f1=cf_status_firefox${current}&o3=equals&f8=resolution&o11=notequals&v3=unaffected&f15=OP&f9=resolution&f4=cf_status_firefox${prior}&o10=notequals&query_format=advanced&f3=cf_status_firefox${prior}&f2=OP&v12=EXPIRED&f11=resolution&f5=cf_status_firefox${prior}&v8=INVALID&f6=CP&f7=OP&o8=notequals&f16=resolution`;
}

export async function getRegressionCount(version) {
  const query = searchQuery(version);
  const response = await fetchJson(`${BASE}?${query}`);
  return response.bugs.length;
}
