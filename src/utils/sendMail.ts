/* Change email template and send email to user when register to activate email or change password */

import nodemailer from 'nodemailer';
import * as handlerbars from 'handlebars';

export default async function sendMail(
  to: string,
  name: string,
  image: string,
  url: string,
  subject: string,
  template: string,
) {
  const {
    MAILING_EMAIL,
    MAILING_PASSWORD,
  } = process.env;
  const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
      user : MAILING_EMAIL,
      pass : MAILING_PASSWORD
    }
  });


  /* --- HTML replacement --- */
  const data = handlerbars.compile(template);
  const replacement = {
    name: name,
    email_link: url,
    image: image
  };
  const html = data(replacement);


  /* --- verify connection config | the log is show in terminal */
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      else {
        console.log("Server is listening");
        resolve(success);
      }
    });
  });


  /* --- send email by my template to activate or reset --- */
  const option = {
    from: MAILING_EMAIL,
    to,
    subject,
    html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(option, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      else {
        console.log(info);
        resolve(info);
      }
    });
  });
}