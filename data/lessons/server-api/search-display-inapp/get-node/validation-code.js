function validate(answer) {
  if (!answer || answer.id === undefined) {
    return Promise.reject('No node info loaded');
  }
}
