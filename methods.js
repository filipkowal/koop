/**
 * Created by filip on 2016-06-02.
 */
Products = new Mongo.Collection("products");
Orders = new Mongo.Collection("orders");

Meteor.methods({
    insertProduct(productName, producer, price, createdAt, owner, unit, quantity) {
        // Check if current user has a seller role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'seller')) {
            throw new Meteor.Error(403, "Access denied")
        }
        Products.insert({
            productName: productName,
            producer: producer,
            price: price,
            createdAt: createdAt,
            owner: owner,
            unit: unit,
            quantity: quantity
        });
    },
    deleteProduct(productsId){
        // Check if current user has a seller role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'seller')) {
            throw new Meteor.Error(403, "Access denied")
        }
        Products.remove(productsId);
    },
    insertOrder(productsId, productName, producer, quantity, unit, price, summedPrice){
        // Check if current user has a buyer role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'buyer') ||
            quantity=="") {
            throw new Meteor.Error(403, "Access denied")
        }
        Orders.upsert({
                _id: productsId
            },
            {$setOnInsert: {
                _id: productsId,
                productName: productName,
                producer: producer,
                unit: unit,
                price: price,
                purchaser: Meteor.userId()
            },
                $set: {
                    quantity: quantity,
                    createdAt: new Date(),
                    summedPrice: summedPrice}}
        );
        // Change quantity of product that is left
        //Error invoking Method 'insertOrder': Internal server error [500]
        // var orderedQuantity = -1 * quantity;
        // Products.update(productsId, {$inc: { quantity: orderedQuantity }});

    },
    deleteOrder(orderId){
        // Check if current user has a buyer role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'buyer')) {
            throw new Meteor.Error(403, "Access denied")
        }
        Orders.remove(orderId);
    }
});