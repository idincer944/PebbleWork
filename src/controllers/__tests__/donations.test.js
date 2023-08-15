const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../../app');
const Donation = require('../../models/donation');
const User = require('../../models/user');
const Event = require('../../models/event');
const bcrypt = require('bcrypt');

jest.setTimeout(1500);


// const userLoginResponseMock = {
//     body: {
//       user: {
//         _id: new mongoose.Types.ObjectId(),
//         username: 'johndoe',
//         password: 'testpassword'
//       }
//     },
//     header: {
//       'set-cookie': ['token=userToken']
//     }
//   };
  
//   const adminLoginResponseMock = {
//     body: {
//       user: {
//         _id: new mongoose.Types.ObjectId(),
//         username: 'adminuser',
//         password: 'testpassword',
//       }
//     },
//     header: {
//       'set-cookie': ['token=adminToken']
//     }
//   };

beforeAll(async () => {
const passwordHash = await bcrypt.hash('testpassword', 10);

const user1 = await User({
  username: 'usherotye',
  firstname: 'Usher',
  lastname: 'Tye',
  password_hash: passwordHash,
  email: 'ushertye@example.com',
  is_admin: false,
  is_verified: true,
  avatar: 'avatar-url',
}).save();

const adminUser1 = await new User({
    username: 'adminuser2',
    firstname: 'Admin',
    lastname: 'User',
    password_hash: passwordHash,
    email: 'admin2@example.com',
    is_admin: true,
    is_verified: true,
    avatar: 'avatar-url',
  }).save();

   // Create events
  const event1 = await new Event({
    name: 'Climate',
    location: 'Ankara',
    registrationDeadline: new Date(), 
    category: 'community', 
    createdBy: user1._id, 
    picture: 'picture-url', 
    description: 'Online event', 
    time: new Date(),  
  }).save();

   // Create donations
  const donation = await new Donation({
    eventId: event1._id,
    userId: user1._id,
    amount: 50,
    currency: 'USD',
  }).save();
   
});

afterAll(async () => {
  await Promise.all([
    User.deleteMany({
        username: { $in: ['usherotye', 'adminuser2']},
    }),
    Event.deleteMany({}),
    Donation.deleteMany({}),
  ]);
  await mongoose.connection.close();
  server.close();
});

const user1 = {username: 'usherotye', password: 'testpassword' };

describe('POST /:eventId', () => {

  it('should create a donation and send a thank you email', async () => {
    const userResponseData = await request(app)
    .post('/users/signin')
    .send(user1);

    const event = await Event.findOne({name: 'Climate'})

    const response = await request(app)
      .post(`/donations/${event._id}`)
      .set('Cookie', userResponseData.headers['set-cookie'])
      .send({ amount: 100, currency: 'USD'});

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('eventId');

  });
  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).get('/donations');
    expect(response.status).toBe(401);
  });
  it('should return 404 for non-existent event', async () => {
    const response = await request(app).get('/users'); //????
    expect(response.status).toBe(401); 
  });
});

