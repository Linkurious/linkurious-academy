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
    var url = BASE_URL + 'api/' + source.key + '<EDIT_HERE>';
    return qwest.get(url, {
      q: queryString,
      fuzziness: 0.6
    }, qwestOpts);
  }
  throw 'Source unavailable';
})

.then(test)
.catch(error);
