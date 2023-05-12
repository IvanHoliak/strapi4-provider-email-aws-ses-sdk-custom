async function nodemailerModule() {
  return (await import("nodemailer")).default;
}

async function awsModule() {
  return (await import("@aws-sdk/client-ses")).default;
}

module.exports = {
  provider: "strapi4-provider-email-aws-ses-sdk-custom",
  name: "strapi4-provider-email-aws-ses-sdk-custom",

  init: async(providerOptions, settings) => {
    const aws = await awsModule();
    const nodemailer = await nodemailerModule();

    const ses = new aws.SES({
      apiVersion: "2010-12-01",
      region: providerOptions.region,
    });

    const transporter = nodemailer.createTransport({
      SES: { ses, aws },
    });

    return {
      send: async (options) => {
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
