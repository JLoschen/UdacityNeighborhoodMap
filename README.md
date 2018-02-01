# Udacity Neighborhood Map Project
This is a project for the Udacity [Front End Web developer nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001). It is meant to get the student used to working with 3rd party API's as well as [Knockout JS](http://knockoutjs.com/). My neighborhood map is of [Eau Claire WI](https://en.wikipedia.org/wiki/Eau_Claire,_Wisconsin) where I lived from 2015 to 2017. The map shows some local restaurants, parks and bars.

![Pic of map](/img/ScreenShot.PNG)
## Demo
You can see a live version [here](https://jloschen.github.io/NeighborhoodMap/index.html).  

## Technologies
* [Knockout JS](http://knockoutjs.com/) helps keep websites code/html organized by using the Model, View, ViewModel (MVVM) paradigm which encourages separation of concerns. It does this by using databinding which allows the User Interface of the app to update without explicitly changing html elements in the javascript code.
* [Google Maps API](https://developers.google.com/maps/) Used to show the map and generate the markers. 
* [FourSquare's API](https://developer.foursquare.com/)  Used to get the pictures, address and website information for the various locations.

## Features
* Clicking on a marker on the map will show information about that location loaded from [FourSquare](https://developer.foursquare.com/) including the address and website of the business or group.
* Clicking on a marker also loads 6 images taken at the location from FourSquare's API. 
* The map style can be changed using the drop down at the top.
* The locations can be searched/filtered using the textbox at the top.
* To accommodate smaller screens a button was included that hides the sidebar.

## How to Run Locally
1. [Download](https://github.com/JLoschen/UdacityNeighborhoodMap/archive/master.zip) or [Clone](https://github.com/JLoschen/UdacityNeighborhoodMap.git) the Repository.
2. Double click the `index.html` file to view the project in your browser.

## Resources I used
* Side bar flyout tutorial https://www.youtube.com/watch?v=uWUNZ4u1VLA
* Dark Roads and Retro LandMarks map styles https://mapstyle.withgoogle.com/
* Water Only and Roads Only Map styles https://snazzymaps.com/
* Knockout JS arrayFilter https://stackoverflow.com/questions/29551997/knockout-search-filter
* The pluralsight.com courses 'Knockout Fundamentals' and 'Knockout for the XAML Developer'.
* Styling the filter text box https://www.youtube.com/watch?v=xE92oKJAskE
