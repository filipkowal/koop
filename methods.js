/**
 * Created by filip on 2016-06-02.
 */
Products = new Mongo.Collection("products");
Orders = new Mongo.Collection("orders");

Meteor.methods({
    insertProduct(productName, producer, price, createdAt, owner, unit, quantity, amounts,
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
            quantity: quantity,
            orderedQuantity: 0,
            amounts: amounts,
            sDescription: sDescription,
            lDescription: lDescription,
            picture: picture
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
            !Roles.userIsInRole(loggedInUser, 'buyer')) {
            throw new Meteor.Error(403, "Access denied")
        }
        if (quantity!="") {
            Orders.upsert({
                    productsId: productsId
                },
                {
                    $setOnInsert: {
                        productsId: productsId,
                        productName: productName,
                        producer: producer,
                        unit: unit,
                        price: price,
                        purchaser: Meteor.userId()
                    },
                    $set: {
                        quantity: quantity,
                        createdAt: new Date(),
                        summedPrice: summedPrice
                    }
                }
            );
        }
        // Change quantity of product that is left
        // ERROR PRODUCT.UPDATE NIC NIE ROBI
        console.log(quantity);
        Products.update({productsId: productsId}, {$inc: { orderedQuantity: quantity }});

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