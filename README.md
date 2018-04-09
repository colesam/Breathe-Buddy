# Breathe-Buddy
An air quality web application built using AngularJS.

For more information about my contributions and process please visit the <a href="http://www.colesamdevelopment.com/portfolio/breathe-buddy.html" target="_blank">project page</a> on my portfolio website.

<h2>Description</h2>

This project is a web application I built with my partner, Mathew Schlichting, for our CISC 375 Web Development course at 
the University of St. Thomas.

The project was built using HTML5, CSS3, Bootstrap 4.0, and AngularJS. It combines the 
<a href="https://developers.google.com/maps/" target="_blank">Google Maps API</a> with the 
<a href="https://docs.openaq.org/" target="_blank">Open AQ API</a> to create a web application that shows the 
user information about the air quality of a given location. 

<h2>Features</h2>
<ul>
  <li>Shows a map using the Google Maps API</li>
  <li>Allows user to search by location name or lat/lng values</li>
  <li>Binds map location to location input boxes to update location when user clicks and drags map</li>
  <li>Allows user to select date within last 90 days to grab data from</li>
  <li>Populates a table with air quality measurements based off of location and date</li>
  <li>Shows a UI for filtering data by particle type or by minimum measurement per particle type</li>
  <li>Pops up measurement data when map marker is hovered over</li>
  <li>Clusters markers together when they occupy a small area on the map</li>
  <li>Features custom made cluster PNG files to match site theme</li>
  <li>Moves critical UI components inside the map on fullscreen mode</li>
  <li>Allows for heatmap display when only one particle type is selected</li>
  <li>Contains "About the Project" page with profile pictures of each partner and short bios</li>
</ul>

<h2>How to Install</h2>

In order to use this application you will need to sign up for a <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">Google Maps API Key</a>.

Once you have your API key you will want to download the files and serve them in your local development environment. 
Next, modify the `$scope.API_KEY` variable in `js/controllers/airQualityController.js` to use the API key you signed up for.
Finally, run the index.html file in the root directory to use the application.
