var BASE_URL = 'http://localhost:3000/';

var queryString  = 'energy';
var source;

var qwestOpts = {
  cache: true,
  withCredentials: true
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

// Search nodes
.then(function(xhr, response) {
  // Pick first datasource
  source = response.sources[0];

  if (source && source.connected && source.state == 'ready') {
    var url = BASE_URL + 'api/' + source.key + '/search/nodes';
    return qwest.get(url, {
      q: queryString,
      fuzziness: 0.6
    }, qwestOpts);
  }
  throw 'Source unavailable';
})

// Get a node from search results
.then(function(xhr, response) {
  if (response && response.totalHits && response.results[0].children.length) {

    // Pick first hit
    var nodeId = response.results[0].children[0].id;

    var url = BASE_URL + 'api/' + source.key + '/<EDIT_HERE>/' + nodeId;
    return qwest.get(url, null, qwestOpts);
  }
  throw 'No results found';
})

.then(test)
.catch(error);
