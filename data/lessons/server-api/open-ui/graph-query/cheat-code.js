var BASE_URL = 'http://crunchbase.linkurio.us';

// set the domain of the Linkurious server
qwest.base = BASE_URL;

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

var cypherQuery = 'MATCH (n)-[r]-(m) RETURN n,r,m LIMIT 5';
var populate = 'pattern'; // use a Cypher pattern query to load nodes and relationships
var dialect = 'cypher'; // 'cypher' for Neo4j or 'gremlin' for TitanDB
var doLayout = true; // run the ForceLink layout on the server

// 1) log-in
var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
qwest.post('/api/auth/login', loginData).then(function() {

  // 2) request the list of data-sources
  return qwest.get('/api/dataSources');
}).then(function(xhr, response) {

  // 3) pick the first data-source
  var source = response.sources[0]; // pick first data-source
  if (source && source.connected && source.state == 'ready') {

    // 4) open a workspace on the selected data-source
    window.open(BASE_URL + '/workspace/new' +
      '?source=' + source.key +
      '&do_layout=' + doLayout +
      '&populate=' + populate +
      '&pattern_query=' + encodeURIComponent(cypherQuery) +
      '&pattern_dialect=' + dialect
    );
  }
})
// the following callbacks validate your submission
.then(test)
.catch(error);
