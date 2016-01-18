var BASE_URL = 'http://localhost:3000/';

var queryString  = 'tessefseifsnevfesfst';
var source;

// Authenticate user
qwest.post(BASE_URL + 'api/auth/login', {
  usernameOrEmail: 'Student 0',
  password: 'student0',
}, {
  cache: true
})

// Discover datasources
.then(function() {
  return qwest.get(BASE_URL + 'api/dataSources', null, {
    cache: true,
    withCredentials: true
  });
})

// Search nodes
.then(function(xhr, response) {
  // Pick first datasource
  source = response.sources[0];

  if (source && source.connected && source.state == 'ready') {
    return qwest.get(BASE_URL + 'api/' + source.key + '<EDIT_HERE>', {
      q: queryString,
      fuzziness: 0.6
    }, {
      cache: true,
      withCredentials: true
    });
  }
  throw 'Source unavailable';
})

.then(test)
.catch(error);
