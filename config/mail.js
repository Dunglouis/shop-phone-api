module.exports = {
  mailHost: process.env.MAIL_HOST || "smtp.gmail.com",
  mailPort: process.env.MAIL_PORT || 465,
  mailSecure: process.env.MAIL_SECURE || true,
  mailUser: process.env.MAIL_USER || "khoaimonatk1@gmail.com",
  mailPass: process.env.MAIL_PASS || "abnq hika duaa ehic",
  mailFrom: process.env.MAIL_FROM || "Admin ShopPhone <khoaimonatk1@gmail.com>",
  mailTemplate: `${__dirname}/../src/emails/templates`,
};
