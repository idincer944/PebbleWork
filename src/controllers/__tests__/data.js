const correctUser = {
  username: 'johndoe',
  password: 'testpassword'
}
const incorrectUser1 = {
  username: 'wrongusername',
  password: 'testpassword'
};
const incorrectUser2 = {
  username: 'johndoe',
  password: 'wrongpassword'
};

const unverifiedUser = {
  username: 'unverifieduser',
  password: 'testpassword'
}
const adminUser = {
  username: 'adminuser',
  password: 'testpassword',
}
// to test signup
const newUser = {
  firstname: 'Test',
  lastname: 'User',
  username: 'testuser',
  password: 'testpassword',
  password2: 'testpassword',
  email: 'test@example.com',
  acceptTos: true,
  avatar: 'avatar-url',
}
module.exports = {
  correctUser,
  incorrectUser1,
  incorrectUser2,
  unverifiedUser,
  adminUser,
  newUser
}