const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../../app');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const {correctUser,
  incorrectUser1,
  incorrectUser2,
  unverifiedUser,
  adminUser,
  newUser} = require('../data')

jest.setTimeout(1500);

beforeAll(async () => {
const password_hash = await bcrypt.hash('testpassword', 10);
   // Create an admin user
   const adminUser = await new User({
     username: 'adminuser',
     firstname: 'Admin',
     lastname: 'User',
     password_hash: password_hash,
     email: 'admin@example.com',
     is_admin: true,
     is_verified: true,
     avatar: 'avatar-url',
   });
   await adminUser.save();

   // Create a user with an unverified account
   const unverifiedUser = await new User({
     username: 'unverifieduser',
     firstname: 'Unverified',
     lastname: 'User',
     password_hash: password_hash,
     email: 'unverifiedtest@example.com',
     is_admin: false,
     is_verified: false,
     avatar: 'avatar-url',
   })
   await unverifiedUser.save();

   const deleteUser = await new User ({
     firstname: 'deleteduser',
     lastname: 'deleteduser',
     username: 'deleteduser',
     password_hash: password_hash,
     email: 'deleteduser@example.com',
     is_admin: false,
     is_verified: true,
   })
   await deleteUser.save();
   
});

afterAll(async () => {
  await User.deleteMany({
    username: { $in: ['testuser', 'unverifieduser', 'adminuser', 'idincer944', 'deleteduser' ] },
  });
  await mongoose.connection.close();
  server.close();
});

describe('GET /', () => {
  let userToken;
  it('should return 200 and list of users for admin user', async () => {
    // Login as admin user to get the token
    const adminLoginResponse = await request(app)
      .post('/users/signin')
      .send(adminUser);

    // Make request to get all users as admin
    const response = await request(app)
      .get('/users')
      .set('Cookie', adminLoginResponse.header['set-cookie']);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
  });

  it('should return 403 for non-admin user', async () => {
    const response = await request(app)
      .get('/users')
      .set('Cookie', [`token=${userToken}`]);
    expect(response.status).toBe(403);
  });
});

describe('POST /signin', () => {
  it('should signs in user successfully', async () => {
    const response = await request(app)
      .post('/users/signin')
      .send(correctUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"message": "Hello John, you have successfully logged in!"});
    // Retrieve the Set-Cookie header from the response
    const cookies = response.get('Set-Cookie');
    expect(cookies).toBeDefined();

    // Check if the token cookie is present
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    expect(tokenCookie).toBeDefined();
  });

  it('should return 401 for invalid username', async () => {
    const response = await request(app)
      .post('/users/signin')
      .send({incorrectUser1});
    expect(response.status).toBe(401);
    expect(response.body).toEqual({"error": "Wrong username or password"});

  });
  
  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/users/signin')
      .send({incorrectUser2});
    expect(response.status).toBe(401);
    expect(response.body).toEqual({"error": "Wrong username or password"});
  });

  it('should send another verification email for unverified user', async () => { // still not controlling if it actually sending the mail or not
    const response = await request(app)
      .post('/users/signin')
      .send({...unverifiedUser, is_verified: false})
      expect(response.status).toBe(201);
      expect(response.body).toEqual({"message": "Hello Unverified, apparently you have not verify your email yet! 🎉 Please check your email for the new verification link. 🌟"})       
  });
});

describe('POST /signup', () => {

  it('should return 200 and JWT token for registered user', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ "message": `Hello ${newUser.firstname}, Congratulations on successfully registering! 🎉 Please check your email for a verification link. 🌟`});
    // Retrieve the Set-Cookie header from the response
    const cookies = response.get('Set-Cookie');
    expect(cookies).toBeDefined();

    // Check if the token cookie is present
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    expect(tokenCookie).toBeDefined();
    await User.deleteOne({username: newUser.username})
  });

  it('should return 400 if username already exists', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({...newUser, username: "johndoe"});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({"error": "Username already exists"});
  });

  it('should return 400 if email already exists', async () => {
    const response = await request(app)
      .post('/users/signup')
      .send({...newUser, email: "johndoe@example.com"});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({"error": "Email already exists"});
  });
});

describe('DELETE /:id', () => {
  it('should return 200 for admin user', async () => {
    const adminLoginResponse = await request(app)
      .post('/users/signin')
      .send(adminUser)

    const deletedUser = await User.findOne({username: 'deleteduser'});
    const response = await request(app)
      .delete(`/users/${deletedUser._id}`)
      .set('Cookie', adminLoginResponse.header['set-cookie']);   
    expect(response.status).toBe(200);
    expect(response.body).toEqual(`User ${deletedUser.username} deleted`);
      // Verify if the user is deleted from the database
    const deletedUserInDB = await User.findById(deletedUser._id);
    expect(deletedUserInDB).toBeNull();
  });
});

