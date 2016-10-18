// set the domain of the Linkurious server
qwest.base = 'http://crunchbase.linkurio.us';

qwest.setDefaultOptions({
  // enable cookies in cross-domain requests
  withCredentials: true
});

// request the list of data-sources
qwest.get('/api/dataSources')
// the following callbacks validate your submission
.then(test)
.catch(error);
