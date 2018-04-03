/**
 * Created by Mathew on 4/3/2018.
 */

function aboutTheProjectControllerFunction($scope) {

    $scope.mattAge = '';

    $scope.init = function(){
        var today = new Date();
        var mattBDay = new Date(1996, 10, 10);

        //Calculate current age
        $scope.mattAge = today.getFullYear() - mattBDay.getFullYear();
        if((today.getDate() - mattBDay.getDate() == 0 && today.getDate() - mattBDay.getDate() < 0) || today.getDate() - mattBDay.getDate() < 0){
            $scope.mattAge--;
        }


    }

}

airQuality.controller('aboutTheProjectCtrl', aboutTheProjectControllerFunction);