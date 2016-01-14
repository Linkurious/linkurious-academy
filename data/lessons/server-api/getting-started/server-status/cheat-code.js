var url = 'http://crunchbase.linkurio.us/api/status';

qwest.get(url, null, {
  cache: true // enable preflight requests
})

// the following callbacks validate your submission
.then(test)
.catch(error);
