var url = 'http://crunchbase.linkurio.us/api/auth/logout';

qwest.get(url, null, {
  cache: true
})
.then(test).catch(error);
