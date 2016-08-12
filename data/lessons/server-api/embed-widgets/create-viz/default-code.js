var BASE_URL = 'http://crunchbase.linkurio.us/';

var queryString  = 'MATCH (n1)-[r]-(n2) RETURN n1,r,n2 LIMIT 5';
var source;
var graphQueryResponse;
var palette;
var styles;

var qwestOpts = {
  cache: true,
  withCredentials: true,
  dataType: 'json'
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

// Send a Cypher query
.then(function(xhr, response) {
  // Pick first datasource
  source = response.sources[0];

  if (source && source.connected && source.state == 'ready') {
    var url = BASE_URL + 'api/' + source.key + '/graph/rawQuery';
    return qwest.post(url, {
      query: queryString,
      dialect: 'cypher'
    }, qwestOpts);
  }
  throw 'Source unavailable';
})

// Read configuration
.then(function(xhr, response) {
  graphQueryResponse = response;
  var url = BASE_URL + 'api/config?sourceIndex=' + source.configIndex;
  return qwest.get(url, null, qwestOpts);
})

// Create a visualization
.then(function(xhr, response) {
  var nodes = []; // visualization data
  var edges = []; // visualization data
  var edgeIndex = {}; // used to remove duplicates

  graphQueryResponse.forEach(function(node) {
    if (node.edges && node.edges.length) {
      node.edges.forEach(function(edge) {
        if (!edgeIndex[edge.id]) {
          edges.push({ id: edge.id });
        }
        edgeIndex[edge.id] = true;
      });
    }

    // Fake node coordinates, we should apply a layout instead
    node.x = Math.random() * 100;
    node.y = Math.random() * 100;

    nodes.push({
      id: node.id,
      nodelink: {
        x: node.x,
        y: node.y
      }
    });
    delete node.edges;
  });

  // Set the visualization styles
  palette = response.config.palette;
  styles = {
    nodes: {
      size: {
       by: "data.properties.funding_rounds",
       bins: 7,
       min: 5,
       max: 9,
       active: true
      },
      color: {
        by: "data.properties.founded_year",
        bins: 7,
        scheme: "nodes.sequential",
        active: true
      }
    },
    edges: {}
  };

  var url = BASE_URL + 'api/' + source.key + '/<EDIT_HERE>';
  var options = {
    title: 'My visualization',
    nodes: nodes,
    edges: edges,
    design: { // apply default design config
      palette: palette,
      styles: styles
    }
  }

  return qwest.post(url, options, qwestOpts);
})

.then(test)
.catch(error);
