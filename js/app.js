"use strict";

var airQuality = angular.module("airQuality", ['ui.router']);

airQuality.controller("appCtrl", function($scope) {

  $scope.init = function (){
      console.log('Version 0.0.1')

  };

});
