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
            event.preventDefault();
            var quantity = Number(event.target.value);
            var productName = this.productName;
            var producer = this.producer;
            var productsId = this._id;
            var unit = this.unit;
            var price = Number(this.price);
            var summedPrice = price * quantity;

            Meteor.call('insertOrder', productsId, productName, producer, quantity, unit,
                price, summedPrice);
        },
        "click .delete"() {
            if (confirm("Usunąć produkt?")) {
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
}