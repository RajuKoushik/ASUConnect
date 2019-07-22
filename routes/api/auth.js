const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');

const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   GET api/auth
// @desc    test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authentication
// @access   Public
router.get('/login/', (req, res) => res.send('User route'));
router.post('/login/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  console.log(req.body);
  console.log(email);
  console.log(password);

  try {
    let user = await User.findOne({ email });

    console.log(user);

    const salt = await bcrypt.genSalt(10);

    let password_hash = await bcrypt.hash(password, salt);

    console.log(password_hash + '');

    if (user.password.localeCompare(password_hash)) {
      console.log('Credinatials are right');
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Wrong authentication error' }] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
