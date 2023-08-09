const request = require('supertest');
const {app, server} = require('../../app');
const mongoose = require('mongoose');
const Event = require('../../models/event');
beforeAll(async () => {

});


afterEach(async () => {
  await mongoose.connection.dropDatabase();
});


afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('GET /events/:id', () => {
  it('should return the event', async () => {
    const eventPayload = {
      name: 'New Event',
      location: 'San Francisco',
      time: '2023-03-08T12:00:00',
      description: 'This is a new event',
      picture: 'https://picsum.photos/200/300',
      category: 'health',
      maxParticipants: 100,
      registrationDeadline: '2023-03-07T12:00:00',
      eventWebsite: 'https://example.com/new_event',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9148',
    };

    const event = new Event(eventPayload);
    await event.save();

    const response = await request(app)
      .get('/events/' + event._id);

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual(event.name);
    expect(response.body.location).toEqual(event.location);
    expect(response.body.category).toEqual(event.category);
  });

  it('should return 404 for invalid event ID', async () => {
    const response = await request(app)
      .get('/events/invalid-id');

    expect(response.status).toBe(404);
  });
});



//*********************************** */
