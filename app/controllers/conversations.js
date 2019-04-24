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

  // return quick replies
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
};
