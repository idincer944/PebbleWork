# Backend-Capstone-procect



**ÇİĞKOFTES** is a platform to organize volunteer local events and gatherings to create meaningful work and an impact. The website will allow users to find and participate in volunteer events in their community, as well as create their own events and invite others to join. PebbleWork will also allow users to **donate** to events, **leave comments** on events, and view the total amount of donations that have been made to each event.

The target audience for PebbleWork is the general public, with a focus on volunteers who want to create a change in the world. The website will be accessible on desktop and mobile devices.

The website will include the following features:

* A user account system that allows users to create and manage their profiles, as well as sign up for and participate in events, donate to events, leave comments on events, and view the total amount of donations that have been made to each event.
* A search function that allows users to find events by location, date, category, and keyword.
* A calendar that displays upcoming events.
* A messaging system that allows users to communicate with each other about events.
* A rating and review system that allows users to rate and review events.
PebbleWork will be a valuable resource for people who want to make a difference in the world. It will connect volunteers with opportunities to serve their communities, and it will help to make a positive impact on the world.

### Authentication
The application uses JWT authentication for user authentication. JWT tokens are issued to users when they sign in or sign up. These tokens are then used to authenticate subsequent requests to the API.

### Authorization
The application uses role-based authorization to control access to different resources. There are two roles in the application: user and admin. Users with the admin role have access to all resources in the application, while users with the user role only have access to resources that are relevant to them.

### Testing
The application is tested using Jest and Enzyme. Unit tests are used to test the functionality of individual components and routes. Integration tests are used to test the functionality of the application as a whole.

### Deployment
The application is deployed to render. The production environment uses a **mongobd** database and a Redis cache.


## The list of the endpoints
* **/users**

This route allows users to get a list of all users, or create a new user.

* **/users/:id**

This route allows users to get a specific user by ID.

* **/users/profile**

This route allows users to get their own profile information.

* **/users/updateProfile**

This route allows users to update their own profile information.

* **/users/changePassword**

This route allows users to change their own password.

* **/users/forgotPassword**

This route allows users to request a password reset email.

* **/events**

This route allows users to get a list of all events, or filter events by location, date, and category.

* **/events/myEvents**

This route allows users to get a list of all events that they have created or are participating in.

* **/events/createNewEvent**

This route allows users to create a new event.

* **/events/:eventId**

This route allows users to get a specific event by ID.

* **/events/cancelEvent**

This route allows users to cancel an event that they have created.

* **/events/updateEvent**

This route allows users to update an event that they have created.

* **/events/join/:eventId**

This route allows users to join an event.

* **/events/leave/:eventId**

This route allows users to leave an event.

* **/events/addComment/:eventId**

This route allows users to add a comment to an event.

* **/events/deleteComment/:commentId**

This route allows users to delete a comment that they have made on an event.

* **/events/updateComment/:commentId**

This route allows users to update a comment that they have made on an event.

* **/events/likeEvent/:eventId**

This route allows users to like an event.

* **/events/removeLikeEvent/:eventId**

This route allows users to remove their like from an event.

* **/donations**

This route allows users to get a list of all donations, or get the total amount of donations for a specific event.

* **/donations/createDonation**

This route allows users to create a new donation.

* **/donations/:donationId**

This route allows users to get a specific donation by ID.

* **/donations/:donationId/status**

This route allows users to update the status of a donation.

* **/donations/:donationId/delete**

This route allows users to delete a donation.

* **/donations/:eventId/totalDonations**

This route allows users to get the total amount of donations for a specific event.

* **/donations/topDonors**

This route allows users to get a list of the top donors for a specific event.
```pash
'nvm use 14.17.0'
'npm install -g npm@8.5.1'
```
