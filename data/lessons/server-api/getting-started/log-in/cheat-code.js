var url = 'http://crunchbase.linkurio.us/api/auth/login';
var data = {
  usernameOrEmail: 'Student 0',
  password: 'student0',
};

qwest.post(url, data, {
  withCredentials: true // enable cookies in cross-domain requests
})
// the following callbacks validate your submission
.then(test)
.catch(error);
