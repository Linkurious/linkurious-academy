function validate(answer) {
  if (!answer) {
    Promise.reject('Cannot validate server response (undefined)');
  }
  if (!answer.status || answer.status.code !== 200)  {
    Promise.reject('Unexpected HTTP status');
  }
}
