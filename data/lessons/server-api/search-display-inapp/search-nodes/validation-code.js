function validate(answer) {
  return new Promise(function(resolve, reject) {
    if (answer !== undefined && answer.type === 'node' && answer.totalHits > 0) {
      resolve();
    }
    else if (!answer) reject('Empty result object');
    else if (answer.type !== 'node') reject('Result type should be "node"');
    else if (answer.totalHits <= 0) reject('No results found');
  });
}
