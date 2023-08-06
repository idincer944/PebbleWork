// require('dotenv').config({ path: '../../.env.test' });
// const request = require('supertest');
// const mongoose = require('mongoose');
// const { app, server } = require('../../app');
// const User = require('../../models/user');
// const bcrypt = require('bcrypt');

// beforeAll(async () => {
//   // Register a test user
//   const password_hash = await bcrypt.hash('testpassword', 10);
//   const testUser = new User({
//     username: 'testuser',
//     firstname: 'Test',
//     lastname: 'User',
//     password_hash: password_hash,
//     email: 'test@example.com',
//     is_admin: false,
//     is_verified: true,
//     avatar: 'avatar-url',
//   });

//   await testUser.save();

//   // Create an admin user
//   const adminUser = new User({
//     username: 'adminuser',
//     firstname: 'Admin',
//     lastname: 'User',
//     password_hash: password_hash,
//     email: 'admin@example.com',
//     is_admin: true,
//     is_verified: true,
//     avatar: 'avatar-url',
//   });
//   await adminUser.save();

//   // Create a user with an unverified account
//   const unverifiedUser = new User({
//     username: 'unverifieduser',
//     firstname: 'Unverified',
//     lastname: 'User',
//     password_hash: password_hash,
//     email: 'unverifiedtest@example.com',
//     is_admin: false,
//     is_verified: false,
//     avatar: 'avatar-url',
//   });
//   await unverifiedUser.save();
// });

// afterAll(async () => {
//   await User.deleteOne({ username: 'testuser' });
//   await User.deleteOne({ username: 'unverifieduser' });
//   await User.deleteOne({ username: 'adminuser' });
//   await mongoose.connection.close();
//   server.close();
// });

// describe('User Routes', () => {
//   let userToken; // To store the JWT token for authenticated requests

//   describe('GET /', () => {
//     it('should return 200 and list of users for admin user', async () => {
//       // Login as admin user to get the token
//       const loginData = {
//         username: 'adminuser',
//         password: 'testpassword',
//         rememberMe: false,
//       };
//       const adminLoginResponse = await request(app)
//         .post('/users/signin')
//         .send(loginData);

//       // Make request to get all users as admin
//       const response = await request(app)
//         .get('/users')
//         .set('Cookie', adminLoginResponse.header['set-cookie']);
//       expect(response.status).toBe(200);
//       expect(Array.isArray(response.body)).toBe(true);
//     });

//     it('should return 401 for unauthenticated request', async () => {
//       const response = await request(app).get('/users');
//       expect(response.status).toBe(401);
//     });

//     it('should return 403 for non-admin user', async () => {
//       const response = await request(app)
//         .get('/users')
//         .set('Cookie', [`token=${userToken}`]);
//       expect(response.status).toBe(403);
//     });
//   });

//   describe('POST /signin', () => {
//     const testUser = {
//       username: 'testuser',
//       password: 'testpassword',
//       rememberMe: false,
//     };
//     it('should return 200 and JWT token for authenticated user', async () => {
//       const response = await request(app).post('/users/signin').send(testUser);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({
//         message: 'Hello Test, you have successfully logged in!',
//       });
//     });

//     it('should return 401 for invalid username', async () => {
//       const response = await request(app)
//         .post('/users/signin')
//         .send({ ...testUser, username: 'wrongusername' });
//       expect(response.status).toBe(401);
//       expect(response.body).toEqual({ error: 'Wrong username or password' });
//     });

//     it('should return 401 for invalid password', async () => {
//       const response = await request(app)
//         .post('/users/signin')
//         .send({ ...testUser, password: 'wrongpassword' });
//       expect(response.status).toBe(401);
//       expect(response.body).toEqual({ error: 'Wrong username or password' });
//     });

//     it('should send another verification email for unverified user', async () => {
//       // still not controlling if it actually sending the mail or not
//       const response = await request(app)
//         .post('/users/signin')
//         .send({ ...testUser, username: 'unverifieduser' });
//       expect(response.status).toBe(201);
//       expect(response.body).toEqual({
//         message:
//           'Hello Unverified, apparently you have not verify your email yet! 🎉 Please check your email for the new verification link. 🌟',
//       });
//     });
//   });
// });
