/* eslint-disable no-shadow */
require('dotenv').config();

if (!process.env.FACEBOOK_PAGE_TOKEN) {
  console.log('Error: Specify page_token in environment');
  process.exit(1);
}

if (!process.env.FACEBOOK_VERIFY_TOKEN) {
  console.log('Error: Specify verify_token in environment');
  process.exit(1);
}

require('./app/routes/routes');
