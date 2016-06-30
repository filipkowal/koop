/**
 * Created by filip on 2016-06-17.
 */
if (Meteor .isClient) {

    //SUBSCRIBE TO PRODUCTS WHEN PRODUCTLIST TEMPLATE IS CREATED
    Template.productsList.onCreated(function () {
        this.autorun(() => {
            this.subscribe('Products');
        });
    });
    
    Template.productsList.onRendered(function() {
        var template = this;

        template.subscribe('Products', function () {
            Tracker.afterFlush(function() {
                template.$('select').material_select();
            });
        });
    });

    Template.productsList.helpers({
        //List the products from the Products collection
        showProducts() {
            var sortAttr = Session.get('sortAttr');
            var sortOrder = Session.get('sortOrder') || 1;
            return Products.find({}, {sort: {[sortAttr]: sortOrder}});
        },
        quantityLeft() {
            return this.productQuantity - this.orderedQuantity;
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
        "change .orderProduct"(event) {
            //Submit a product to Orders collection
            var orderQuantity = Number(event.target.value);
            if (orderQuantity==="") {
                orderQuantity = 0;
            }
            console.log('orderQuantity: ', orderQuantity);
            var productQuantity = this.productQuantity;
            var productName = this.productName;
            var producer = this.producer;
            var productId = this._id;
            var unit = this.unit;
            var price = Number(this.price);
            var summedPrice = price * orderQuantity;
            var orderedQuantity = this.orderedQuantity + orderQuantity;

            Meteor.call('insertOrder', productId, productName, producer, orderQuantity, unit,
                price, summedPrice, productQuantity, orderedQuantity);
            Meteor.call('setOrderedQuantity', productId);

            //Returning false from a handler is the same as calling both
            // stopImmediatePropagation and preventDefault on the event.
            return false;
        },
        "click .delete"() {
            if (confirm("Usunąć produkt?")) {
                var productId = this._id;
                Meteor.call('deleteProduct', productId);
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
}