var BASE_URL = 'http://crunchbase.linkurio.us';

// set the domain of the Linkurious server
qwest.base = BASE_URL;

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

var searchQuery = '<EDIT_HERE>';
var populate = 'searchNodes'; // 'searchNodes' or 'searchEdges'
var fuzziness = 0.6; // range: 0..1
var doLayout = true;
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

  // 4) open a visualization with nodes matching [searchQuery]
  window.open(BASE_URL + '/workspace/new' +
    '?source=' + source.key +
    '&populate=' + populate +
    '&search_query=' + encodeURIComponent(searchQuery) +
    '&search_fuzziness=' + fuzziness,
    '&do_layout=' + doLayout
  );
})
// the following callbacks validate your submission
.then(test)
.catch(error);
