// set the domain of the Linkurious server
qwest.base = 'http://crunchbase.linkurio.us';

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true,
  // set query format
  dataType: 'json'
});

var cypherQuery  = 'MATCH (n1)-[r]-(n2) RETURN n1,r,n2 LIMIT 5';
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

  // 4) Send a Cypher query
  return qwest.post('/api/' + source.key + '/graph/<EDIT_HERE>', {
    query: cypherQuery,
    dialect: 'cypher'
  });
})
// the following callbacks validate your submission
.then(test)
.catch(error);
