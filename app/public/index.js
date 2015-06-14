// Register firebase module
var app = angular.module("app", ["firebase"]);

// Set up controller function
app.controller("Ctrl", function($scope, $firebaseObject) {
    var firebaseRef = new Firebase(
      // Replace this fictional URL with your own
      "https://blinding-inferno-2589.firebaseio.com/colors"
    );
    // create an AngularFire ref to the data
    // pull the data into a local model
    var syncObject = $firebaseObject(firebaseRef);

    // sync the object with three-way data binding
    syncObject.$bindTo($scope, "data");
});