describe('GET /signout', () => {
  it('should clear the token cookie and redirect to the home page', async () => {

    const userResponseData = await request(app)
      .post('/users/signin')
      .send(correctUser);

    // Make a request to the signout route
    const response = await request(app)
      .get('/users/signout')
      .set('Cookie', userResponseData.header['set-cookie']);
    // Check that the response status is a redirect (status code 302)
    expect(response.status).toBe(302);

    // Check that the response contains the "Location" header with the home page URL
    expect(response.header.location).toBe('/');

    // Check that the "Set-Cookie" header is present and contains the "token" cookie with an empty value
    const cookies = response.header['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((cookie) => cookie.startsWith('token='))).toBe(true);
  });

  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).get('/users/signout');
    expect(response.status).toBe(401);
  });
});

describe('GET /verify', () => {
  it('should return 201 and update user is_verified to true', async () => {
    const unverifiedUser = {
      username: 'unverifieduser',
      password: 'testpassword'
    }

    const userResponseData = await request(app)
      .post('/users/signin')
      .send(unverifiedUser);

    const response = await request(app)
      .get('/users/verify')
      .set('Cookie', userResponseData.header['set-cookie']);
    // Check the response status
    expect(response.status).toBe(201);

    // Check the response body message
    expect(response.body).toEqual({
      message: `Congratulations! Unverified 🎉 Your email has been successfully verified. Welcome to our community! 🌟`,
    });
    // Check if the user's is_verified field is updated in the database
    const updatedUser = await User.findOne({username: 'unverifieduser'});
    expect(updatedUser.is_verified).toBe(true);
  });

  it('should return 500 for invalid token', async () => {
    const invalidToken = 'invalid.token';

    const response = await request(app)
      .get('/users/verify') // Assuming that your verifyEmail route is a GET request, adjust accordingly if it's a POST request.
      .set('Cookie', `token=${invalidToken}`);

    // Check the response status
    expect(response.status).toBe(500);
  });
});

describe('GET /profile', () => {
  it('should return 200 and user profile', async () => {
    const userResponseData = await request(app)
      .post('/users/signin')
      .send(correctUser);

    const response = await request(app)
      .get('/users/profile')
      .set('Cookie', userResponseData.header['set-cookie']);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      avatar: "avatar-url",
      email: "johndoe@example.com",
      fullName: "John Doe",
      username: "johndoe"
    });
  });

  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).get('/users/profile');
    expect(response.status).toBe(401);
  });
});

describe('GET /:id', () => {
  it('should return 200 and user profile', async () => {
    const response = await request(app)
      .get(`/users/64d0d2d19684497fcb473be4`)

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      avatar: "avatar-url",
      fullName: "John Doe",
      username: "johndoe"
    });
  });

  it('should return 404 for invalid user id', async () => {
    const invalidId = '64d0d2d19685577fcb473be4'
    const response = await request(app)
      .get(`/users/${invalidId}`)

    expect(response.status).toBe(404);
    expect(response.body).toEqual({error: 'User not found'});
  });
});

describe('PUT /profile', () => {
  it('should return 200 and updated user profile', async () => {
    const userResponseData = await request(app)
      .post('/users/signin')
      .send(correctUser);

    const response = await request(app)
      .put('/users/profile')
      .set('Cookie', userResponseData.header['set-cookie'])
      .send({
        fullName: "John Smith",
        avatar: "new-avatar-url"
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(`User ${correctUser.username} updated`);
    // Check if the user's profile is updated in the database
    const updatedUser = await User.findOne({username: correctUser.username})
    expect(updatedUser.fullName).toBe('John Smith');
    expect(updatedUser.avatar).toBe('new-avatar-url');

    await User.findOneAndUpdate({username: correctUser.username}, {lastname: 'Doe', avatar: 'avatar-url'});
  });

  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).put('/users/profile');
    expect(response.status).toBe(401);
  });
});

describe('PUT /change-password', () => {
  it('should return 200 and change password', async () => {
    const passwords = {
      oldPassword: 'testpassword',
      newPassword1: 'newpassword',
      newPassword2: 'newpassword'
    }

    const userResponseData = await request(app)
    .post('/users/signin')
    .send(correctUser);

    const response = await request(app)
    .put('/users/change-password')
    .set('Cookie', userResponseData.header['set-cookie'])
    .send(passwords);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(`Password changed successfully`);
  });
});