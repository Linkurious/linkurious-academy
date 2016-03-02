var BASE_URL = 'http://crunchbase.linkurio.us/';

var query = '<EDIT_HERE>';
var populate = 'pattern';
var dialect = 'cypher' // 'cypher' for Neo4j or 'gremlin' for TitanDB

qwest.get(BASE_URL + 'api/dataSources', null, {
  cache: true
})
.then(function(xhr, response) {
  var source = response.sources[0]; // pick first datasource
  if (source && source.connected && source.state == 'ready') {
    window.open(BASE_URL + 'workspace/new' +
      '?source=' + source.key +
      '&populate=' + populate +
      '&pattern_query=' + encodeURIComponent(query) +
      '&pattern_dialect=' + dialect
    );
  }
})
.then(test)
.catch(error);
