var url = 'http://crunchbase.linkurio.us/api/auth/logout';

qwest.get(url, null, {
  cache: true,
  responseType: 'text' // No content should be returned
})
.then(test).catch(error);
