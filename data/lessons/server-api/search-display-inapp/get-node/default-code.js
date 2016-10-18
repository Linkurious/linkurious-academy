qwest.base = 'http://crunchbase.linkurio.us';
qwest.setDefaultOptions({withCredentials: true});

var searchQuery = 'energy';
var source;

// 1) Authenticate
var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
qwest.post('/api/auth/login', loginData).then(function() {

  // 2) List data-sources
  return qwest.get('/api/dataSources');
}).then(function(xhr, response) {

  // 3) Check that the first data-source is ready
  source = response.sources[0];
  if (!source || !source.connected || source.state !== 'ready') {
    throw 'Source unavailable';
  }

  // 4) Search nodes matching [searchQuery] in the first data-source
  return qwest.get('/api/' + source.key + '<EDIT_HERE>', {
    q: searchQuery,
    fuzziness: 0.6,
    size: 10 // maximum number of results wanted
  });
}).then(function(xhr, response) {

  // 5) Check that there are matching nodes
  if (!response || !response.totalHits || !response.results[0].children.length) {
    throw 'No results found';
  }

  // 6) Load the first node
  var nodeId = response.results[0].children[0].id;
  return qwest.get('/api/' + source.key + '/graph/nodes/' + nodeId);
})
// the following callbacks validate your submission
  .then(test)
  .catch(error);
