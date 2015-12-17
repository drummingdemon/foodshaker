ons.bootstrap()

.controller('modalController', function($scope) {
    $scope.dismiss = function() {
        modal.hide();
    }
})

.controller('MyController', function($scope, $timeout) {
    $scope.items = [{}, {}, {}, {}];
    $scope.timeToCook = cookingTime;
    
    if (audioEnabled) {
        $scope.audToggle = true;
    }
    
    if (onlineMode) {
        $scope.onlineToggle = true;
    }
    
    $scope.check = function(){
        if ($scope.audToggle) {
            console.log("ENABLED!");
            audioEnabled = true;
        } else {
            console.log("DISABLED!");
            audioEnabled = false;
        }
    }
    
    $scope.toggleOnline = function() {
        if ($scope.onlineToggle) {
            console.log("Online Mode activated");
            onlineMode = true;
        } else {
            console.log("Global Shake deactivated");
            onlineMode = false;
        }
    }
    
    $scope.setCookingTime = function() {
        cookingTime = $scope.timeToCook
    }
})