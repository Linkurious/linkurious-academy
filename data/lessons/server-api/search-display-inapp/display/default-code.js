qwest.base = 'http://crunchbase.linkurio.us';
qwest.setDefaultOptions({withCredentials: true});

var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
var searchQuery = 'energy';
var source;

// 1) Authenticate
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
  return qwest.get('/api/' + source.key + '/search/nodes', {
    q: searchQuery,
    fuzziness: 0.6,
    size: 10 // maximum number of results wanted
  });

}).then(function(xhr, response) {

  // 5) Check that there are matching nodes
  if (!response || !response.totalHits || !response.results[0].children.length) {
    throw 'No results found';
  }

  // 6) Load the fist matching node with its neighbors
  var nodeId = response.results[0].children[0].id;
  return qwest.post('/api/' + source.key + '<EDIT_HERE>', {
    ids: [nodeId],
    limit: 50,  // maximum number of nodes to return
    limitType: 'highestDegree' // return the most connected nodes
  });
}).then(function(xhr, response) {

  // 7) Format the response as a graph
  var graph = {nodes: [], edges: []};
  var edgeIds = {};

  response.forEach(function(node) {
    // Add nodes with random coordinates
    graph.nodes.push({
      id: node.id,
      data: node.data,
      categories: node.categories,
      x: Math.random(),
      y: Math.random(),
      size: 1
    });

    // Add edges without duplicates
    node.edges.filter(function(edge) {
      return !edgeIds[edge.id];
    }).forEach(function(edge) {
      edgeIds[edge.id] = true;
      graph.edges.push(edge);
    });
  });

  // 8) Create a container for the visualization
  var graphContainerElt = document.createElement('div');
  graphContainerElt.id = 'graph-container';
  document.body.insertBefore(graphContainerElt, document.getElementById('response'));

  // 9) Instantiate sigma
  var sigmaInstance = new sigma({
    graph: graph,
    container: 'graph-container'
  });
  sigmaInstance.bind('clickNode', function(e) {
    var nodeProperties = e.data.node.data;
    document.getElementById('response').textContent = JSON.stringify(nodeProperties);
  });
})
.then(test)
.catch(error);
