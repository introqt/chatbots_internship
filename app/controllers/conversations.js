const { to } = require('await-to-js');
const bby = require('../../helpers/bestbuy_api');
const helper = require('../../helpers/templates');
const user = require('../models/user');
const favorites = require('../models/favorites');

module.exports = (controller) => {
  // returns the bot's messenger code image
  controller.hears(['code'], 'message_received', (bot, message) => {
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

  controller.hears('^back', 'facebook_postback', (bot, message) => {
    bot.reply(message, {
      text: 'Menu',
      quick_replies: helper.buildMenu(),
    });
  });

  controller.hears('My purchases', 'message_received', (bot, message) => {
    bot.reply(message, {
      text: 'There is a list of your purchases:',
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'back',
      }],
    });
  });

  controller.hears('Favorites', 'message_received', async (bot, message) => {
    let text = '';
    const chatId = message.user;

    const favoritesList = await to(favorites.findFavorites({ chatId }));
    if (favoritesList[0]) text = 'Your favorites list is empty!';
    console.log('Text', text);

    const skus = helper.makeMultipleSkuStringFromArray(favoritesList[1]);
    const products = await bby.getProductsBySkuList(skus);

    const attachment = {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: helper.createFavoritesGallery(products.products),
      },
    };

    bot.reply(message, {
      text,
      attachment,
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'back',
      }],
    });
  });

  controller.hears('shop', 'message_received', async (bot, message) => {
    const page = 1;
    await bby.getMovies(page)
      .then((data) => {
        bot.say({
          text: 'There is a list of available products:',
          channel: message.user,
        });
        const answer = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: helper.createProductsGallery(data.products),
            },
          },
          quick_replies: [
            {
              content_type: 'text',
              title: `Page ${page + 1}`,
              payload: `Page ${page + 1}`,
            },
          ],
        };
        bot.reply(message, answer);
      })
      .catch((err) => {
        bot.reply(message, err);
      });
  });

  controller.hears('Page (.*)', 'message_received', async (bot, message) => {
    const page = +message.quick_reply.payload.split(' ')[1];

    await bby.getMovies(page)
      .then((data) => {
        const answer = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: helper.createProductsGallery(data.products),
            },
          },
          quick_replies: [
            {
              content_type: 'text',
              title: `Page ${page + 1}`,
              payload: `Page ${page + 1}`,
            },
          ],
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
        const answer = {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [helper.showProductInfo(data.products[0])],
            },
          },
        };

        bot.reply(message, answer);
      })
      .catch((err) => {
        bot.reply(message, {
          text: `${err}`,
        });
      });
  });

  controller.hears('favorite-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    const chatId = message.user;
    let text = '';
    let err;
    let favorite;

    // eslint-disable-next-line prefer-const
    [err, favorite] = await to(favorites.findFavorites({ chatId, sku }));
    if (err) console.log('Error:', err);

    if (favorite[0]) {
      text = 'This product is already in your Favorites';
    } else {
      await to(favorites.saveFavorites({ chatId, sku }));
      // next error-handle?
      text = 'This product was added to your favorite list';
    }

    bot.reply(message, {
      text,
    });
  });

  controller.hears('buy-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    await bby.getMovieBySku(sku)
      .then((data) => {
        bot.reply(message, {
          text: `You are buying this product:\n${data.products[0].name}\nfor $${data.products[0].salePrice}.\nPlease, give us your phone number`,
          quick_replies: [
            {
              content_type: 'user_phone_number',
              title: 'Provide phone number',
            },
          ],
        });
      })
      .catch((err) => {
        bot.reply(message, {
          text: `${err}`,
        });
      });
  });

  // eslint-disable-next-line no-useless-escape
  controller.hears('(^\\+380\\d{9}$)', 'message_received', async (bot, message) => {
    const chatId = message.user;
    const client = await user.findOrCreateUser({ chatId });

    [client.phone] = [message.match.input];
    client.save();

    bot.reply(message, {
      text: 'You entered your mobile phone. Provide your location now.',
      quick_replies: [
        {
          content_type: 'location',
          title: 'Provide your location',
          payload: 'location',
        },
      ],
    });

    console.log(message);
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

  controller.on('facebook_postback,message_received', async (bot, message) => {
    const chatId = message.user;
    let err;
    let client;

    // eslint-disable-next-line prefer-const
    [err, client] = await to(user.findOrCreateUser({ chatId }));
    if (err) {
      console.log(err);
    }

    if (message.attachments && message.attachments[0].type === 'location') {
      console.log(message.attachments[0].payload);
      client.location = message.attachments[0].payload.coordinates;
      client.save();

      console.log(user);

      bot.reply(message, {
        text: 'Thank you! Our courier will contact you within 2 hours.',
      });
    }

    if (client) {
      bot.reply(message, {
        text: 'Nice to see you here! Choose something below',
        quick_replies: helper.buildMenu(),
      });
    }
  });
};
