require('dotenv').config();

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

var Botkit = require('./node_modules/botkit/lib/Botkit');
var os = require('os');

var controller = Botkit.facebookbot({
    debug: true,
    log: true,
    access_token: process.env.page_token,
    verify_token: process.env.verify_token,
    app_secret: process.env.app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

var bot = controller.spawn({});

controller.setupWebserver(process.env.port || 3000, function (err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function () {
        console.log('ONLINE!');
    });
});

controller.api.nlp.enable();
controller.api.messenger_profile.greeting('Greetings message!');
controller.api.messenger_profile.menu([{
        "locale": "default",
        "call_to_actions": [{
                "title": "Main menu",
                "type": "postback",
                "payload": "main_menu"
            },
            {
                "title": "Goods catalog",
                "type": "postback",
                "payload": "shop"
            }
        ]
    }
]);

// returns the bot's messenger code image
controller.hears(['code'], 'message_received,facebook_postback', function (bot, message) {
    controller.api.messenger_profile.get_messenger_code(2000, function (err, url) {
        if (err) {
            // Error
        } else {
            var image = {
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": url
                    }
                }
            };
            bot.reply(message, image);
        }
    });
});

controller.hears(['quick'], 'message_received', function (bot, message) {

    bot.reply(message, {
        text: 'Menu',
        quick_replies: [{
                "content_type": "text",
                "title": "Yes",
                "payload": "yes",
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "no",
            }
        ]
    });

});

controller.on('facebook_postback', function (bot, message) {
    console.log(bot, message);
    bot.reply(message, {
        text: "Nice to see you in my shop!",
        quick_replies: [{
            "content_type": "text",
            "title": "My purchases",
            "payload": "my_purchases",
        },
        {
            "content_type": "text",
            "title": "Shop",
            "payload": "shop",
        },
        {
            "content_type": "text",
            "title": "Favorites",
            "payload": "favorites",
        },
        {
            "content_type": "text",
            "title": "Invite a friend",
            "payload": "invite_a_friend",
        }]
    });
});


controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function (bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function (err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function (err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name', 'who am i'], 'message_received', function (bot, message) {
    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function (err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function (response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [{
                                pattern: 'yes',
                                callback: function (response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function (response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function (response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {
                        'key': 'nickname'
                    }); // store the results in a field called nickname

                    convo.on('end', function (convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function (err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function (err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'], 'message_received',
    function (bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':|] I am a bot. I have been running for ' + uptime + ' on ' + hostname + '.');
    });

controller.on('message_received', function (bot, message) {
    bot.reply(message, 'Try: `what is my name` or `call me captain`');
    return false;
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}