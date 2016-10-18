function validate(answer) {
  if (answer != 42) {
    return Promise.reject('Edit the "answer" variable.');
  }
}
