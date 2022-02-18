const nodemailer = require('nodemailer');
require('dotenv').config();

const { GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smpt.google.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tanulkako@gmail.com',
    pass: GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const mail = {
  to: 'tanulka@ex.ua',
  from: 'tanulkako@gmail.com',
  subject: 'Письмо с сайта',
  html: '<p>Письмо с сайта</p>',
};
transporter
  .sendMail(mail)
  .then(() => console.log('Email send success'))
  .catch((error) => console.log(error.message));

// const sendMail = async (data) => {
//   try {
//     const mail = { ...data, from: 'tanulkako@gmail.com' };
//     await transporter.sendMail(mail);
//     return true;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = sendMail;
