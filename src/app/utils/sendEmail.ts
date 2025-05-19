import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: 'krreza200@gmail.com',
      pass: 'ovlz mxtb smij ukug',
    },
  });

  await transporter.sendMail({
    from: 'krreza200@gmail.com',
    to,
    subject: 'Reset your password in ten minutes',
    text: 'Reset your password in 10 minutes', // plain‑text body
    html, // HTML body
  });
};
