function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined && answer.id !== undefined) {
      resolve();
    }
    else reject();
  });
}
