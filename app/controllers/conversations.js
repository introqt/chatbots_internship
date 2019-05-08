/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
const { to } = require('await-to-js');
const bby = require('../../helpers/bestbuy_api');
const helper = require('../../helpers/templates');
const user = require('../models/user');
const favorites = require('../models/favorites');
const history = require('../models/history');

module.exports = (controller) => {
  // returns the bot's messenger code image
  controller.hears(['code'], 'message_received', (bot, message) => {
    controller.api.messenger_profile.get_messenger_code(2000, (err, url) => {
      if (err) {
        console.log(err);
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

  controller.hears('My purchases', 'message_received', async (bot, message) => {
    const chatId = message.user;
    let answer;
    let nextPageButton;
    let page;

    const [error, historyPaginated] = await to(history.paginate({ chatId }));
    if (error) console.log(error);

    if (historyPaginated.pages > 1) {
      page = 1;
      nextPageButton = {
        content_type: 'text',
        title: `Purchases page ${page + 1}`,
        payload: `Purchases page ${page + 1}`,
      };
    }

    if (historyPaginated.docs.length === 0) {
      answer = {
        text: 'Your purchases will be listed here. Use shop button to buy something.',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Shop',
            payload: 'shop',
          },
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else if (nextPageButton) {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createHistoryGallery(historyPaginated.docs),
          },
        },
        quick_replies: [
          nextPageButton,
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createHistoryGallery(historyPaginated.docs),
          },
        },
        quick_replies: [
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    }

    bot.reply(message, answer);
  });

  controller.hears('Purchases page (.*)', 'message_received', async (bot, message) => {
    const chatId = message.user;
    let page = +message.quick_reply.payload.split(' ')[2];
    let nextPageButton;
    let answer;

    const [error, historyPaginated] = await to(history.paginate({ chatId }, { page }));
    if (error) console.log(error);

    // do we need button for next pages?
    if (historyPaginated.pages > page) {
      page += 1;
      nextPageButton = {
        content_type: 'text',
        title: `Purchases page ${page + 1}`,
        payload: `Purchases page ${page + 1}`,
      };
    }

    if (nextPageButton) {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createHistoryGallery(historyPaginated.docs),
          },
        },
        quick_replies: [
          nextPageButton,
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createHistoryGallery(historyPaginated.docs),
          },
        },
        quick_replies: [
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    }

    bot.reply(message, answer);
  });

  controller.hears('My favorites', 'message_received', async (bot, message) => {
    const chatId = message.user;
    let answer;
    let nextPageButton;
    let page;

    const [error, favoritesPaginated] = await to(favorites.paginate({
      chatId,
    }));
    if (error) console.log(error);

    if (favoritesPaginated.pages > 1) {
      page = 1;
      nextPageButton = {
        content_type: 'text',
        title: `Favorites page ${page + 1}`,
        payload: `Favorites page ${page + 1}`,
      };
    }

    if (favoritesPaginated.docs.length === 0) {
      answer = {
        text: 'Your favorites will be listed here. Use shop button to add something to this list.',
        quick_replies: [
          {
            content_type: 'text',
            title: 'Shop',
            payload: 'shop',
          },
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else if (nextPageButton) {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createFavoritesGallery(favoritesPaginated.docs),
          },
        },
        quick_replies: [
          nextPageButton,
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createFavoritesGallery(favoritesPaginated.docs),
          },
        },
        quick_replies: [
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    }

    bot.reply(message, answer);
  });

  controller.hears('Favorites page (.*)', 'message_received', async (bot, message) => {
    const chatId = message.user;
    let page = +message.quick_reply.payload.split(' ')[2];
    let nextPageButton;
    let answer;

    const [error, favoritesPaginated] = await to(favorites.paginate({ chatId }, { page }));
    if (error) console.log(error);

    // do we need button for next pages?
    if (favoritesPaginated.pages > page) {
      page += 1;
      nextPageButton = {
        content_type: 'text',
        title: `Favorites page ${page + 1}`,
        payload: `Favorites page ${page + 1}`,
      };
    }

    if (nextPageButton) {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createFavoritesGallery(favoritesPaginated.docs),
          },
        },
        quick_replies: [
          nextPageButton,
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    } else {
      answer = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: helper.createFavoritesGallery(favoritesPaginated.docs),
          },
        },
        quick_replies: [
          {
            content_type: 'text',
            title: 'Back',
            payload: 'back',
          },
        ],
      };
    }

    bot.reply(message, answer);
  });

  controller.hears('favorite-(.*)', 'facebook_postback', async (bot, message) => {
    const chatId = message.user;
    const sku = message.payload.split('-')[1];
    let text = '';

    const [err, favorite] = await to(favorites.findFavorites({ chatId, sku }));
    if (err) console.log('Error:', err);

    if (favorite[0]) {
      text = 'This product is already in your Favorites';
    } else {
      const [err, product] = await to(bby.getProductBySku(sku));
      if (err) console.log(err);

      if (product.products) {
        const { name, image, salePrice } = product.products[0];

        const [err, favorite] = await to(favorites.saveFavorites({
          chatId, sku, name, image, salePrice,
        }));
        if (err) console.log(err);

        if (favorite) text = 'This product was successfully added to your favorites!';
      } else {
        text = 'Oops! Something went wrong!';
      }
    }

    bot.reply(message, {
      text,
      quick_replies: [
        {
          content_type: 'text',
          payload: 'back',
          title: 'Back',
        },
      ],
    });
  });

  controller.hears('^shop', 'facebook_postback,message_received', async (bot, message) => {
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

    await bby.getProductBySku(sku)
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

  controller.hears('buy-(.*)', 'facebook_postback', async (bot, message) => {
    const sku = message.payload.split('-')[1];
    const chatId = message.user;

    bot.startConversation(message, (err, convo) => {
      if (!err) {
        convo.say('Nice choice! I need some information about you though.');
        convo.ask({
          text: 'What is your phone number?',
          quick_replies: [{
            content_type: 'user_phone_number',
            payload: 'phone_nubmer',
          }],
        }, async (response) => {
          const [error, client] = await to(user.findOrCreateUser({ chatId }));
          if (error) {
            console.log(error);
          }
          client.phone = response.message.quick_reply.payload;
          client.save();

          convo.say('Thank you! I also need your location to deliver your order.');
          convo.ask({
            text: 'Please, share your location with a button below',
            quick_replies: [{
              content_type: 'location',
              payload: 'location',
              title: 'location',
            }],
          }, async (response) => {
            // saving delivery location
            const location = response.message.attachments[0].payload.coordinates;

            // getting product info
            const productInfo = await to(bby.getProductBySku(sku));
            if (productInfo[0]) console.log(productInfo[0]);

            const { name, salePrice, image } = productInfo[1].products[0];
            // saving new purchase to the history
            await to(history.createHistory({
              chatId, sku, name, image, salePrice, location,
            }));
            convo.next();
          });
          convo.next();
        });

        convo.on('end', () => {
          if (convo.status === 'completed') {
            bot.reply(message, {
              text: 'Thank you for your order! Our courier will contact you within 2 hours!',
              quick_replies: [{
                content_type: 'text',
                title: 'Main menu',
                payload: 'back',
              }],
            });
          } else {
            // this happens if the conversation ended prematurely for some reason
            bot.reply(message, 'OK, nevermind!');
          }
        });
      }
    });
  });

  controller.hears(['invite', 'friend', 'Invite a friend'], 'facebook_postback, message_received', (bot, message) => {
    const chatId = message.user;
    const link = encodeURI(`https://m.me/${process.env.FACEBOOK_PAGE_ID}?ref=${chatId}`);

    bot.reply(message, {
      text: `Your link for friends: ${link}.\nSend it to 3 friends to get a gift.`,
      quick_replies: [{
        content_type: 'text',
        title: 'Back',
        payload: 'facebook_postback',
      }],
    });
  });

  controller.on('facebook_postback,message_received', async (bot, message) => {
    // referral check
    if (message.postback && message.postback.referral) {
      const refUser = message.postback.referral.ref;
      const newUser = { chatId: message.user };

      // search for a user that created ref link
      const [err, client] = await to(user.findUser({ chatId: refUser }));
      if (err) console.log(err);

      // no duplicates in referrals array
      let duplicates = false;
      client.referrals.forEach((referral) => {
        // eslint-disable-next-line eqeqeq
        if (referral.chatId == newUser.chatId) {
          console.log('Referral is already in db!');
          duplicates = true;
          return false;
        }
        return true;
      });

      // if no duplicates - push a new ref to user
      if (duplicates === false) {
        client.referrals.push(newUser);
        client.save();
        let text = 'Your link has been activated!';

        // count if a user has 3 active referalls
        if (client.referrals.length % 3 === 0) {
          // giving a gift to a user-referrer
          client.gifts += 1;
          client.save();
          text = 'Gratz! 3 friends of yours have been activated your link!\nYou have a free purchase now!';
        }

        bot.say({ channel: refUser, text });
      }
    }

    // getting new user info
    const [err, newUser] = await to(bot.getMessageUser(message));
    if (err) console.log(err);

    if (newUser) {
      const chatId = newUser.id;
      const fullName = newUser.full_name;

      const [err, client] = await to(user.findOrCreateUser({ chatId, fullName }));
      if (err) console.log(err);

      if (client) {
        bot.reply(message, {
          text: `Nice to see you here, ${client.fullName}!\nChoose something below`,
          quick_replies: helper.buildMenu(),
        });
      }
    }
  });
};
