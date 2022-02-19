const { User } = require('../../models/user');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const sendMail = require('../../helpers/sendMail');
const { v4 } = require('uuid');

async function addUser(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(createError(409, 'Email in use'));
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email);
  try {
    const verificationToken = v4();
    await User.create({ email, avatarURL, password: hashPassword, verificationToken });
    // await sendMail(email);
    const mail = {
      to: email,
      subject: 'Подтверждение email',
      html: `<a target="_blank" href='http://localhost:3000/api/users/${verificationToken}'>Нажмите чтобы подтвердить свой email</a>`,
    };
    await sendMail(mail);
    res.status(201).json({
      user: {
        email,
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = addUser;
