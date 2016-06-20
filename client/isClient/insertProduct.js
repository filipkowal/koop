/**
 * Created by filip on 2016-06-17.
 */
if (Meteor .isClient) {

    Template.insertProduct.helpers({
        'isChecked'() {

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
            var sDescription = event.target.sDescription.value;
            var lDescription = event.target.lDescription.value;
            var picture = event.target.picture.value;

            var amounts = [];
            var amountElements = document.getElementsByClassName("amounts");
            for(var i = 0; i < amountElements.length; i++){
                if(amountElements[i].checked){
                    console.log(amountElements[i].value);
                    amounts.push(amountElements[i].value);
                }

            }

            // var AMOUNTS = ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.75",
            //     "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "15", "20"];
            // AMOUNTS.forEach((amount)=>{
            //     if(event.target.amount.value){
            //         amounts.push(amount);
            //     }
            // });

            Meteor.call('insertProduct', productName, producer, price, createdAt,
                owner, unit, quantity, amounts, sDescription, lDescription, picture);

            //Clear textboxes in the form
            event.target.productName.value = "";
            event.target.producer.value = "";
            event.target.price.value = "";
            event.target.quantity.value = "";
        }
    });
}