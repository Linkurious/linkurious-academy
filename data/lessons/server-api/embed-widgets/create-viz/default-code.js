// set the domain of the Linkurious server
qwest.base = 'http://crunchbase.linkurio.us';

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true,
  // set query format
  dataType: 'json'
});

var cypherQuery  = 'MATCH (n1)-[r]-(n2) RETURN n1,r,n2 LIMIT 5';
var graphQueryResponse;
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
  return qwest.post('/api/' + source.key + '/graph/rawQuery', {
    query: cypherQuery,
    dialect: 'cypher'
  });
}).then(function(xhr, response) {
  graphQueryResponse = response;

  // 5) Read the palette from the configuration
  return qwest.get('/api/config', {sourceIndex: source.configIndex});
}).then(function(xhr, response) {
  var palette = response.config.palette;

  // 6) Build a visualization
  var visualization =  {
    title: 'My new visualization',
    nodes: [],
    edges: [],
    design: {
      // apply default palette (from the configuration)
      palette: palette
    }
  };

  var edgeIndex = {}; // used to remove edge duplicates
  graphQueryResponse.forEach(function(node) {
    if (node.edges && node.edges.length) {
      node.edges.forEach(function(edge) {
        if (!edgeIndex[edge.id]) {
          visualization.edges.push({ id: edge.id });
        } else {
          edgeIndex[edge.id] = true;
        }
      });
    }

    // Random node coordinates: we should apply a layout instead
    node.x = Math.random() * 100;
    node.y = Math.random() * 100;

    visualization.nodes.push({
      id: node.id,
      nodelink: {
        x: node.x,
        y: node.y
      }
    });
  });

  visualization.design.styles = {
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

  // 7) Save the new visualization
  return qwest.post('/api/' + source.key + '/<EDIT_HERE>', visualization);
})
// the following callbacks validate your submission
.then(test)
.catch(error);
