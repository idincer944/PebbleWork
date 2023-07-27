const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('../../models/user'); // Adjust the path to your actual userSchema file.

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe('User Model', () => {
  beforeAll(async () => {
    await User.deleteMany({}); // Clear the users collection before each test.
  });

  it('should create a new user', async () => {
    const userData = {
      username: 'engbaraah',
      firstname: 'Baraah',
      lastname: 'Masri',
      password_hash: 'somehashedpassword',
      email: 'testBaraah@example.com',
    };

    const newUser = await User.create(userData);

    expect(newUser).toBeDefined();
    expect(newUser.username).toBe('engbaraah');
    expect(newUser.firstname).toBe('Baraah');
    expect(newUser.lastname).toBe('Masri');
    // Add more assertions as needed based on your requirements.
  });

  it('should slugify the username', async () => {
    const userData = {
      username: 'Eng Baraah!@#$',
      password_hash: 'somehashedpassword',
      email: 'testBaraah@example.com',
    };

    const newUser = await User.create(userData);

    expect(newUser).toBeDefined();
    expect(newUser.username).toBe('eng.baraah');
    // Add more assertions if you have additional slugification rules.
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
