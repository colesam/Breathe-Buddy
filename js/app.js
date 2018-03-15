"use strict";

var airQuality = angular.module("airQuality", []);

airQuality.controller("appCtrl", function($scope, $http) {

  $scope.init = function (){
      console.log('Version 0.0.1')

  };

});
