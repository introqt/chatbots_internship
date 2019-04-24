module.exports = (controller) => {
  controller.api.nlp.enable();
  controller.api.messenger_profile.greeting('Greetings message!');
  controller.api.messenger_profile.get_started('facebook_postback');
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
};
