/**
 * Created by filip on 2016-06-17.
 */
if (Meteor .isClient) {

    //SUBSCRIBE TO ORDERS WHEN ORDERSLIST TEMPLATE IS CREATED
    Template.ordersList.onCreated(function () {
        this.autorun(() => {
            this.subscribe('Orders', Meteor.userId());
            // if (subscription.ready()) {
            //   console.log("> Received "+limit+" posts. \n\n")
            //   instance.loaded.set(limit);
            // } else {
            //   console.log("> Subscription is not ready yet. \n\n");
            // }
        });
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
}