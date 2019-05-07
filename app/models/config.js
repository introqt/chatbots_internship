const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 10,
  sort: { date: -1 },
};
