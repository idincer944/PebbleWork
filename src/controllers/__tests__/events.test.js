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

describe('GET /events', () => {
  it('should return all events', async () => {
    const eventPayload1 = {
      name: 'New Event 1',
      location: 'San Francisco',
      time: '2023-03-08T12:00:00',
      description: 'This is a new event',
      picture: 'https://picsum.photos/200/300',
      category: 'other',
      maxParticipants: 100,
      registrationDeadline: '2023-03-07T12:00:00',
      eventWebsite: 'https://example.com/new_event_1',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9148',
    };

    const eventPayload2 = {
      name: 'New Event 2',
      location: 'New York City',
      time: '2023-03-09T12:00:00',
      description: 'This is another new event',
      picture: 'https://picsum.photos/200/300',
      category: 'animals',
      maxParticipants: 200,
      registrationDeadline: '2023-03-08T12:00:00',
      eventWebsite: 'https://example.com/new_event_2',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9149',
    };

    const event1 = new Event(eventPayload1);
    const event2 = new Event(eventPayload2);
    await event1.save();
    await event2.save();

    const response = await request(app)
      .get('/events');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toEqual(event1.name);
    expect(response.body[0].location).toEqual(event1.location);
    expect(response.body[0].category).toEqual(event1.category);
    expect(response.body[1].name).toEqual(event2.name);
    expect(response.body[1].location).toEqual(event2.location);
    expect(response.body[1].category).toEqual(event2.category);
  });
});


describe('GET /events/search', () => {
  it('should return events that match the search query', async () => {
    const eventPayload1 = {
      name: 'New Event 1',
      location: 'San Francisco',
      time: '2023-03-08T12:00:00',
      description: 'This is a new event about cats',
      picture: 'https://picsum.photos/200/300',
      category: 'animals',
      maxParticipants: 100,
      registrationDeadline: '2023-03-07T12:00:00',
      eventWebsite: 'https://example.com/new_event_1',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9148',
    };

    const eventPayload2 = {
      name: 'New Event 2',
      location: 'New York City',
      time: '2023-03-09T12:00:00',
      description: 'This is another new event about dogs',
      picture: 'https://picsum.photos/200/300',
      category: 'animals',
      maxParticipants: 200,
      registrationDeadline: '2023-03-08T12:00:00',
      eventWebsite: 'https://example.com/new_event_2',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9149',
    };

    const event1 = new Event(eventPayload1);
    const event2 = new Event(eventPayload2);
    await event1.save();
    await event2.save();

    const response = await request(app)
      .get('/events/search?q=cats');

    expect(response.status).toBe(200);
    expect(response.body.events).toHaveLength(1);
    expect(response.body.events[0].name).toEqual(event1.name);
    expect(response.body.events[0].description).toEqual(event1.description);
    expect(response.body.events[0].category).toEqual(event1.category);
  });

  it('should return an empty array if no events match the search query', async () => {
    const response = await request(app)
      .get('/events/search?q=dogs');

    expect(response.status).toBe(200);
    expect(response.body.events).toEqual([]);
  });
});


describe('GET /events/filter', () => {
  it('should return events that match the search query, start date, end date, location, and category', async () => {
    const eventPayload1 = {
      name: 'New Event 1',
      location: 'San Francisco',
      time: '2023-03-08T12:00:00',
      description: 'This is a new event about cats',
      picture: 'https://picsum.photos/200/300',
      category: 'animals',
      maxParticipants: 100,
      registrationDeadline: '2023-03-07T12:00:00',
      eventWebsite: 'https://example.com/new_event_1',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9148',
    };

    const eventPayload2 = {
      name: 'New Event 2',
      location: 'New York City',
      time: '2023-03-09T12:00:00',
      description: 'This is another new event about dogs',
      picture: 'https://picsum.photos/200/300',
      category: 'animals',
      maxParticipants: 200,
      registrationDeadline: '2023-03-08T12:00:00',
      eventWebsite: 'https://example.com/new_event_2',
      isPublished: true,
      createdBy: '64b0336848fc2bc758de9149',
    };

    const event1 = new Event(eventPayload1);
    const event2 = new Event(eventPayload2);
    await event1.save();
    await event2.save();

    const response = await request(app)
      .get('/events/filter?searchQuery=cats&startDate=2023-03-08&endDate=2023-03-09&location=San+Francisco&category=animals');

    expect(response.status).toBe(200);
    expect(response.body.events).toHaveLength(1);
    expect(response.body.events[0].name).toEqual(event1.name);
    expect(response.body.events[0].description).toEqual(event1.description);
    expect(response.body.events[0].category).toEqual(event1.category);
  });

  it('should return an empty array if no events match the filters', async () => {
    const response = await request(app)
      .get('/events/filter?searchQuery=dogs&startDate=2066-03-08&endDate=2023-03-09&location=San+Francisco&category=animals');
  
    expect(response.status).toBe(404);
    expect(response.body).toEqual({message: 'There are no events found with these filters'});
   
  });
  
});

/*
describe('POST /events', () => {
  it('should create a new event if the request body is valid', async () => {
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

    const response = await request(app)
      .post('/events')
      .send(eventPayload);

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(eventPayload.name);
    expect(response.body.location).toEqual(eventPayload.location);
    expect(response.body.time).toEqual(eventPayload.time);
    expect(response.body.description).toEqual(eventPayload.description);
    expect(response.body.picture).toEqual(eventPayload.picture);
    expect(response.body.category).toEqual(eventPayload.category);
  });

  it('should return a validation error if the request body is invalid', async () => {
    const eventPayload = {
      name: '',
      location: '',
      time: '',
      description: '',
      picture: '',
      category: '',
    };

    const response = await request(app)
      .post('/events')
      .send(eventPayload);

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(5);
    expect(response.body.errors[0].field).toEqual('name');
    expect(response.body.errors[0].message).toEqual('This field is required.');
    expect(response.body.errors[1].field).toEqual('location');
    expect(response.body.errors[1].message).toEqual('This field is required.');
    expect(response.body.errors[2].field).toEqual('time');
    expect(response.body.errors[2].message).toEqual('This field is required.');
    expect(response.body.errors[3].field).toEqual('description');
    expect(response.body.errors[3].message).toEqual('This field is required.');
    expect(response.body.errors[4].field).toEqual('category');
    expect(response.body.errors[4].message).toEqual('This field is required.');
  });
});
*/