/* eslint-disable no-shadow */
require('dotenv').config();

const os = require('os');

function formatUptime(time) {
  let unit = 'second';
  let uptime;

  if (time > 60) {
    uptime /= 60;
    unit = 'minute';
  }

  if (uptime > 60) {
    uptime /= 60;
    unit = 'hour';
  }

  if (uptime !== 1) {
    unit += 's';
  }

  uptime = `${uptime} ${unit}`;
  return uptime;
}

if (!process.env.page_token) {
  console.log('Error: Specify page_token in environment');
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify verify_token in environment');
  process.exit(1);
}

if (!process.env.app_secret) {
  console.log('Error: Specify app_secret in environment');
  process.exit(1);
}

const Botkit = require('./node_modules/botkit/lib/Botkit');

const controller = Botkit.facebookbot({
  debug: true,
  log: true,
  access_token: process.env.page_token,
  verify_token: process.env.verify_token,
  app_secret: process.env.app_secret,
  validate_requests: true,
});

const bot = controller.spawn({});

controller.setupWebserver(process.env.port || 3000, (err, webserver) => {
  controller.createWebhookEndpoints(webserver, bot, () => {
    console.log('ONLINE!');
  });
});

controller.api.nlp.enable();
controller.api.messenger_profile.greeting('Greetings message!');
controller.api.messenger_profile.menu([{
  locale: 'default',
  call_to_actions: [{
    title: 'Main menu',
    type: 'postback',
    payload: 'main_menu',
  },
  {
    title: 'Goods catalog',
    type: 'postback',
    payload: 'shop',
  }],
}]);

// returns the bot's messenger code image
controller.hears(['code'], 'message_received,facebook_postback', (bot, message) => {
  controller.api.messenger_profile.get_messenger_code(2000, (err, url) => {
    if (err) {
      // Error
    } else {
      const image = {
        attachment: {
          type: 'image',
          payload: {
            url,
          },
        },
      };
      bot.reply(message, image);
    }
  });
});

controller.hears(['quick'], 'message_received', (bot, message) => {
  bot.reply(message, {
    text: 'Menu',
    quick_replies: [{
      content_type: 'text',
      title: 'Yes',
      payload: 'yes',
    },
    {
      content_type: 'text',
      title: 'No',
      payload: 'no',
    },
    ],
  });
});

controller.on('facebook_postback', (bot, message) => {
  // console.log(bot, message);
  bot.reply(message, {
    text: 'Nice to see you here! Choose something below',
    quick_replies: [{
      content_type: 'text',
      title: 'My purchases',
      payload: 'my_purchases',
    },
    {
      content_type: 'text',
      title: 'Shop',
      payload: 'shop',
    },
    {
      content_type: 'text',
      title: 'Favorites',
      payload: 'favorites',
    },
    {
      content_type: 'text',
      title: 'Invite a friend',
      payload: 'invite_a_friend',
    },
    ],
  });
});

controller.hears(['My purchases', 'my_purchases'], 'facebook_postback, message_received', (bot, message) => {
  bot.reply(message, {
    text: 'There is a list of your purchases:',
    quick_replies: [{
      content_type: 'text',
      title: 'Back',
      payload: 'back',
    }],
  });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received',
  (bot, message) => {
    const hostname = os.hostname();
    const uptime = formatUptime(process.uptime());

    bot.reply(message,
      `:|] I am a bot. I have been running for ${uptime} on ${hostname}.`);
  });

controller.on('message_received', (bot, message) => {
  bot.reply(message, 'Try: `code` or `uptime`');
  return false;
});
