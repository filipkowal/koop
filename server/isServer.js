/**
 * Created by filip on 2016-06-02.
 */
if (Meteor.isServer) {
    Meteor.publish('Products', function(){
        return Products.find();
    });
    Meteor.publish('Orders', function(){
        return Orders.find({ purchaser: this.userId });
    });
}