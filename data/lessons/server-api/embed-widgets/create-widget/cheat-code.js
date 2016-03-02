var BASE_URL = 'http://crunchbase.linkurio.us/';

var queryString  = 'MATCH (n1)-[r]-(n2) RETURN n1,r,n2 LIMIT 5';
var source;
var graphQueryResponse;
var graphData;
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
      query: encodeURIComponent(queryString),
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
  graphData = { nodes: [], edges: [] }; // widget data

  graphQueryResponse.forEach(function(node) {
    if (node.edges && node.edges.length) {
      node.edges.forEach(function(edge) {
        if (!edgeIndex[edge.id]) {
          // Encapsulate the server edge
          edge = {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            data: {
              type: edge.type,
              properties: edge.data
            }
          };

          // Set the edge captions
          edge.label = edge.data.type;

          edges.push({ id: edge.id });
          graphData.edges.push(edge);
        }
        edgeIndex[edge.id] = true;
      });
    }

    // Encapsulate the server node
    node = {
      id: node.id,
      data: {
        categories: node.categories,
        properties: node.data
      }
    };

    // Fake node coordinates, we should apply a layout instead
    node.x = Math.random() * 100;
    node.y = Math.random() * 100;

    // Set the node captions
    node.label = node.data.properties.name; // dataset specific

    nodes.push({
      id: node.id,
      nodelink: {
        x: node.x,
        y: node.y
      }
    });
    delete node.edges;
    graphData.nodes.push(node);
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
    }
  };

  var url = BASE_URL + 'api/' + source.key + '/visualizations';
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

// Create the visualization widget
.then(function(xhr, response) {
  var url = BASE_URL + 'api/widget';
  var options = {
    visualization_id: response.visualization.id,
    content: {
      graph: {
        nodes: graphData.nodes,
        edges: graphData.edges
      },
      palette: palette,
      styles: styles,
      ui: {
        search: true,
        share: false,
        layout: true,
        fullscreen: true,
        zoom: true,
        legend: true,
        geo: false,
      }
    }
  };

  return qwest.post(url, options, qwestOpts);
})

.then(test)
.catch(error);
