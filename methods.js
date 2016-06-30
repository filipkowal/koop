/**
 * Created by filip on 2016-06-02.
 */
Products = new Mongo.Collection("products");
Orders = new Mongo.Collection("orders");

Meteor.methods({
    insertProduct(productName, producer, price, createdAt, owner, unit, productQuantity, amounts,
    sDescription, lDescription, picture) {
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
            productQuantity: productQuantity,
            orderedQuantity: 0,
            amounts: amounts,
            sDescription: sDescription,
            lDescription: lDescription,
            picture: picture
        });
    },
    deleteProduct(productId){
        // Check if current user has a seller role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'seller')) {
            throw new Meteor.Error(403, "Access denied")
        }
        Products.remove(productId);
    },
    setOrderedQuantity(productId){
        // Set quantity of product that is ordered by buyers
        var ordersOfProduct = Orders.find({ productId: productId}).fetch();
        var orderedQuantity = 0;
        for(var i=0; i<ordersOfProduct.length; i += 1){
            orderedQuantity += ordersOfProduct[i].orderQuantity;
        }
        console.log(orderedQuantity);
        Products.update({ _id: productId}, {$set: { orderedQuantity: orderedQuantity }});
    },
    insertOrder(productId, productName, producer, orderQuantity, unit, price, summedPrice, productQuantity, orderedQuantity){
        // Check if current user has a buyer role
        var loggedInUser = Meteor.user();
        if (!loggedInUser ||
            !Roles.userIsInRole(loggedInUser, 'buyer')) {
            throw new Meteor.Error(403, "Access denied")
        }
        if (productQuantity-orderQuantity>=0){
            Orders.upsert({
                    productId: productId
                },
                {
                    $setOnInsert: {
                        productId: productId,
                        productName: productName,
                        producer: producer,
                        unit: unit,
                        price: price,
                        purchaser: Meteor.userId()
                    },
                    $set: {
                        orderQuantity: orderQuantity,
                        createdAt: new Date(),
                        summedPrice: summedPrice
                    }
                }
            );
        }

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