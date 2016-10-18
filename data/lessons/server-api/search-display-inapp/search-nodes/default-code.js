// set the domain of the Linkurious server
qwest.base = 'http://crunchbase.linkurio.us';

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

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

  // 4) Search nodes
  return qwest.get('/api/' + source.key + '/<EDIT_HERE>', {
    q: searchQuery,
    fuzziness: 0.6,
    size: 10 // maximum number of results wanted
  });
})
// the following callbacks validate your submission
.then(test)
.catch(error);
