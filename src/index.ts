import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";

interface Settings {
  defaultFrom: string;
  defaultReplyTo: string;
}

interface SendOptions {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  from?: string;
  [key: string]: unknown;
}

interface ProviderOptions {
  region: string;
}

export = {
  provider: "strapi4-provider-email-aws-ses-sdk",
  name: "strapi4-provider-email-aws-ses-sdk",

  init(providerOptions: ProviderOptions, settings: Settings) {
    const ses = new aws.SES({
      apiVersion: "2010-12-01",
      region: providerOptions.region,
    });

    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    return {
      send: async (options: SendOptions) => {
        const { from, to, cc, bcc, replyTo, subject, text, html, attachments, ...rest } = options;

        const msg = {
          from: from || settings.defaultFrom,
          to,
          cc,
          bcc,
          replyTo: replyTo || settings.defaultReplyTo,
          subject,
          text,
          html,
          ...rest,
        };

        await transporter.sendMail(msg);
      },
    };
  },
};
