function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined) {
      resolve();
    }
    else reject();
  });
}
