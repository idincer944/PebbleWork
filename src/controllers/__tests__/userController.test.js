const { getAllUsers, signIn } = require('../userController'); // Adjust the path based on your project structure
const User = require('../../models/user'); // Adjust the path based on your project structure
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken'); // Import jwt

jest.mock('../../models/user.js', () => ({
  find: jest.fn().mockResolvedValue([
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
  ]),
}));
describe('getAllUsers', () => {
  test('should return all users', async () => {
    const req = {}; // Mock the request object if needed
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; // Mock the response object

    // Call the function with the mock req and res objects
    await getAllUsers(req, res);

    // Assert that the User.find() function was called
    expect(User.find).toHaveBeenCalledTimes(1);

    // Assert the response status and JSON data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' },
    ]);
  });

  // Test for the error scenario (optional)
  test('should handle error and return 500 status', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find() function to throw an error
    User.find.mockRejectedValue(new Error('Database error'));

    // Call the function with the mock req and res objects
    await getAllUsers(req, res);

    // Assert the response status and JSON data for the error scenario
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error while getting users',
    });
  });
});

// jest.mock('../../models/user.js', () => ({
//   findOne: jest.fn().mockResolvedValue({
//     username: 'testuser',
//     password_hash: 'hashed_password', // This should be the bcrypt-hashed password for the test user
//     is_verified: true, // You can adjust this value based on your test scenario
//   }),
// }));

// jest.mock('bcrypt', () => ({
//   compare: jest.fn().mockResolvedValue(true), // Always return true for bcrypt.compare in this test scenario
// }));

// const mockReq = (userData) => ({
//   body: userData,
// });

// const mockRes = () => {
//   const res = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   res.cookie = jest.fn().mockReturnValue(res);
//   return res;
// };

// describe('User Controller - signIn', () => {
//   it('should return 200 and user data on successful sign-in', async () => {
//     // Arrange
//     const req = {
//       body: {
//         username: 'testuser',
//         password: 'password123',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       cookie: jest.fn(),
//       redirect: jest.fn(),
//     };

//     // Mock User.findOne to return a user with a valid hashed password
//     User.findOne.mockResolvedValue({
//       _id: 'user-id',
//       username: 'testuser',
//       password_hash: await bcrypt.hash('password123', 10),
//       is_verified: true,
//     });

//     // Act
//     await signIn(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       _id: 'user-id',
//       username: 'testuser',
//       // ... other expected user data
//     });
//     // Additional assertions to check cookie and redirect behavior if needed
//   });

//   it('should return 400 when wrong username or password is provided', async () => {
//     // Arrange
//     const req = {
//       body: {
//         username: 'testuser',
//         password: 'wrongpassword',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//       cookie: jest.fn(),
//       redirect: jest.fn(),
//     };

//     // Mock User.findOne to return no user (user not found)
//     User.findOne.mockResolvedValue(null);

//     // Act
//     await signIn(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({
//       error: 'Wrong username or password',
//     });
//   });
// });

// // const mockJwtSign = jest.spyOn(jwt, 'sign');

// // // Assert that res.cookie was called with the correct arguments
// // expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), {
// //   httpOnly: true,
// //   secure: false,
// //   sameSite: 'strict',
// //   maxAge: 2 * 60 * 60 * 1000,
// // });
// // });

// // Test for invalid credentials scenario (optional)
// // test('should return 400 for wrong username or password', async () => {
// //   const req = mockReq({ username: 'wronguser', password: 'wrongpassword' });
// //   const res = mockRes();

// //   // Call the function with the mock req and res objects
// //   await signIn(req, res);

// //   // Assert the response status and JSON data for wrong credentials scenario
// //   expect(res.status).toHaveBeenCalledWith(400);
// //   expect(res.json).toHaveBeenCalledWith({
// //     error: 'Wrong username or password',
// //   });
// // });

// // Test for unverified email scenario (optional)
// // test('should return "Please verify your email address" for unverified user', async () => {
// //   const req = mockReq({
// //     username: 'unverifieduser',
// //     password: 'testpassword',
// //   });
// //   const res = mockRes();

// //   // Mock the User.findOne() to return an unverified user
// //   User.findOne.mockResolvedValueOnce({
// //     username: 'unverifieduser',
// //     password_hash: 'hashed_password', // This should be the bcrypt-hashed password for the test user
// //     is_verified: false,
// //   });

// //   // Call the function with the mock req and res objects
// //   await signIn(req, res);

// //   // Assert the response status and JSON data for unverified email scenario
// //   expect(res.send).toHaveBeenCalledWith('Please verify your email address');
// // });

// // // Test for error scenario (optional)
// // test('should handle error and log it', async () => {
// //   const req = mockReq({ username: 'testuser', password: 'testpassword' });
// //   const res = mockRes();

// //   // Mock the User.findOne() to throw an error
// //   User.findOne.mockRejectedValue(new Error('Database error'));

// //   // Mock the console.log to prevent actual logging during tests
// //   jest.spyOn(console, 'log').mockImplementation(() => {});

// //   // Call the function with the mock req and res objects
// //   await signIn(req, res);

// //   // Assert the response status and JSON data for the error scenario
// //   expect(res.status).toHaveBeenCalledWith(500);
// //   expect(res.json).toHaveBeenCalledWith({
// //     error: 'Internal Server Error while signing in',
// //   });

// //   // Assert that the error was logged
// //   expect(console.log).toHaveBeenCalledWith(expect.any(Error));
// // });
// // });
