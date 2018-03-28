"use strict";

var airQuality = angular.module("airQuality", []);

airQuality.controller("appCtrl", function($scope, $http) {

    $scope.init = function (){
        console.log('Version 0.0.1')
    };

});

// NAV JS

$(document).ready(function() {
    
    $('#app-nav').click(() => {
        
        //  update nav css
        $('#app-nav').addClass('active');
        $('#about-nav').removeClass('active');
        
        //  display proper html
        $('#app-html').removeClass('d-none');
        $('#about-html').addClass('d-none');
        
    });
    
    $('#about-nav').click(() => {
        
        //  update nav css
        $('#about-nav').addClass('active');
        $('#app-nav').removeClass('active');
        
        //  display proper html
        $('#about-html').removeClass('d-none');
        $('#app-html').addClass('d-none');
        
    });
    
});