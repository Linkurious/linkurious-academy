function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer && answer.sources && answer.sources.length) {
      resolve();
    }
    else {
      reject();
    }
  });
}
