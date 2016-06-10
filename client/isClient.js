// ERROR nie pokazuje listy zamówień dopóki się nie odświeży
// Osobne productlisty dla producenta i klienta
// Zrób scheme, żeby methods przyjmowały tylko odpowiednie typy danych
// Niech wyświetla się w liście produktów ilość zamówienia (być może zrobienie jednej bazy konieczne)
// Dostosuj szerokość input w liście produktów
// W trakcie dodawania zamówienia, niech zmniejsza się ilość produktu (error jest)
// Możliwość zaznaczenia przy rejestracji czy konto to kooperant czy producent
// Stwórz konto admina
// Admin zatwierdza użytkowników


if (Meteor .isClient) {
  Meteor.subscribe('Products');
  Meteor.subscribe('Orders');

  Template.body.events({
    "click .login"() {
      $('#modal1').openModal()
    },
    "click .logout"() {
      AccountsTemplates.logout();
    }
  });

  Template.atForm.events({
    "submit"() {
      $('#modal1').closeModal();
    }
  });

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
    // "change .orderProduct"(event) {
    //   console.log("blur");
    //   //Submit a product to Orders collection
    //   event.preventDefault();
    //   var quantity = event.target.value;
    //   var productName = this.productName;
    //   var producer = this.producer;
    //   var productsId = this._id;
    //   var unit = this.unit;
    //   var price = this.price;
    //   var summedPrice = price * quantity;
    //
    //   Meteor.call('insertOrder', productsId, productName, producer, quantity, unit,
    //    price, summedPrice);
    // },
    "change .orderProduct"(event) {
      //Submit a product to Orders collection
      console.log("change");
      event.preventDefault();
      var quantity = event.target.value;
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
        var quantity = event.target.quantity.value;

        Meteor.call('insertProduct', productName, producer, price, createdAt, owner, unit, quantity);

        //Clear textboxes in the form
        event.target.productName.value = "";
        event.target.producer.value = "";
        event.target.price.value = "";
        event.target.quantity.value = "";
    },
  });
}