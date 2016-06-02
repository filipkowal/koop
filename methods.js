/**
 * Created by filip on 2016-06-02.
 */
Products = new Mongo.Collection("products");
Orders = new Mongo.Collection("orders");


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