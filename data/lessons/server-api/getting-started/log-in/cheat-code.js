var url = 'http://crunchbase.linkurio.us/api/auth/login';
var data = {
  usernameOrEmail: 'Student 0',
  password: 'student0',
};

qwest.post(url, data, {
  cache: true // enable preflight requests
})

// the following callbacks validate your submission
.then(test)
.catch(error);
