var BASE_URL = 'http://crunchbase.linkurio.us/';

var query = 'energy';
var type = 'node'; // 'node' or 'edge'
var fuzziness = 0.6; // 0..1

qwest.get(BASE_URL + 'api/dataSources', null, {
  cache: true
})
.then(function(xhr, response) {
  var source = response.sources[0]; // pick first datasource
  if (source && source.connected && source.state == 'ready') {
    window.open(BASE_URL + 'workspace/new' +
      '?source=' + source.key +
      '&populate_type=' + type +
      '&populate_query=' + query +
      '&query_fuzziness=' + fuzziness
    );
  }
})
.then(test)
.catch(error);
