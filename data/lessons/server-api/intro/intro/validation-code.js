function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer == 42) {
      resolve();
    }
    else {
      reject('Edit the "answer" variable.');
    }
  });
}
