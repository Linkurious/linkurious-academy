// set the domain of the Linkurious server
qwest.base = 'http://crunchbase.linkurio.us';

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

var loginData = {
  usernameOrEmail: 'Student 0',
  password: 'student0'
};

// send login data to login API endpoint
qwest.post('/api/auth/login', loginData)
// the following callbacks validate your submission
.then(test)
.catch(error);
