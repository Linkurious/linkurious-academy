function validate(answer) {
  if (!answer) {
    return Promise.reject('Empty result');
  }
  if (!answer.length) {
    return Promise.reject('Unknown error');
  }
}
