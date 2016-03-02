var BASE_URL = 'http://crunchbase.linkurio.us/';

var queryString  = 'MATCH (n1)-[r]-(n2) RETURN n1,r,n2 LIMIT 5';
var source;

var qwestOpts = {
  cache: true,
  withCredentials: true,
  dataType: 'json'
};

// Authenticate user
qwest.post(BASE_URL + 'api/auth/login', {
  usernameOrEmail: 'Student 0',
  password: 'student0',
}, qwestOpts)

// Discover datasources
.then(function() {
  return qwest.get(BASE_URL + 'api/dataSources', null, qwestOpts);
})

// Send a Cypher query
.then(function(xhr, response) {
  // Pick first datasource
  source = response.sources[0];

  if (source && source.connected && source.state == 'ready') {
    var url = BASE_URL + 'api/' + source.key + '/graph/rawQuery';
    return qwest.post(url, {
      query: encodeURIComponent(queryString),
      dialect: 'cypher'
    }, qwestOpts);
  }
  throw 'Source unavailable';
})

.then(test)
.catch(error);
