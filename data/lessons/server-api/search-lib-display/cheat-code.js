var BASE_URL = 'http://crunchbase.linkurio.us/';

var source;
var nodeId = 42;

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
    cache: true
  });
})

//
.then(function(xhr, response) {
  source = response.sources[0]; // pick first datasource
  if (source && source.connected && source.state == 'ready') {
    // Get a node
    return qwest.get(BASE_URL + 'api/' + source.key + '/graph/nodes/' + nodeId, null, {
      cache: true,
      withCredentials: true
    });
  }
  throw 'Source unavailable';
})

//
.then(function(xhr, response) {
  console.log(response);
  // Open the interface of Linkurious
  return qwest.get(BASE_URL + 'workspace/new?populate_type=node&populate_id=' + nodeId, null, {
    cache: true,
    withCredentials: true
  });
  //throw 'Unknown node';
})

.then(test)
.catch(error);
