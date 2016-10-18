qwest.base = 'http://crunchbase.linkurio.us';
qwest.setDefaultOptions({withCredentials: true});

var loginData = {
  usernameOrEmail: '<EDIT_HERE>',
  password: '<EDIT_HERE>'
};

qwest.post('/api/<EDIT_HERE>', loginData).then(test).catch(error);
