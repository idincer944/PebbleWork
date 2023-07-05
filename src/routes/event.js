const express = require('express');
const authenticate = require('../middleware/authenticate');
// const Event = require('');
// const event =require('');
const router = express.Router();

// Renders a template for creating a new event.
router.get('/new', authenticate, (req, res) => {
  res.render('event/new', { event: new Event() });
});

// Retrieves the event from the database based on the provided ID and renders a template for editing the event.
router.get('/edit/:id', authenticate, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render('event/edit', { event });
});

// Render the requested event
router.get('/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (event == null) res.redirect('/');
  res.render('event/show', { event });
});

function saveEventAndRedirect(path) {
  return async (req, res) => {
    let { event } = req;
    // we should write those with created model.
    event.name = req.body.name;
    event.description = req.body.description;
    event.picture = req.body.picture;
    // event.users = req.body.users;
    event.time = req.body.time;
    try {
      event.location = req.session?.user?._id ?? null;
      event = await event.save();
      res.redirect(`/event/${event.slug}`);
    } catch (e) {
      console.log(e);
      res.render(`event/${path}`, { event });
    }
  };
}

// Create a new event
router.post(
  '/',
  async (req, res, next) => {
    req.event = new Event();
    next();
  },
  saveEventAndRedirect('new')
);

// Update event by id
router.put(
  '/:id',
  authenticate,
  async (req, res, next) => {
    req.event = await Event.findById(req.params.id);
    next();
  },
  saveEventAndRedirect('edit')
);

// Delete event by id
router.delete('/:id', authenticate, async (req, res) => {
  const event = await Event.findOne({
    _id: req.params.id,
  });
  if (!event) {
    return res.status(404).send();
  }
  if (event.author !== req.user._id) {
    res.status(403).send();
  }
  await Event.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

module.exports = router;
