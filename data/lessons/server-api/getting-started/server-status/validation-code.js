function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer && answer.status && answer.status.code == 200) {
      resolve();
    }
    else {
      reject();
    }
  });
}
