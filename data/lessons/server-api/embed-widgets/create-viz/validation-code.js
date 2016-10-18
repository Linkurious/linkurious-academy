function validate(answer) {
  if (!answer) {
    return Promise.reject('Empty result');
  }
  if (!answer.visualization) {
    return Promise.reject('"visualization" field not found in response');
  }
}
