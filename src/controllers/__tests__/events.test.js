const supertest = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../../app');


afterAll(async () => {

  await mongoose.connection.close();
  server.close();
});

jest.setTimeout(5000);

describe('event', () => {
  describe('getEventById /events/id', () => {

      it('sould return 404 if event not found', async () => {
        const eventId = '64c914c7de70babdefb4ad5';
        await supertest(app).get(`/events/${eventId}`).expect(404);
      });
      it('should return all the events 200 if event id is empty', async () => {
        const eventId = ' '; //
        await supertest(app).get(`/events/${eventId}`).expect(200);
      });
      it('sould return 404 if invalid  event ID', async () => {
        const eventId = 'event-123'; // not in mongodb id format
        await supertest(app).get(`/events/${eventId}`).expect(404);
      });
      it('sould return 200 if event is exist', async () => {
        const eventId = '64c914c7de70babdefb4ad59'; // exist in my db
        await supertest(app).get(`/events/${eventId}`).expect(200);
      });
    
  
    describe('create new event',()=>{
      
    })
  
  
    });















  
});
