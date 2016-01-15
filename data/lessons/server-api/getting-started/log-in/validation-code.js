function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer && answer.user && answer.user.username && answer.user.username.length) {
      resolve();
    }
    else {
      reject();
    }
  });
}
