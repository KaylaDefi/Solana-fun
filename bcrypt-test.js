const bcrypt = require('bcrypt');

const password = 'test1234';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Generated Hash:', hash);
  }
});
