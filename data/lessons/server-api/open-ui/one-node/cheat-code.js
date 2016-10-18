var BASE_URL = 'http://crunchbase.linkurio.us';

// set the domain of the Linkurious server
qwest.base = BASE_URL;

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

// 1) log-in
var loginData = {usernameOrEmail: 'Student 0', password: 'student0'};
qwest.post('/api/auth/login', loginData).then(function() {

  // 2) open a new visualization with one node
  var nodeId = 7396;
  window.open(BASE_URL + '/workspace/new?populate=nodeId&item_id=' + nodeId);

})
// the following callbacks validate your submission
.then(test)
.catch(error);
