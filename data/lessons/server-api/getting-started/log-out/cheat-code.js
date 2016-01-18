var url = 'http://crunchbase.linkurio.us/api/auth/logout';

qwest.get(url, null, {
  cache: true,
  responseType: 'text' // bug https://github.com/pyrsmk/qwest/issues/102
})
.then(test).catch(error);
