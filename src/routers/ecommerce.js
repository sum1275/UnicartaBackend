module.exports = (app) => {
  const ecommerce=require('../controllers/ecommerce')
  app.get('/allproduct',ecommerce.fetchData)
  app.post('/checkout',ecommerce.checkOut);
  app.post('/validateCoupon',ecommerce.validateCoupon)
  app.post('/userDetails',ecommerce.checkoutDetails)
}
