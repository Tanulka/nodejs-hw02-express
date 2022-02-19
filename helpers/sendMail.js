const nodemailer = require('nodemailer');
require('dotenv').config();

const { GMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tanulkako@gmail.com',
    pass: GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendMail = async (data) => {
  const mail = { ...data, from: 'tanulkako@gmail.com' };
  await transporter.sendMail(mail);
  return true;
};

module.exports = sendMail;
