const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    test route
// @access  Public
router.post(
  '/',
  [
    // username must be an email
    check('email').isEmail(),
    check('name')
      .not()
      .isEmpty(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 6 })
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(req.body);

    res.send(req.body);
  }
);

module.exports = router;
