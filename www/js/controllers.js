ons.bootstrap()

.controller('modalController', function($scope) {
    $scope.dismiss = function() {
        modal.hide();
    }
})

.controller('FridgeController', function($scope) {
    $scope.checkCheckedItems = function() {
        checkCheckedItems();
        console.log(window.checkedIds);
        localStorage.setItem("checkedItems", JSON.stringify(window.checkedIds));
        console.log('saved checked items to Local Storage');
        console.log(JSON.parse(localStorage.getItem("checkedItems")));
    }
    //console.log(window.checkedIds);
                      
})

.controller('MyController', function($scope, $timeout) {
    $scope.items = [{}, {}, {}, {}];
    $scope.timeToCook = cookingTime;
    
    if (audioEnabled) {
        $scope.audToggle = true;
    }
        
    $scope.check = function(){
        if ($scope.audToggle) {
            console.log("Shake Sound activated");
            audioEnabled = true;
        } else {
            console.log("Shake Sound deactivated");
            audioEnabled = false;
        }
    }
    
    $scope.setCookingTime = function() {
        cookingTime = $scope.timeToCook
    }
})