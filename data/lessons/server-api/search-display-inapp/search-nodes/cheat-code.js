var BASE_URL = 'http://localhost:3000/';

var queryString  = 'energy';
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
    return qwest.get(BASE_URL + 'api/' + source.key + '/search/nodes', {
      q: queryString,
      fuzziness: 0.6
    }, {
      cache: true,
      withCredentials: true
    });
  }
  throw 'Source unavailable';
})

// Get a node
// .then(function(xhr, response) {
//   if (response && response.totalHits && response.results[0].children.length) {
//     var nodeId = response.results[0].children[0].id;
//     return qwest.get(BASE_URL + 'api/' + source.key + '/graph/nodes/' + nodeId, null, {
//       cache: true,
//       withCredentials: true
//     });
//   }
//   throw 'No results found';
// })


.then(test)
.catch(error);
