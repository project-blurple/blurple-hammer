import { createFileTransports, globalFormat } from "./logger";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "../config";
import { createLogger } from "winston";
import { inspect } from "util";
import nodemailer from "nodemailer";

const defaults: SMTPTransport.Options = {
  ...config.smtpSettings && {
    from: `"${config.smtpSettings.displayName}" <${config.smtpSettings.emailAddress}>`,
    ...config.smtpSettings.replyToEmailAddress && { replyTo: config.smtpSettings.replyToEmailAddress },
  },
};

const transporter = (async () => {
  if (config.smtpSettings) {
    return nodemailer.createTransport({
      host: config.smtpSettings.host,
      port: config.smtpSettings.port,
      secure: config.smtpSettings.secure,
      auth: {
        user: config.smtpSettings.username,
        pass: config.smtpSettings.password,
      },
    }, defaults);
  }

  // create test account to preview emails in development
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  }, defaults);
})();

export const mailLogger = createLogger({ format: globalFormat, transports: createFileTransports("mail", ["debug", "error"]) });
void transporter.then(tp => {
  tp.on("error", err => void mailLogger.error(`Mail transporter errored: ${inspect(err)}`));
  tp.on("idle", () => void mailLogger.debug("Mail transporter is idle"));
  tp.on("token", token => void mailLogger.debug(`Mail transporter got new token: ${inspect(token)}`));
});

export async function sendMail(to: [name: string, email: string], subject: string, text: string): Promise<boolean> {
  const { sendMail: send } = await transporter;
  return new Promise(resolve => {
    send({
      to: `"${to[0]}" <${to[1]}>`,
      subject,
      text,
    }, (err, info) => {
      if (err) {
        mailLogger.warn(`Sending mail to ${to[1]} failed: ${inspect(err)}`);
        return resolve(false);
      }

      const preview = nodemailer.getTestMessageUrl(info);
      mailLogger.debug(`Sent mail to ${to[1]} (${preview ? `preview: ${preview}` : "config"}): ${inspect(info)}`);
      return resolve(true);
    });
  });
}
