function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined && answer.nodes !== undefined && answer.edges !== undefined) {
      resolve();
    }
    else reject();
  });
}
