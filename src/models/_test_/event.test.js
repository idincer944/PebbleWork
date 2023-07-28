const mongoose = require('mongoose');
const Event = require('../../models/event'); // Adjust the import path based on your project structure
let userId = new mongoose.Types.ObjectId();

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/test_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe('Event Model', () => {
  beforeEach(async () => {
    // Clear the events collection before each test.
    await Event.deleteMany({});
  });

  it('should create a new event', async () => {
    const eventData = {
      name: 'Test Event',
      location: 'Test Location',
      time: new Date(),
      description: 'This is a test event.',
      picture: 'test.jpg',
      createdBy: userId, // Replace with a valid User ID.
    };

    const newEvent = await Event.create(eventData);

    expect(newEvent).toBeDefined();
    expect(newEvent.name).toBe('Test Event');
    expect(newEvent.location).toBe('Test Location');
    // Add more assertions as needed based on your requirements.
  });

  it('should fetch an event by ID', async () => {
    const eventData = {
      name: 'Test Event',
      location: 'Test Location',
      time: new Date(),
      description: 'This is a test event.',
      picture: 'test.jpg',
      createdBy: userId, // Replace with a valid User ID.
    };

    const newEvent = await Event.create(eventData);

    const foundEvent = await Event.findById(newEvent._id);

    expect(foundEvent).toBeDefined();
    expect(foundEvent.name).toBe('Test Event');
    expect(foundEvent.location).toBe('Test Location');
    // Add more assertions as needed based on your requirements.
  });

  it('should add a participant to an event', async () => {
    const eventData = {
      name: 'Test Event',
      location: 'Test Location',
      time: new Date(),
      description: 'This is a test event.',
      picture: 'test.jpg',
      createdBy: userId, // Replace with a valid User ID.
    };

    const newEvent = await Event.create(eventData);

    const participantId = userId; // Replace with a valid User ID.

    newEvent.participants.push(participantId);
    await newEvent.save();

    const updatedEvent = await Event.findById(newEvent._id);

    expect(updatedEvent).toBeDefined();
    expect(updatedEvent.participants).toContainEqual(participantId);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
