var url = 'http://crunchbase.linkurio.us/api/<EDIT_HERE>';

qwest.get(url, null, { cache: true }).then(test).catch(error);
