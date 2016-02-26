function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined && answer.length) {
      resolve();
    }
    else if (!answer) reject('Empty result');
    else reject('Unknown error');
  });
}
