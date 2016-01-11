Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("addOrders", function(request, response) {
    var Order = Parse.Object.extend("Order");
    var order = new Order();
    var customerOrder = request.params.customerOrder;
    var user = request.params.user;

    order.set("user", user);
    order.set("customerOrder", customerOrder);
    order.set("status", request.params.status);

    order.save(null, {
        success: function() {
            console.log("Order: " + user + ", " + customerOrder + " added.");
            response.success("Success");
         },
        error: function(quote, error) {
            console.log(error.message);
            response.error(error.message);
        }
    });
});

Parse.Cloud.beforeSave("Order", function(request, response) {
    if (request.object.get("customerOrder") == null||
        request.object.get("user") == null ||
        request.object.get("status") == null) {
        response.error("you have missing fields");
    } else {
        response.success();
    }
});

Parse.Cloud.define("getOrders", function(request, response) {
    var Order = Parse.Object.extend("Order");
    var query = new Parse.Query(Order);
    
    query.ascending("createdAt");
    query.equalTo("status", true);

    query.find({
        success: function(results) {
            response.success(results);
        },
        error: function(error) {
            console.log(error.message);
            response.error(error.message);
        }
    });
});
