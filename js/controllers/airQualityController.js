/**
 * Created by Mathew on 3/9/2018.
 */
function airQualityControllerFunction($scope, $http) {

    /* Air Quality API Constants */
    $scope.airQualityHome = 'https://api.openaq.org/v1/';
    $scope.measurements = 'measurements';

    /* Google Maps API Constants */
    $scope.API_KEY = 'AIzaSyAa9M8srClYjpe9v5kURZ9JEM1Vg3H0nNQ';
    $scope.API_LOC = 'https://www.google.com/maps/embed/v1/place';
    $scope.API_START = $scope.API_LOC + '?key=' + $scope.API_KEY + '&q=';
    $scope.MARKER_CLUSTER_OBJ = {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'};

    /* User input */
    $scope.location = '';
    $scope.lat_lng = '';


    /* Map Variables */
    $scope.map = null;
    $scope.markers = [];
    $scope.geocoder = null;
    $scope.fullscreen = false;
    $scope.markerCluterManager = null;
    $scope.loading = false;




    $scope.init = function (){
        $scope.mapInit();
    };





    /*************************************************** **************************************************************/
    /*******************************************   Basic Map Functions   **********************************************/
    /*************************************************** **************************************************************/


    $scope.mapInit = function() {
        //creates a map centered at Minneapolis
        var latitude    =  44.975;
        var longitude   = -93.265;
        var clone;

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: latitude, lng: longitude}
        });

        $scope.geocoder = new google.maps.Geocoder;
        $scope.lat_lng = latitude + ', ' + longitude;
        
        //  clone the #to-map row, updated id, and display-none
        clone = $('#to-map').clone();
        clone.attr('id', 'map-controls');
        clone.removeClass('d-flex').addClass('d-none fixed');
        
        //  append clone to the inside of the map
        $('#map div').append(clone);

        google.maps.event.addListener($scope.map, 'idle', $scope.updateMap);
        $scope.map.bounds_changed = $scope.checkFullScreen;
    };

    $scope.getGeoCode = function(address, successCallback, failureCallback){
        $scope.geocoder.geocode( { 'address': address}, function(result, status) {
            if(status === 'OK' && result !== undefined && result.length > 0){
                successCallback(result);
            }
            else{
                failureCallback(address);
            }
        });
    };

    $scope.checkFullScreen = function(){
        var mapDivElement = $('#map').children().eq(0);

        if(mapDivElement.height() === window.innerHeight && mapDivElement.width() === window.innerWidth) {
            if(!$scope.fullscreen){
                console.log('To Fullscreen');
                //update to fullscreen
                $('#map-controls').removeClass('d-none').addClass('d-flex');

                $scope.fullscreen = true;
            }
        }
        else{
            if($scope.fullscreen) {
                //update to non-fullscreen
                $('#map-controls').removeClass('d-flex').addClass('d-none');
                console.log('To non-fullscreen');

                $scope.fullscreen = false;
            }
        }
    };

    $scope.updateMap = function(){
        //get radius and set max radius at 10,000
        var radius = $scope.getRadius($scope.map.getBounds());
        radius = Math.round(Math.min(radius, 100000));
        $scope.getAirQuality($scope.populateMarkers, $scope.lat_lng, radius , undefined, '2018-3-18', '2018-3-19', 10000);
    };

    $scope.updateLocation = function(){
        $scope.loading = false;
        $scope.lat_lng = (Math.round($scope.map.center.lat() * 1000) / 1000) + ', ' + (Math.round($scope.map.center.lng() * 1000) / 1000);
    };

    $scope.submitLocation = function(event){
        if(event.keyCode === 13 && $scope[event.currentTarget.name].length > 0) {
            $scope.getGeoCode($scope[event.currentTarget.name], function (result) {
                $scope.map.setCenter({
                    lat: result[0].geometry.location.lat(),
                    lng: result[0].geometry.location.lng()
                });
            }, function (address) {
                alert('Unable to find location: ' + address);
            });
        }
    };

    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/

















    /*************************************************** **************************************************************/
    /*******************************************   Handling Markers   *************************************************/
    /*************************************************** **************************************************************/


    /*
        Places a maker at specified lat and lng
        coordinates = {lat: ####, lng: ####};
     */
    $scope.placeMarker = function(coordinates){
        if(coordinates.lng !== undefined && coordinates.lat !== undefined) {
            $scope.markers.push(new google.maps.Marker({
                position: coordinates,
                map: $scope.map
            }));
        }
    };

    $scope.updateClusters = function(){
        $scope.markerCluterManager = new MarkerClusterer($scope.map, $scope.markers, $scope.MARKER_CLUSTER_OBJ);
        $scope.updateLocation();
    };

    $scope.populateMarkers = function(data){
        //clear old markers
        $scope.markers = [];

        for(var i=0; i<data.length; i++){
            if(data[i] !== undefined){
                if(data[i].coordinates !== undefined){
                    $scope.placeMarker({lat: data[i].coordinates.latitude, lng: data[i].coordinates.longitude});
                }
            }
        }

        $scope.updateClusters();

    };

    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/











    /*************************************************** **************************************************************/
    /*******************************************   Air Quality Stuff   ************************************************/
    /*************************************************** **************************************************************/

    /*
        Information about the API can be found at https://docs.openaq.org/#api-Measurements-GetMeasurements

        string      coordinates
            Center point (lat, lon) used to get measurements within a certain area. (ex. coordinates=40.23,34.17)

        number      radius
            Radius (in meters) used to get measurements within a certain area, must be used with coordinates.
            Default value: 2500

        string      parameter
            Limit to certain one or more parameters (ex. parameter=pm25 or parameter[]=co&parameter[]=pm25)
            Allowed values: pm25, pm10, so2, no2, o3, co, bc

        string      dateFrom
            Show results after a certain date. This acts on the utc timestamp of each measurement. (ex. 2015-12-20, or 2015-12-20T09:00:00)

        string      dateTo
            Show results before a certain date. This acts on the utc timestamp of each measurement. (ex. 2015-12-20, or 2015-12-20T09:00:00)

        number      limit
            Change the number of results returned, max is 10000.
            Default value: 100
    */

    $scope.getAirQuality = function(callBack, coordinates, radius, type, dateFrom, dateTo, limit) {
        var parameters = {};
        if(coordinates !== undefined){
            parameters.coordinates = coordinates;
        }
        if(radius !== undefined){
            parameters.radius = radius;
        }
        if(type !== undefined){
            parameters.parameter = type;
        }
        if(dateFrom !== undefined){
            parameters.date_from = dateFrom;
        }
        if(dateTo !== undefined){
            parameters.date_to = dateTo;
        }
        if(limit !== undefined){
            parameters.limit = limit
        }

        $scope.loading = true;
        $scope.lat_lng = 'Loading...';

        $http({
            method: 'GET',
            url: $scope.airQualityHome + $scope.measurements,
            params:  parameters
        }).then(function successCallback(response) {
            callBack(response.data.results);
        }, function errorCallback(response) {
            console.log('Failed to obtained air quality data!')
        });
    };


    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
















    /*************************************************** **************************************************************/
    /*******************************************   Basic Functions   **************************************************/
    /*************************************************** **************************************************************/

    $scope.convertNameToAPI = function(s){
        var result;

        result = '';
        for(var i=0; i<s.length ;i++){
            if(s.charAt(i) === ' '){
                result += '+';
            }
            else{
                result += s.charAt(i);
            }
        }
        return result;
    };

    $scope.getRadius = function(bounds){
        // r = radius of the earth in km
        var r = 6378.8;

        // degrees to radians (divide by 57.2958)
        var ne_lat = bounds.getNorthEast().lat() / 57.2958;
        var ne_lng = bounds.getNorthEast().lng() / 57.2958;
        var c_lat = bounds.getCenter().lat() / 57.2958;
        var c_lng = bounds.getCenter().lng() / 57.2958;

        // distance = circle radius from center to Northeast corner of bounds
        var r_km = r * Math.acos(
            Math.sin(c_lat) * Math.sin(ne_lat) +
            Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
        );

        return r_km *1000 // radius in meters
    };

    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/

}

airQuality.controller('airQualityCtrl', airQualityControllerFunction);