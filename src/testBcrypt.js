const bcrypt = require('bcrypt');

async function testPasswordHashing() {
  const plainPassword = 'test1234'; 

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  console.log('Hashed Password:', hashedPassword);

  const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password match:', passwordMatch);

  const wrongPasswordMatch = await bcrypt.compare('wrongPassword', hashedPassword);
  console.log('Wrong password match:', wrongPasswordMatch);
}

testPasswordHashing();
