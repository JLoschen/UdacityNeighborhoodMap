    var map;
    // Create a new blank array for all the listing markers.
    var markers = [];

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:43.099257, lng: -93.601806},//Garner Iowa
            zoom: 15,
            mapTypeControl: false
        });
        var locations = [
            { title: 'St Paul Lutheran Church', location: { lat: 43.097643, lng: -93.602245}},
            { title: 'Garner Water Tower', location: { lat: 43.096090, lng: -93.602274}},
            { title: 'Veteran\'s Memorial Recreational Center', location: { lat: 43.097726, lng: -93.605354}}
        ];

        var largeInfowindow = new google.maps.InfoWindow();

        for (var i = 0; i < locations.length; i++) {
            var position = locations[i].location;
            var title = locations[i].title;

           var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });

            markers.push(marker);

            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
            });
        }

        showListings();
        // document.getElementById('show-listings').addEventListener('click', showListings);
        // document.getElementById('hide-listings').addEventListener('click', hideListings);

        
        var viewModel = new ViewModel(locations);
        
        ko.applyBindings(viewModel);
    }

    function populateInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    }

    function showListings() {
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        //map.fitBounds(bounds);
    }

    function hideListings() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

function ViewModel(locations){
    this.allLocations = locations;
    this.searchString = ko.observable('');

     //stack overflow with the code for filtering in knockout
     //https://stackoverflow.com/questions/29551997/knockout-search-filter
    this.filterPins = ko.computed(function () {
        var search = this.searchString().toLowerCase();
        return ko.utils.arrayFilter(this.allLocations, function (pin) {
            return pin.title.toLowerCase().indexOf(search) >= 0;
        });
    }, this);
}




