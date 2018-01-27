    var map;
    // Create a new blank array for all the listing markers.
    var markers = [];

    var EauClaireLocations = [
        {title: 'Highland Fitness', fourSquareId: '4c88f0c9da5da1cdb60838e9'},
        {title: 'Golden Dragon Chinese Restaurant', fourSquareId: '4e4e5a14bd4101d0d7a85286'},
        {title: 'UW- Eau Claire', fourSquareId: '4da600c40c53054ed7b4df8e'},
    ];

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:43.099257, lng: -93.601806},//Garner Iowa
            zoom: 15,
            mapTypeControl: false
        });
        // var locations = [
        //     { title: 'St Paul Lutheran Church', location: { lat: 43.097643, lng: -93.602245}},
        //     { title: 'Garner Water Tower', location: { lat: 43.096090, lng: -93.602274}},
        //     { title: 'Veteran\'s Memorial Recreational Center', location: { lat: 43.097726, lng: -93.605354}}
        // ];

        var largeInfowindow = new google.maps.InfoWindow();

        // for (var i = 0; i < locations.length; i++) {
        //     var position = locations[i].location;
        //     var title = locations[i].title;

        //    var marker = new google.maps.Marker({
        //         position: position,
        //         title: title,
        //         animation: google.maps.Animation.DROP,
        //         id: i
        //     });

        //     markers.push(marker);

        //     marker.addListener('click', function() {
        //         populateInfoWindow(this, largeInfowindow);
        //     });
        // }

        // showListings();

        // document.getElementById('show-listings').addEventListener('click', showListings);
        // document.getElementById('hide-listings').addEventListener('click', hideListings);

        
        //var viewModel = new ViewModel(locations);
        
        //ko.applyBindings(viewModel);

        var viewModel = new MapViewModel(EauClaireLocations);
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

function MapViewModel(EauClaireLocations){

    this.allLocations = EauClaireLocations;
    this.searchString = ko.observable('');

     //stack overflow with the code for filtering in knockout
     //https://stackoverflow.com/questions/29551997/knockout-search-filter
    this.filterPins = ko.computed(function () {
        var search = this.searchString().toLowerCase();
        return ko.utils.arrayFilter(this.allLocations, function (pin) {
            return pin.title.toLowerCase().indexOf(search) >= 0;
        });
    }, this);

    //4ebd884c9adf8b96f93ed6aa
    // var fourSquareId = '4da600c40c53054ed7b4df8e';
    // var url = 'https://api.foursquare.com/v2/venues/' + fourSquareId + '?client_id=H3U143RXVFSPJE0XYGV2C2LUTZLPJVX4O3D4XKEKINMVMORJ&client_secret=GD2SHFG2LB1KWLZ45PUWKHGQ3MAW102ML3CVLOJDGKJV2UHB&v=20170413';
    
    // $.getJSON(url).done(function(data) {
    //     //var result = data.response.venues[0];
    //     console.log("response" + data.response.venue.toString());
    // }).fail(function(){
    //     alert('retreiving 4 square data failure');
    // });

    // fetch(url)
    // .then((data) => data.json())
    // .then((res) => {
    //     console.log(res.response.venue.name.toString());
    // })
    // .catch((err) => {
    //     alert('wtf man');
    // });

    //EauClaireLocations.forEach(function(loc){
    for(let i = 0; i < EauClaireLocations.length; i++){
        var loc = EauClaireLocations[i];
        var url = 'https://api.foursquare.com/v2/venues/' + loc.fourSquareId + '?client_id=H3U143RXVFSPJE0XYGV2C2LUTZLPJVX4O3D4XKEKINMVMORJ&client_secret=GD2SHFG2LB1KWLZ45PUWKHGQ3MAW102ML3CVLOJDGKJV2UHB&v=20170413';
        fetch(url)
        .then((data) => data.json())
        .then((res) => {
            //console.log(res.response.venue.name.toString());
            //var lat = res.response.venue.location.lat;
            //var long = res.response.venue.location.lng;
            //console.log('lat' + lat);
            //console.log('lng' + long);
            //var position = {lat:lat, lng:long};//locations[i].location;
            var position = res.response.venue.location;
            var title = loc.title;//locations[i].title;
    
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

            marker.setMap(map);
        })
        .catch((err) => {
            alert('wtf man');
        });
    }
    //});

    //for (var i = 0; i < locations.length; i++) {
    //     var position = locations[i].location;
    //     var title = locations[i].title;

    //    var marker = new google.maps.Marker({
    //         position: position,
    //         title: title,
    //         animation: google.maps.Animation.DROP,
    //         id: i
    //     });

    //     markers.push(marker);

    //     marker.addListener('click', function() {
    //         populateInfoWindow(this, largeInfowindow);
    //     });
    //}

    showListings();
    
}