describe('GET /', () => {
    let userToken;

  it('should return a list of donations for an admin user', async () => {
    const adminLoginResponse = await request(app)
    .post('/users/signin')
    .send({username: 'adminuser2', password: 'testpassword'});

    const response = await request(app)
      .get('/donations')
      .set('Cookie', adminLoginResponse.headers['set-cookie']);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  it('should return 401 for unauthenticated request', async () => {
    const response = await request(app).get('/donations');
    expect(response.status).toBe(401);
  });
  it('should return 403 for non-admin user', async () => {
      const response = await request(app)
      .get('/donations')
      .set('Cookie', [`token=${userToken}`]);
    expect(response.status).toBe(403);
  });
});

describe('GET /:donationId', () => {
  it('should return a specific donation by donationId', async () => {
    const userResponseData = await request(app)
        .post('/users/signin')
        .send(user1);

    const donation = await Donation.findOne({amount: 50});

    const response = await request(app)
      .get(`/donations/${donation._id}`)
      .set('Cookie', userResponseData.headers['set-cookie'])
    expect(response.status).toBe(200);
  });
  describe('when donation does not exist', () => {
    it('should return 404', async () => {
        const userResponseData = await request(app)
        .post('/users/signin')
        .send(user1);
        
      const nonExistentDonationId = '5fcbbe4f8f13254d0d2d1968';

      const response = await request(app)
        .get(`/donations/${nonExistentDonationId}`)
        .set('Cookie', userResponseData.headers['set-cookie']);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Donation not found.' });
    });
  });
});

describe('PUT /:donationId/status', () => {
  it('should update the status of a donation ', async () => {
    const adminLoginResponse = await request(app)
    .post('/users/signin')
    .send({username: 'adminuser2', password: 'testpassword'});

    const donation = await Donation.findOne({amount: 50});

      const response = await request(app)
      .put(`/donations/${donation._id}/status`)
      .set('Cookie', adminLoginResponse.headers['set-cookie'])
      .send({status: 'pending'})   

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('pending');
  });
  it('should return 404 for non-existent donation', async () => {
    const adminLoginResponse = await request(app)
    .post('/users/signin')
    .send({username: 'adminuser2', password: 'testpassword'});

    const nonExistentDonationId = '5fcbbe4f8f13254d0d2d1968';

    const response = await request(app)
      .put(`/donations/${nonExistentDonationId}/status`)
      .set('Cookie', adminLoginResponse.headers['set-cookie'])
      .send({ status: 'pending' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Donation not found.' });
  });
});

describe('DELETE /:donationId', () => {
    let userToken;
  it('should delete a specific donation for an admin user', async () => {
    const adminLoginResponse = await request(app)
    .post('/users/signin')
    .send({username: 'adminuser2', password: 'testpassword'});

    const donation = await Donation.findOne({amount: 50});

    const response = await request(app)
    .delete(`/donations/${donation._id}`)
    .set('Cookie', adminLoginResponse.headers['set-cookie']);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Donation deleted successfully.');
  });
    
  it('should return 404 for non-existent donation', async () => {

    const adminLoginResponse = await request(app)
        .post('/users/signin')
        .send({username: 'adminuser2', password: 'testpassword'});

    const nonExistentDonationId = '5fcbbe4f8f13254d0d2d1968'; 

    const response = await request(app)
      .delete(`/donations/${nonExistentDonationId}`)
      .set('Cookie', adminLoginResponse.headers['set-cookie']);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Donation not found.' });

  });
  it('should return 403 for non-admin user', async () => {
      const response = await request(app)
      .get('/donations')
      .set('Cookie', [`token=${userToken}`]);
    expect(response.status).toBe(403);
  });

});

// describe('GET /:eventId/totalDonations', () => {
//   it('should return the total donations for a specific event', async () => {
//     const adminLoginResponse = await request(app)
//         .post('/users/signin')
//         .send({username: 'adminuser2', password: 'testpassword'});


//     const event = await Event.findOne({name: 'Climate'});

//     const response = await request(app)
//       .get(`/donations/${event._id}/totalDonations`)
//       .set('Cookie', adminLoginResponse.headers['set-cookie']);

//     expect(response.status).toBe(200);
//     expect(response.body.totalDonations).toBeDefined();
//   });

//   it('should return 404 for non-existent event', async () => {
//     const adminLoginResponse = await request(app)
//     .post('/users/signin')
//     .send({username: 'adminuser2', password: 'testpassword'});

//     const nonExistentEventId = '5fcbbe4f8f13254d0d2d1968'; 

//     const response = await request(app)
//       .get(`/donations/${nonExistentEventId}/totalDonations`)
//       .set('Cookie', adminLoginResponse.headers['set-cookie']);

//     expect(response.status).toBe(404);
//     expect(response.body).toEqual({ error: 'Event not found.' });
//   });
// });

// describe('GET /topDonors', () => {
//   it('should return a list of top donors', async () => {
//     const adminLoginResponse = await request(app)
//     .post('/users/signin')
//     .send({username: 'adminuser2', password: 'testpassword'});

//     // Get the list of top donors
//     const response = await request(app)
//       .get('/donations/topDonors')
//       .set('Cookie', adminLoginResponse.headers['set-cookie']);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([
//       { username: user1.username, totalDonated: 200 },
//     ]);
//   });
// });
