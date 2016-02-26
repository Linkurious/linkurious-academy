function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined && answer.visualization) {
      resolve();
    }
    else if (!answer) reject('Empty result');
    else reject();
  });
}
