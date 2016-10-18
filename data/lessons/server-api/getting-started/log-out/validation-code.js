function validate(answer) {
  qwest.base = '';
  return  qwest.get(
    'http://crunchbase.linkurio.us/api/auth/authenticated',
    null,
    {withCredentials: true}
  ).then(function() {
    // still authenticated
    return Promise.reject('You are still authenticated with Linkurious');
  }, function(xhr, response, e) {
    // check the error
    if (e.key !== 'unauthorized') {
      return Promise.reject(e)
    }
  });
}
