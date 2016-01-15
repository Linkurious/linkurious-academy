function validate(answer) {
  return new Promise(function(resolve, reject) {
    qwest.get('http://crunchbase.linkurio.us/api/auth/authenticated', null, {
      cache: true
    })
    .then(reject) // still authenticated
    .catch(resolve); // unauthenticated OK
  });
}
