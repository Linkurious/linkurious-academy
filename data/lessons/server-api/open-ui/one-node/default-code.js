var BASE_URL = 'http://crunchbase.linkurio.us';
qwest.base = BASE_URL;
qwest.setDefaultOptions({withCredentials: true});

// 1) log-in
var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
qwest.post('/api/auth/login', loginData).then(function() {

  // 2) open a new visualization with one node
  var nodeId = 7396;
  window.open(BASE_URL + '/workspace/new?populate=<EDIT_HERE>&item_id=' + nodeId);

}).then(test).catch(error);