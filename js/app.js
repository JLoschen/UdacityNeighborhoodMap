    var map;
    // Create a new blank array for all the listing markers.
    var markers = [];

    var EauClaireLocations = [
        {title: 'Highland Fitness', fourSquareId: '4c88f0c9da5da1cdb60838e9'},
        //{title: 'Golden Dragon Chinese Restaurant', fourSquareId: '4e4e5a14bd4101d0d7a85286'},
        {title: 'UW-Eau Claire', fourSquareId: '4da600c40c53054ed7b4df8e'},
        //{title: 'Wagner\'s Lanes', fourSquareId: '4b83363bf964a5209afd30e3'},
        {title: 'The Informalist', fourSquareId: '57229631cd1010835c5139a0', defaultUrl: 'http://theinformalist.com'},
        {title: 'Lazy Monk Brewing', fourSquareId: '4eb582a4e5e8743705159e38'},
        {title: 'Carson Park', fourSquareId: '4bd62e257b1876b0e42f8c86', defaultUrl:'https://northwoodsleague.com/eau-claire-express/team/ballpark/'}, // no good url's
        //{title: 'The District Company', fourSquareId: '51bb8cd0498e9ac0b653d06f'},
        {title: 'Eau Claire YMCA', fourSquareId: '4c4b6fa25609c9b6ae5b1d91'},
        {title: 'Eau Claire Children\'s Museum', fourSquareId: '4c5adf90d3aee21e65b76b55', defaultUrl:'http://www.childrensmuseumec.com'},
        {title: 'Acoustic Cafe', fourSquareId: '4b7c4b8ff964a520668a2fe3'}
        //{title: 'Dean & Sue\'s Bar & Grill', fourSquareId: '4e18dac5d1648b8348372829'}
    ];
    var largeInfowindow; 

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:44.817178, lng: -91.511481},//Eau Claire WI
            zoom: 14,
            mapTypeControl: false
        });

        largeInfowindow = new google.maps.InfoWindow();

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

    for(let i = 0; i < EauClaireLocations.length; i++){
        var result = new EauClairePin(EauClaireLocations[i], i);
    }
    showListings();
}

class EauClairePin{
    constructor(loc, index){
        this.self = this;
        this.title = loc.title;
        this.fourSquareId = loc.fourSquareId;
        this.index = index;
        this.getFourSquareData(this.fourSquareId, this.title, this.index);
    }

    // openInfoWindow(param1){
    //     //JSON.stringify(param1)
    //     console.log("1"+ param1);
    //     console.log("2"+ param2.fourSquareId);
    //     if(this === param2){
    //         console.log("yahtzee");
    //     }
    // }
     openInfoWindow(marker){
        if (largeInfowindow.marker != marker) {
            
            largeInfowindow.marker = marker;
            var content = `<div>
                                <div>${marker.title}</div>
                                <div>
                                <a href="${this.url}">${this.url}</a></div>
                                <div><img src="${this.bestPhotoURL}">
                            </div>`;

            largeInfowindow.setContent(content);
            largeInfowindow.open(map, marker);

            largeInfowindow.addListener('closeclick', function() {
                largeInfowindow.marker = null;
            });
        }else{
            console.log("they are equal" + largeInfowindow.marker + " marker" + marker);
        }
    }

    getFourSquareData(fourSquareId, title ,index){
        var url = 'https://api.foursquare.com/v2/venues/' + fourSquareId + '?client_id=H3U143RXVFSPJE0XYGV2C2LUTZLPJVX4O3D4XKEKINMVMORJ&client_secret=GD2SHFG2LB1KWLZ45PUWKHGQ3MAW102ML3CVLOJDGKJV2UHB&v=20170413';
        
        fetch(url)
        .then((data) => data.json())
        .then((res) => {
            //addMarkerToMap(res.response.venue.location, this.title, this.index);
            
            this.url = res.response.venue.url;

            if(res.response.venue.bestPhoto){
                this.bestPhotoURL = res.response.venue.bestPhoto.prefix + "100x100" + res.response.venue.bestPhoto.suffix;
            }
            

            
            this.marker = new google.maps.Marker({
                position: res.response.venue.location,
                title: this.title,
                animation: google.maps.Animation.DROP,
                id: this.index
            });
            
            markers.push(this.marker);
        
            // this.marker.addListener('click', function() {
            //     populateInfoWindow(this, largeInfowindow);
            // });
            var pin = this;
            this.marker.addListener('click', function(){
                pin.openInfoWindow(this);
            });

            /*function() {
                if (largeInfowindow.marker != marker) {
                    
                    largeInfowindow.marker = marker;
                    var content = `<div>
                                        <div>${marker.title}</div>
                                        <div>${self.url}</div>
                                    </div>`;
        
                    largeInfowindow.setContent(content);
                    largeInfowindow.open(map, marker);
        
                    largeInfowindow.addListener('closeclick', function() {
                        largeInfowindow.marker = null;
                    });
                }
            });*/
        
            this.marker.setMap(map);
        })
        .catch((err) => {
            alert(err);
        });
    }
}

function testThing(param1, param2){

}

function addMarkerToMap(position, title, i){
    var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
    });

    markers.push(marker);

    marker.addListener('click', function() {
        // if (largeInfowindow.marker != marker) {
        //     largeInfowindow.marker = marker;
        //     // var content = `<div>
        //     //                     <div>${marker.title}</div>
        //     //                     <div>${this.url}</div>
        //     //                 </div>`;

        //     largeInfowindow.setContent('<div>' + marker.title + '</div>');
        //     largeInfowindow.open(map, marker);

        //     largeInfowindow.addListener('closeclick', function() {
        //         largeInfowindow.marker = null;
        //     });
        // }
    });

    marker.setMap(map);
}

