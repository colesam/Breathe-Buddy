/**
 * Created by Mathew on 3/9/2018.
 */
function airQualityControllerFunction($scope, $http) {

    $scope.airQualityHome = 'https://api.openaq.org/v1/';
    $scope.measurements = 'measurements';



    $scope.init = function (){
        $scope.getAirQuality(undefined, undefined, undefined, undefined, {latitude: 44.9778,  longitude: 93.2650}, 10, undefined, undefined, undefined, undefined, 5, function (data) {
            console.log('Obtained data:');
            console.log(data);
        });
    };



    /*
        Information about the API can be found at https://docs.openaq.org/#api-Measurements-GetMeasurements

        string      country
            Limit results by a certain country.
        string      city
            Limit results by a certain city.
        string      location
            Limit results by a certain location.
        string      parameter
            Limit to certain one or more parameters (ex. parameter=pm25 or parameter[]=co&parameter[]=pm25)
            Allowed values: pm25, pm10, so2, no2, o3, co, bc
        string      coordinates
            Center point (lat, lon) used to get measurements within a certain area. (ex. coordinates=40.23,34.17)
        number      radius
            Radius (in meters) used to get measurements within a certain area, must be used with coordinates.
            Default value: 2500
        number      valueFrom
            Show results above value threshold, useful in combination with parameter.
        number      valueTo
            Show results below value threshold, useful in combination with parameter.
        string      dateFrom
            Show results after a certain date. This acts on the utc timestamp of each measurement. (ex. 2015-12-20, or 2015-12-20T09:00:00)
        string      dateTo
            Show results before a certain date. This acts on the utc timestamp of each measurement. (ex. 2015-12-20, or 2015-12-20T09:00:00)
        number      limit
            Change the number of results returned, max is 10000.
            Default value: 100
    */

    $scope.getAirQuality = function(country, city, location, parameter, coordinates, radius, valueFrom, valueTo, dateFrom, dateTo, limit, callBack) {
        console.log('Getting data...');
        $http({
            method: 'GET',
            url: $scope.airQualityHome + $scope.measurements,
            params:  {
                            //country:        country,
                            //city:           city,
                            //location:       location,
                            //parameter:      parameter,
                            coordinates:     coordinates,
                            radius:         radius,
                            //value_from:     valueFrom,
                            //value_to:       valueTo,
                            //date_from:      dateFrom,
                            //date_to:        dateTo,
                            //limit:          limit
                        }
        }).then(function successCallback(response) {
            callBack(response.data.results);
        }, function errorCallback(response) {
            console.log('Failed to obtained air quality data!')
        });
    };








}

airQuality.controller('airQualityCtrl', airQualityControllerFunction);