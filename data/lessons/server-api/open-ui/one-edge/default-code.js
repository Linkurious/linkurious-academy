var BASE_URL = 'http://crunchbase.linkurio.us';
qwest.base = BASE_URL;
qwest.setDefaultOptions({withCredentials: true});

// 1) log-in
var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
qwest.post('/api/auth/login', loginData).then(function() {

  // 2) open a new visualization with one edge
  var edgeId = 15904;
  window.open(BASE_URL + '/workspace/new?populate=<EDIT_HERE>&item_id=' + edgeId);

}).then(test).catch(error);