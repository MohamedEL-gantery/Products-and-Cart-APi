const productRouter = require('./productRoute');
const cartRouter = require('./cartRoute');


const mountRoutes = (app) => {
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/carts', cartRouter);
};

module.exports = mountRoutes;