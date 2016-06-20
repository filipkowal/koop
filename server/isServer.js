/**
 * Created by filip on 2016-06-02.
 */
if (Meteor.isServer) {
    // CREATE USRS WITH PREDEFINED PERMISSIONS
    // var users = [
    //     {name:"Klient Klient",email:"klient@example.com",roles:'buyer'},
    //     {name:"Producent Producent",email:"producent@example.com",roles:'seller'},
    //     {name:"Manage-Users User",email:"manage@example.com",roles:'manage-users'},
    //     {name:"Admin User",email:"admin@example.com",roles:'admin'}
    // ];
    //
    // _.each(users, function (user) {
    //     var id;
    //
    //     id = Accounts.createUser({
    //         email: user.email,
    //         password: "123456",
    //         profile: { name: user.name }
    //     });
    //
    //     if (user.roles.length > 0) {
    //         // Need _id of existing user record so this call must come
    //         // after `Accounts.createUser` or `Accounts.onCreate`
    //         Roles.addUsersToRoles(id, user.roles);
    //     }
    //
    // });

    Meteor.publish('Products', function(){
        return Products.find();
    });
    Meteor.publish('Orders', function(){
        // Publish orders only to buyer role and show only he's own orders
        if (Roles.userIsInRole(this.userId, 'buyer')) {
            return Orders.find({purchaser: this.userId});
        } else {
            // user not authorized. do not publish secrets
            this.stop();
        }
    });
}