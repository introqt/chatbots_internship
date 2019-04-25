const bby = require('../../helpers/bestbuy_api');
const helper = require('../../helpers/templates');

module.exports = (controller) => {
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

  controller.on('facebook_postback,message_received', (bot, message) => {
    // console.log(bot, message);
    bot.reply(message, {
      text: 'Nice to see you here! Choose something below',
      quick_replies: [{
        content_type: 'text',
        title: 'My purchases',
        payload: 'My purchases',
      },
      {
        content_type: 'text',
        title: 'Shop',
        payload: 'Shop',
      },
      {
        content_type: 'text',
        title: 'Favorites',
        payload: 'Favorites',
      },
      {
        content_type: 'text',
        title: 'Invite a friend',
        payload: 'Invite a friend',
      },
      ],
    });
  });

  controller.hears(['My purchases', 'purchases'], 'facebook_postback, message_received', (bot, message) => {
    bot.reply(message, {
      text: 'There is a list of your purchases:',
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'back',
      }],
    });
  });

  controller.hears(['Shop', 'shop'], 'facebook_postback, message_received', async (bot, message) => {
    const movies = await bby.getMovies();

    bot.startConversation(message, (err, convo) => {
      if (!err) {
        convo.say('There is a list of products you can buy:');
        convo.ask({
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: helper.createProductsGallery(movies.products),
            },
          },
        }, () => {
          convo.next();
        });
      }
    });
  });

  controller.hears('info', 'facebook_postback', (bot, message) => {
    bot.reply(message, {
      text: 'Info about this movie',
    });
  });

  controller.hears(['invite', 'friend', 'Invite a friend'], 'facebook_postback, message_received', (bot, message) => {
    bot.reply(message, {
      text: 'Referral program',
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'facebook_postback',
      }],
    });
  });
};
