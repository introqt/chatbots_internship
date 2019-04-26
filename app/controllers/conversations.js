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
      quick_replies: helper.buildMenu(),
    });
  });

  controller.hears('^back', 'facebook_postback', (bot, message) => {
    bot.reply(message, {
      text: 'Menu',
      quick_replies: helper.buildMenu(),
    });
  });

  controller.hears(['My purchases', '^purchases'], 'facebook_postback, message_received', (bot, message) => {
    bot.reply(message, {
      text: 'There is a list of your purchases:',
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'back',
      }],
    });
  });

  controller.hears(['^shop'], 'facebook_postback, message_received', async (bot, message) => {
    await bby.getMovies()
      .then((data) => {
        const answer = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: helper.createProductsGallery(data.products),
            },
          },
        };
        bot.reply(message, answer);
      })
      .catch((err) => {
        bot.reply(message, err);
      });
  });

  controller.hears('info-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    await bby.getMovieBySku(sku)
      .then((data) => {
        bot.reply(message, {
          text: `${data.products[0].name} for $${data.products[0].salePrice}`,
        });
      })
      .catch((err) => {
        bot.reply(message, {
          text: `${err}`,
        });
      });
  });

  controller.hears('favorite-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    await bby.getMovieBySku(sku)
      .then((data) => {
        bot.reply(message, {
          text: `${data.products[0].name} was added to your favorite list`,
        });
      })
      .catch((err) => {
        bot.reply(message, {
          text: `${err}`,
        });
      });
  });

  controller.hears('buy-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    await bby.getMovieBySku(sku)
      .then((data) => {
        bot.reply(message, {
          text: `You are buying this product:\n${data.products[0].name}\nfor $${data.products[0].salePrice}`,
        });
      })
      .catch((err) => {
        bot.reply(message, {
          text: `${err}`,
        });
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
