function validate(answser) {
  return new Promise(function(resolve, reject) {
    if (answser == 42) {
      resolve();
    }
    else {
      reject();
    }
  });
}
