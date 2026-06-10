const ratingsService = require('./ratings.service');

async function submitRating(req, res, next) {
  try {
    const data = await ratingsService.submitRating({ userId: req.user.id, ...req.body });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateRating(req, res, next) {
  try {
    const data = await ratingsService.updateRating({
      ratingId: req.params.id,
      userId: req.user.id,
      value: req.body.value,
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitRating, updateRating };
