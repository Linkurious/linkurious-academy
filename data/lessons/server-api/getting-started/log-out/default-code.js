qwest.base = 'http://crunchbase.linkurio.us';
qwest.setDefaultOptions({withCredentials: true});

qwest.get('/api/<EDIT_HERE>')
.then(test).catch(error);
