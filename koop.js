// Zrób scheme, żeby methods przyjmowały tylko odpowiednie typy danych
// Stwórz typy użytkowników i do walidacje po typach http://guide.meteor.com/accounts.html#roles-and-permissions
//routing https://kadira.io/academy/meteor-routing-guide/content/implementing-auth-logic-and-permissions
//blahbalbh
Products = new Mongo.Collection("products");
Orders = new Mongo.Collection("orders");

if (Meteor .isClient) {
  Meteor.subscribe('Products');
  Meteor.subscribe('Orders');

  Template.productsList.helpers({
    //List the products from the Products collection
    showProducts() {
      var sortAttr = Session.get('sortAttr');
      var sortOrder = Session.get('sortOrder') || 1;
      return Products.find({}, { sort: {[sortAttr]: sortOrder} });
    },

    //TABLE SORTING
    nameTriangle() {
      if (Session.get('sortAttr') === 'productName') return true;
    },
    producerTriangle() {
      if (Session.get('sortAttr') === 'producer') return true;
    },
    priceTriangle() {
      if (Session.get('sortAttr') === 'price') return true;
    },
    sortOrder(){
      if (Session.get('sortOrder') === 1) {
        return '&blacktriangle;';
      }
      else if (Session.get('sortOrder') === -1) {
        return '&blacktriangledown;';
      }
    }
  });

  Template.productsList.events({
    "submit .orderProduct"(event) {
      //Submit a product to Orders collection
      event.preventDefault();
      var quantity = event.target.quantity.value;
      var productName = this.productName;
      var producer = this.producer;
      var productsId = this._id;
      var unit = this.unit;
      var price = this.price;
      var summedPrice = price * quantity;

      Meteor.call('insertOrder', productsId, productName, producer, quantity, unit,
       price, summedPrice);
    },
    "click .delete"() {
      if (confirm("Usunąć produkt?")){
        var productsId = this._id;
        Meteor.call('deleteProduct', productsId);
      }
    },

    //TABLE SORTING
    "click .name" () {
      Session.set('sortNameOrder', Session.get('sortOrder') * -1 || -1);
      Session.set('sortAttr', 'productName');
      Session.set('sortOrder', Session.get('sortNameOrder'));
    },
    "click .producer"() {
      Session.set('sortProducerOrder', Session.get('sortOrder') * -1 || -1);
      Session.set('sortAttr', 'producer');
      Session.set('sortOrder', Session.get('sortProducerOrder'));
    },
    "click .price"() {
      Session.set('sortPriceOrder', Session.get('sortOrder') * -1 || -1);
      Session.set('sortAttr', 'price');
      Session.set('sortOrder', Session.get('sortPriceOrder'));
    }
  });

  Template.ordersList.helpers({
    showOrders() {
      return Orders.find({}, {sort: {createdAt: -1}});
    },
    orderSum() {
      console.log(Orders.find().summedPrice);
    }
  });

  Template.ordersList.events({
    "click .delete"() {
      Meteor.call('deleteOrder', this._id);
    }
  });

  Template.insertProduct.events({
    "submit .insertProduct"(event) {
        event.preventDefault();
        var productName = event.target.productName.value;
        var producer = event.target.producer.value;
        var price = Number(event.target.price.value);
        var createdAt = new Date();
        var owner = Meteor.userId();
        var unit = event.target.unit.value;

        Meteor.call('insertProduct', productName, producer, price, createdAt, owner, unit);

        //Clear textboxes in the form
        event.target.productName.value = "";
        event.target.producer.value = "";
        event.target.price.value = "";
    },
  });
}

if (Meteor.isServer) {
  Meteor.publish('Products', function(){
    return Products.find();
  });
  Meteor.publish('Orders', function(){
    return Orders.find({ purchaser: this.userId });
  });
}

Meteor.methods({
  insertProduct(productName, producer, price, createdAt, owner, unit) {
    //If user is logged
    if(Meteor.userId()) {
      Products.insert({
      productName: productName,
      producer: producer,
      price: price,
      createdAt: createdAt,
      owner: owner,
      unit: unit
    });
    }
  },
  insertOrder(productsId, productName, producer, quantity, unit, price, summedPrice){
    Orders.upsert({
        _id: productsId
      }, 
        {$setOnInsert: {
          _id: productsId,
          productName: productName,
          producer: producer,
          unit: unit,
          price: price,
          purchaser: Meteor.userId(),
        },
         $set: {
            quantity: quantity,
            createdAt: new Date(),
            summedPrice: summedPrice}}
    );

  },
  deleteOrder(orderId){
     Orders.remove(orderId);
  },
  deleteProduct(productsId){
    Products.remove(productsId);
  },
});