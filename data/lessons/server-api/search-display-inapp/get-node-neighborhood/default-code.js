var BASE_URL = 'http://crunchbase.linkurio.us/';

var queryString  = 'energy';
var source;

var qwestOpts = {
  cache: true,
  withCredentials: true
};

// Authenticate user
qwest.post(BASE_URL + 'api/auth/login', {
  usernameOrEmail: 'Student 0',
  password: 'student0',
}, qwestOpts)

// Discover datasources
.then(function() {
  return qwest.get(BASE_URL + 'api/dataSources', null, qwestOpts);
})

// Search nodes
.then(function(xhr, response) {
  // Pick first datasource
  source = response.sources[0];

  if (source && source.connected && source.state == 'ready') {
    var url = BASE_URL + 'api/' + source.key + '/search/nodes';
    return qwest.get(url, {
      q: encodeURIComponent(queryString),
      fuzziness: 0.6,
      size: 10 // maximum number of results wanted
    }, qwestOpts);
  }
  throw 'Source unavailable';
})

// Get a node and its neighborhood from search results
.then(function(xhr, response) {
  if (response && response.totalHits && response.results[0].children.length) {

    // Pick first hit
    var nodeId = response.results[0].children[0].id;

    var url = BASE_URL + 'api/' + source.key + '<EDIT_HERE>';

    return qwest.post(url, {
      ids: [ nodeId ],
      limit: 5,  // maximum number of nodes to return
      limitType: 'highestDegree' // return the most connected nodes
    }, qwestOpts);
  }
  throw 'No results found';
})

// Format results as a graph
.then(function(xhr, response) {
  var graph = {
    nodes: [],
    edges: []
  }

  var edgeIds = {};

  response.forEach(function(node) {
    // Add nodes without extra keys
    graph.nodes.push({
      id: node.id,
      data: node.data,
      categories: node.categories
    });

    // Add edges without duplicates
    node.edges
      .filter(function(edge) {
        return !edgeIds[edge.id];
      })
      .forEach(function(edge) {
        edgeIds[edge.id] = true;
        graph.edges.push(edge);
      });
  });

  return graph;
})

.then(test)
.catch(error);
