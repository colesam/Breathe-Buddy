/**
 * Created by Mathew on 3/9/2018.
 */
function airQualityControllerFunction($scope, $http) {

    /* Air Quality API Constants */
        $scope.airQualityHome = 'https://api.openaq.org/v1/';
        $scope.measurements = 'measurements';
        $scope.airData = [];
        $scope.options = ['pm25', 'pm10', 'so2', 'no2', 'o3', 'co', 'bc'];

    /* Google Maps API Constants */
        $scope.API_KEY = 'AIzaSyAa9M8srClYjpe9v5kURZ9JEM1Vg3H0nNQ';
        $scope.API_LOC = 'https://www.google.com/maps/embed/v1/place';
        $scope.API_START = $scope.API_LOC + '?key=' + $scope.API_KEY + '&q=';
        $scope.MARKER_CLUSTER_OBJ = {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'};

    /* User input */
        $scope.location = '';
        $scope.lat_lng = '';
        $scope.selectedDate = '';

    /* Map Variables */
        $scope.map = null;
        $scope.markers = [];
        $scope.heatmap = null;
        $scope.geocoder = null;
        $scope.fullscreen = false;
        $scope.markerCluterManager = null;
        $scope.loading = false;

    /* Date Picker Variables */
        $scope.datePicker   = $('#date-picker table');
        $scope.dates        = [];

    /* Other Data */
        $scope.currentRowHover = null;
        $scope.heatmapOn = false;

    /* Minimum Filter */
        $scope.minPM25 = 0;
        $scope.minPM10 = 0;
        $scope.minSO2 = 0;
        $scope.minNO2 = 0;
        $scope.minO3 = 0;
        $scope.minCO = 0;
        $scope.minBC = 0;

        $scope.mins = {pm25: 0, pm10: 0, so2: 0, no2: 0, o3: 0, co: 0, bc: 0};







    $scope.init = function (){
        $scope.mapInit();
        $scope.dateInit();
        
        $('.select2-multi').select2();

        $scope.$watch('currentRowHover', $scope.setCurrentHover);
        $scope.disableHeatMap();
    };









    /*************************************************** **************************************************************/
    /*******************************************   On Page Actions   **************************************************/
    /*************************************************** **************************************************************/

    $scope.updateMins = function(){
        $scope.mins.pm25    = $scope.minPM25;
        $scope.mins.pm10    = $scope.minPM10;
        $scope.mins.so2     = $scope.minSO2;
        $scope.mins.no2     = $scope.minNO2;
        $scope.mins.o3      = $scope.minO3;
        $scope.mins.co      = $scope.minCO;
        $scope.mins.bc      = $scope.minBC;

        console.log($scope.mins);

    };

    $scope.updateFilter = function(){
        $scope.options = [];//['pm25', 'pm10', 'so2', 'no2', 'o3', 'co', 'bc'];

        $('#filter ul li').each(function(i){
            if($(this).attr('title') !== undefined) {
                $scope.options.push($(this).attr('title').toLowerCase());
            }
        });

        if($scope.options.length === 1){
            $scope.enableHeatMap();
        }
        else{
            $scope.turnOffHeatMap();
            $scope.disableHeatMap();
        }

        $scope.updateMap();
    };

    $scope.toggleHeatMap = function(){
        $scope.heatmapOn = !$scope.heatmapOn;

        if($scope.heatmapOn){
            $scope.turnOnHeatMap();
        }
        else{
            $scope.turnOffHeatMap();
        }
    };

    $scope.turnOffHeatMap = function() {
        var button = $('#heatmapToggle');


        button.removeClass('btn-success');
        button.addClass('btn-danger');

        $scope.clearHeatMap();
    };

    $scope.turnOnHeatMap = function() {
        var button = $('#heatmapToggle');

        button.removeClass('btn-danger');
        button.addClass('btn-success');

        $scope.updateHeatMap();
    };

    $scope.disableHeatMap = function(){
        $('#heatmapToggle').attr('disabled', 'disabled');
    };
    $scope.enableHeatMap = function(){
        $('#heatmapToggle').removeAttr('disabled');
    };


    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/











    /*************************************************** **************************************************************/
    /*******************************************   Basic Map Functions   **********************************************/
    /*************************************************** **************************************************************/


    $scope.mapInit = function() {
        //creates a map centered at Minneapolis
        var latitude    =  44.975;
        var longitude   = -93.265;
        var clone;
        var element;

        $scope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: latitude, lng: longitude}
        });

        $scope.geocoder = new google.maps.Geocoder;
        $scope.lat_lng = latitude + ', ' + longitude;
        
        //  create container div for the map controls inside fullscreen map
        element = $('<div></div>');
        element.addClass('container in-map');
        $('#map > div').append(element);
        
        //  place heatmap button inside google map
        var heatmapBtn = $('<div></div>');
        heatmapBtn.html('Heat Map');
        heatmapBtn.addClass('heatmap-button btn transitions');
        heatmapBtn.attr('id', 'heatmapToggle');
        heatmapBtn.attr('ng-click', 'toggleHeatMap()');
        $('#map > div').append(heatmapBtn);

        google.maps.event.addListener($scope.map, 'idle', $scope.updateMap);
        $scope.map.bounds_changed = $scope.checkFullScreen;

        $scope.disableHeatMap();
    };

    $scope.getGeoCode = function(reqType, value, successCallback, failureCallback){
        var obj = {};
        obj[reqType] = value;

        $scope.geocoder.geocode( obj, function(result, status) {
            if(status === 'OK' && result !== undefined && result.length > 0){
                successCallback(result);
            }
            else{
                failureCallback(value);
            }
        });
    };

    $scope.checkFullScreen = function(){
        var mapDivElement = $('#map').children().eq(0);

        if(mapDivElement.height() >= window.innerHeight && mapDivElement.width() >= window.innerWidth) {
            
            if(!$scope.fullscreen) {

                //  move map controls to full screen map
                var element = $('#map-controls');
                $('.in-map').prepend(element);
    
                $scope.fullscreen = true;
            }
                
        }
        else {
            
            if($scope.fullscreen) {
                
                //  move map controls back to original place on DOM
                var element = $('#map-controls');
                element.removeClass('.in-map');
                $('div[ng-controller="airQualityCtrl"]').prepend(element);

                $scope.fullscreen = false;
                
            }
            
        }
    };

    $scope.updateMap = function(){
        //get radius and set max radius at 10,000
        var radius = $scope.getRadius($scope.map.getBounds());
        radius = Math.round(Math.min(radius, 100000));

        var from = new Date($scope.selectedDate);
        var to = new Date($scope.selectedDate);
        to.setDate(to.getDate() + 1);

        $scope.getAirQuality($scope.populateMarkers, $scope.lat_lng, radius, $scope.options, from, to, 10000);
    };

    $scope.updateLocation = function(){
        $scope.loading = false;
        $scope.lat_lng = (Math.round($scope.map.center.lat() * 1000) / 1000) + ', ' + (Math.round($scope.map.center.lng() * 1000) / 1000);
        var locArr = $scope.lat_lng.split(', ');
        var locObj = {lat: Number(locArr[0]), lng: Number(locArr[1])};

        $scope.getGeoCode('location', locObj, function(adr){
            var target = 0;
            var found = false;

            for(var i=0; !found && i<adr.length; i++){
                for (var j=0; !found && j < adr[i].types.length; j++) {
                    if (adr[i].types[j] === 'locality') {
                        target = i;
                        found = true;
                    }
                }
            }

            $scope.$apply(function () {
                $scope.location = adr[target].formatted_address;
            });

        }, function(location){
            //can't find location
        });
    };


    $scope.submitLocation = function(event){
        if(event.keyCode === 13 && $scope[event.currentTarget.name].length > 0) {
            $scope.getGeoCode('address', $scope[event.currentTarget.name], function (result) {
                $scope.map.setCenter({
                    lat: result[0].geometry.location.lat(),
                    lng: result[0].geometry.location.lng()
                });

                $scope.map.setZoom(10);
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

    $scope.closeMarkerPopup = function(){
        var element = $('#marker-popup');
        element.css('visibility', 'hidden');
    };

    $scope.openMarkerPopup = function(){
        // marker lat = this.internalPosition.lat();
        // marker lng = this.internalPosition.lng();

        var element = $('#marker-popup');

        element.css('visibility', 'visible');
        element.css('top', '0');
        element.css('left', '0');
    };

    /*
        Places a maker at specified lat and lng
        coordinates = {lat: ####, lng: ####};
     */
    $scope.placeMarker = function(coordinates){
        var marker;

        if(coordinates.lng !== undefined && coordinates.lat !== undefined) {
            marker = new google.maps.Marker({
                position: coordinates,
                map: $scope.map,
                icon: 'images/arrow.png'
            });
            marker.addListener('mouseover', $scope.openMarkerPopup);
            marker.addListener('mouseout', $scope.closeMarkerPopup);

            $scope.markers.push(marker);
        }
    };

    $scope.updateClusters = function(){
        if($scope.markerCluterManager !== null){
            $scope.markerCluterManager = new MarkerClusterer($scope.map, [], $scope.MARKER_CLUSTER_OBJ);
        }

        $scope.markerCluterManager = new MarkerClusterer($scope.map, $scope.markers, $scope.MARKER_CLUSTER_OBJ);
        $scope.updateTable();
        $scope.updateLocation();
    };


    $scope.updateTable = function(){
        var table = $('#air-data-table');
        var html = '';

        var id;
        var pm25;
        var pm10;
        var so2;
        var no2;
        var o3;
        var co;
        var bc;

        for(var i=0; i<$scope.airData.length; i++){
            id = i + 1;

            pm25 = $scope.airData[i].pm25 !== undefined ? $scope.airData[i].pm25.value : '';
            pm10 = $scope.airData[i].pm10 !== undefined ? $scope.airData[i].pm10.value : '';
            so2  = $scope.airData[i].so2  !== undefined ? $scope.airData[i].so2.value  : '';
            no2  = $scope.airData[i].no2  !== undefined ? $scope.airData[i].no2.value  : '';
            o3   = $scope.airData[i].o3   !== undefined ? $scope.airData[i].o3.value   : '';
            co   = $scope.airData[i].co   !== undefined ? $scope.airData[i].co.value   : '';
            bc   = $scope.airData[i].bc   !== undefined ? $scope.airData[i].bc.value   : '';

            html +=     '<tr id="table-row-' + id + '">' +
                            '<td id="data-id-'   + id + '">' + id   + '</td>' +
                            '<td id="data-pm25-' + id + '">' + pm25 + '</td>' +
                            '<td id="data-pm10-' + id + '">' + pm10 + '</td>' +
                            '<td id="data-so2-'  + id + '">' + so2  + '</td>' +
                            '<td id="data-no2-'  + id + '">' + no2  + '</td>' +
                            '<td id="data-o3-'   + id + '">' + o3   + '</td>' +
                            '<td id="data-co-'   + id + '">' + co   + '</td>' +
                            '<td id="data-bc-'   + id + '">' + bc   + '</td>' +
                        '</tr>';
        }

        table.html(html);
    };

    $scope.setCurrentHover = function(){
        if($scope.currentRowHover !== null){
            $scope.currentRowHover.setIcon('images/selected-arrow.png');
        }
    };

    $scope.mouseOverTable = function(event){
        var id = Number(event.target.id.split('-')[2]) - 1;

        if(!isNaN(id)) {
            if($scope.currentRowHover !== null) {
                $scope.currentRowHover.setIcon('images/arrow.png');
            }
            $scope.currentRowHover = $scope.markers[Number(event.target.id.split('-')[2]) - 1];
        }
    };
    $scope.mouseOutTable = function(){
        if($scope.currentRowHover !== null) {
            $scope.currentRowHover.setIcon('images/arrow.png');
        }
        $scope.currentRowHover = null;
    };

    $scope.clearHeatMap = function(){
        if($scope.heatmap !== null) {
            $scope.heatmap.setMap(null);
        }
    };

    $scope.updateHeatMap = function(){
        var heatMapData = [];

        for(var i=0; i<$scope.airData.length; i++){
            heatMapData.push({location: new google.maps.LatLng($scope.airData[i].coordinates.latitude, $scope.airData[i].coordinates.longitude), weight: Math.pow(1000 * $scope.airData[i][$scope.options[0]].value, 5)});
        }

        $scope.heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData,
            map: $scope.map
        });

        $scope.heatmap.set('radius', 75);
    };

    $scope.populateMarkers = function(data){
        var i;

        //clear old data
        $scope.airData = [];


        //add new data
        for(i=0; i<data.length; i++){
            if(data[i] !== undefined){
                if(data[i].coordinates !== undefined){
                    $scope.addData(data[i]);
                }
            }
        }

        //clear old markers
        for(i=0; i<$scope.markers.length; i++){
            $scope.markers[i].setMap(null);
        }
        $scope.updateClusters();
        $scope.markers = [];


        //add new markers
        for(i=0; i<$scope.airData.length; i++) {
            $scope.placeMarker({lat: $scope.airData[i].coordinates.latitude, lng: $scope.airData[i].coordinates.longitude});
        }

        //cluster markers if we should
        $scope.updateClusters();
    };

    $scope.addData = function(data){
        var found = false;
        var dataObj;

        //find if there are coordinates already there
        for(var i=0; i<$scope.airData.length; i++){
            if($scope.airData[i].coordinates.latitude === data.coordinates.latitude && $scope.airData[i].coordinates.longitude === data.coordinates.longitude){
                //found existing location
                found = true;

                //if above min
                //if($scope.mins[data.unit] <= data.value) {
                    dataObj = {
                        unit: data.unit,
                        value: data.value,
                        date: data.date
                    };

                    $scope.airData[i][data.parameter] = dataObj;
                //}
            }
        }

        if(!found ){//&& $scope.mins[data.unit] <= data.value) {
            //add new location
            var obj = {
                coordinates: data.coordinates
            };
            obj[data.parameter] = {
                unit: data.unit,
                value: data.value,
                date: data.date
            };

            $scope.airData.push(obj);
        }
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
    /*******************************************   Date Picker   ******************************************************/
    /*************************************************** **************************************************************/

    $scope.dateInit = function() {
        
        var date;
        var button;
        var day = new Date().getDate();
        var months = [];
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        //  fill dates array with all valid dates (last 90 days including today)
        for(var i = 0; i < 90; i++) {
            
            date = new Date();
            date.setDate(day - i);
            date.isSelected = false;
            $scope.dates.push(date);
            
        }
        
        //  reverse dates array to make it more intuitive
        $scope.dates.reverse();
        
        //  create button for each month in last 90 days
        $scope.dates.forEach((date) => {
            
            if(!months.includes(date.getMonth())) {
            
                //   push month on to array
                months.push(date.getMonth());
                
                //   create button for month
                button = $('<button></button>');
                button.addClass('btn btn-custom');
                button.html(monthNames[date.getMonth()]);
                button.click(function() { 
                    
                    //  when the button is clicked load the month
                    $scope.loadMonth(date.getMonth());
                    $('.month .selected').removeClass('selected');
                    $(this).addClass('selected');
                    
                });
                
                //  append to page
                $('.month').prepend(button);
                
                //  if it is the current month, add selected class
                if(new Date().getMonth() === date.getMonth()) { button.addClass('selected'); }
            
            }
            
        });
        
        //  load the month of today, set today to active
        $scope.selectedDate = $scope.dateToStr($scope.dates[89]);
        $scope.loadMonth($scope.dates[89].getMonth());

    }
    
    $scope.loadMonth = function(month) {
        
        var startIndex;
        
        //  error check
        if(typeof(month) != 'number') { console.log('airQualityController.loadMonth(): parameter month must be a number, was typeof: ' + typeof(month)); }
        if(month < 0 || month > 11) { console.log('airQualityController.loadMonth(): parameter month must range from 0 to 11, value was: ' + month ); }

        //  find the first date of the month
        var notFound = true;
        for(var i = 0; i < 90 && notFound; i++) {

            if($scope.dates[i].getMonth() === month) { 
                
                startIndex = i; 
                notFound = false;
                
            }
            
        }

        //  find the index of the first Sunday, even if it's in the previous month
        while(startIndex >= 0 && $scope.dates[startIndex].getDay() != 0) { startIndex--; }
        
        //  load correct dates into each of the five rows of the calendar
        $scope.loadWeek(month, 1, startIndex);
        $scope.loadWeek(month, 2, startIndex + 7);
        $scope.loadWeek(month, 3, startIndex + 14);
        $scope.loadWeek(month, 4, startIndex + 21);
        $scope.loadWeek(month, 5, startIndex + 28);
            
        
    };
    
    $scope.loadWeek = function(month, week, index) {
        
        //  error check
        if(week < 1 || week > 5) { console.log("airQualityController.loadWeek(): week parameter must be between 1 and 5 (including 1 and 5).") }
        if(typeof(month) != 'number') { console.log('airQualityController.loadMonth(): parameter month must be a number, was typeof: ' + typeof(month)); }
        if(month < 0 || month > 11) { console.log('airQualityController.loadMonth(): parameter month must range from 0 to 11, value was: ' + month ); }
        
        var week = $('#week' + week);
        var days = week.children('td');
        
        days.each(function(i) {
            
            //  use index parameter (from loadWeek not days.each) to find the correct date
            var date = $scope.dates[index];
            
            //  reset all CSS classes
            $(this).removeClass();

            if(index >= 0 && index < 90) { 
                
                //  attach date as an attribute
                $(this).data('date', $scope.dateToStr(date));
                console.log($(this).data('date'));
                
                //  append date to the inside of <td>
                $(this).html(date.getDate());
                
                //  if it's selected give it the selected class
                if($scope.selectedDate === $(this).data('date')) { $(this).addClass('selected'); }
                
                //  if day is not in the current month, give it gray styling
                if(date.getMonth() != month) { $(this).addClass('gray-date'); }
                
                //  on click, update the scope's selectedDate variable and add selected CSS class
                $(this).click(function() { 
                    
                    $('.calendar .selected').removeClass('selected');
                    $(this).addClass('selected');
                    $scope.selectedDate = $(this).data('date');

                    $scope.updateMap();
                });
                
            } else {
                
                //  day is outside the 90 day range and is therefore unavailable
                $(this).html('00');
                $(this).addClass('unavailable');
                
            }
            
            index++;
            
        });
        
    }
    
    $scope.dateToStr = function(date) {
        
        var year = '';
        var month = '';
        var day = '';
        
        //  get the year
        year = date.getFullYear();
        
        //  get the month
        if(date.getMonth() < 10) { month = '0'; }
        month += date.getMonth() + 1;
        
        //  get the date
        if(date.getDate() < 10) { day = '0'; }
        day += date.getDate();
        
        return year + '-' + month + '-' + day;
        
    }

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

        return r_km *1000; // radius in meters
    };

    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/
    /*************************************************** **************************************************************/

}

airQuality.controller('airQualityCtrl', airQualityControllerFunction);