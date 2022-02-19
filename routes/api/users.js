const express = require('express');
const authenticate = require('../../midlewares/authenticate');
const upload = require('../../midlewares/validation/upload');
const createError = require('http-errors');
const { User } = require('../../models/user');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const avatarsDir = path.join(__dirname, '../../', 'public', 'avatars');
const verifyEmailSchema = require('../../midlewares/validation/verifyEmail');
const sendMail = require('../../helpers/sendMail');

router
  .get('/verify/:verificationToken', async (req, res, next) => {
    try {
      const { verificationToken } = req.params;
      const user = await User.findOne({ verificationToken });
      if (!user) {
        throw createError(404);
      }
      await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });
      res.json({
        message: 'Verification successful',
      });
    } catch (error) {
      next(error);
    }
  })
  .post('/verify', verifyEmailSchema, async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user.verify) {
        throw createError(400, 'Verification has already been passed');
      }
      const mail = {
        to: email,
        subject: 'Подтверждение email',
        html: `<a target="_blank" href='http://localhost:3000/api/users/${user.verificationToken}'>Нажмите чтобы подтвердить свой email</a>`,
      };
      await sendMail(mail);
      res.json({
        message: 'Verification email send',
      });
    } catch (error) {
      next(error);
    }
  })

  .get('/current', authenticate, async (req, res, next) => {
    res.json({
      email: req.user.email,
    });
  })
  .get('/logout', authenticate, async (req, res, next) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204).send();
  })
  .patch('/avatars', authenticate, upload.single('avatar'), async (req, res, next) => {
    const { id } = req.user;
    const { path: tempUpload, filename } = req.file;
    try {
      const [extention] = filename.split('.').reverse();
      const newFileName = `${id}.${extention}`;
      const resultUpload = path.join(avatarsDir, newFileName);
      await fs.rename(tempUpload, resultUpload);
      const avatarURL = path.join('avatars', newFileName);
      await User.findByIdAndUpdate(id, { avatarURL });
      res.json({
        avatarURL,
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
