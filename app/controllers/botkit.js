const Botkit = require('../../node_modules/botkit/lib/Botkit');

const controller = Botkit.facebookbot({
  debug: true,
  log: true,
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
});

const bot = controller.spawn({});

controller.setupWebserver(process.env.PORT || 5000, (err, webserver) => {
  controller.createWebhookEndpoints(webserver, bot, () => {
    console.log('ONLINE!');
  });
});

// SETUP
require('./facebook_setup')(controller);

// Conversation logic
require('./conversations')(controller);
