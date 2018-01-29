    var map;
    // Create a new blank array for all the listing markers.
    var markers = [];

    var EauClaireLocations = [
        //{ title: 'Highland Fitness', fourSquareId: '4c88f0c9da5da1cdb60838e9'},
        //{title: 'Golden Dragon Chinese Restaurant', fourSquareId: '4e4e5a14bd4101d0d7a85286'},
        // 4b742cd8f964a5203ccb2de3
        // lower campus 9 pics 4d7e7bb795c1a143f65dd2f2
        { title: 'UW-Eau Claire', fourSquareId: '4d7e7bb795c1a143f65dd2f2'},
        //{title: 'Wagner\'s Lanes', fourSquareId: '4b83363bf964a5209afd30e3'},
        { title: 'The Informalist', fourSquareId: '57229631cd1010835c5139a0', defaultUrl: 'http://theinformalist.com'},
        { title: 'Lazy Monk Brewing', fourSquareId: '4eb582a4e5e8743705159e38'},
        { title: 'Carson Park', fourSquareId: '4bd62e257b1876b0e42f8c86', defaultUrl:'https://northwoodsleague.com/eau-claire-express/team/ballpark/'}, // no good url's
        //{title: 'The District Company', fourSquareId: '51bb8cd0498e9ac0b653d06f'},
        //{ title: 'Eau Claire YMCA', fourSquareId: '4c4b6fa25609c9b6ae5b1d91'},
        { title: 'Eau Claire Children\'s Museum', fourSquareId: '4c5adf90d3aee21e65b76b55', defaultUrl:'http://www.childrensmuseumec.com'},
        { title: 'Acoustic Cafe', fourSquareId: '4b7c4b8ff964a520668a2fe3'},
        { title: 'Phoenix Park', fourSquareId: '4b9d6507f964a52082a936e3'},
        { title: 'Banbury Place', fourSquareId: '4c979e15f7cfa1cd9202d015'},
        { title: 'The Nucleus', fourSquareId: '4720b2dcf964a520c84b1fe3'}
        //{title: 'Dean & Sue\'s Bar & Grill', fourSquareId: '4e18dac5d1648b8348372829'}
    ];
    var largeInfowindow; 
    var mainViewModel;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:44.805463, lng: -91.506933},//Eau Claire WI
            zoom: 15,
            mapTypeControl: false
        });

        largeInfowindow = new google.maps.InfoWindow();

        mainViewModel = new MapViewModel(EauClaireLocations)
        ko.applyBindings(mainViewModel);
    }

// function MapViewModel(EauClaireLocations){
//     this.allLocations = EauClaireLocations;
//     this.searchString = ko.observable('');

//      //stack overflow with the code for filtering in knockout
//      //https://stackoverflow.com/questions/29551997/knockout-search-filter
//     this.filterPins = ko.computed(function () {
//         var search = this.searchString().toLowerCase();
//         return ko.utils.arrayFilter(this.allLocations, function (pin) {
//             return pin.title.toLowerCase().indexOf(search) >= 0;
//         });
//     }, this);

//     for(let i = 0; i < EauClaireLocations.length; i++){
//         var result = new EauClairePin(EauClaireLocations[i], i);
//     }

//     this.selectedImages = ko.observableArray([]);
//     showListings();


// }
function findPinById(id) { 
    return fruit.name === 'cherries';
}

class MapViewModel{
    constructor(EauClaireLocations){
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
    
        this.locations = [];
        for(let i = 0; i < EauClaireLocations.length; i++){
            this.locations.push(new EauClairePin(EauClaireLocations[i], i));
        }
    
        //this.selectedImages = ko.observableArray([]);

        this.selectedModel = this.locations[0];
        //this.selectedModel = ko.observable(this.locations[0]);
        this.selectedModelId = ko.observable(this.selectedModel.fourSquareId);

        this.selectedImages = ko.computed(function(){
            //var result = this.selectedModel().photos;
            //console.log(result);
            var id = this.selectedModelId();
            //console.log('on selected pin changed ' + id);

            var result = this.locations.find(function (loc,id2){
                return loc.fourSquareId === id;
            });
            console.log('result ' + result.photos);

            //return ['cheese', 'bread'];
            return result.photos;
            
        },this);
        showListings();
    }

    openInfoWindow(marker, clickedPin){
        if (largeInfowindow.marker != marker) {
            this.selectedModelId(clickedPin.fourSquareId);

            largeInfowindow.marker = marker;
            var content = `<div>
                                <div>${marker.title}</div>
                                <div> <a href="${this.selectedModel.url}">${this.selectedModel.url}</a></div>
                                <div><img src="${this.selectedModel.bestPhotoURL}"></div>
                                <div>pics:${this.selectedModel.numPics}</div>
                                <div>tips:${this.selectedModel.numTips}</div>
                            </div>`;

            // this.photos.forEach(function(pic){
            //     content = content + `<img src="${pic.prefix+"100x100"+pic.suffix}">`
            // });

            largeInfowindow.setContent(content);
            largeInfowindow.open(map, marker);

            largeInfowindow.addListener('closeclick', function() {
                largeInfowindow.marker = null;
            });
        }
    }
}

class EauClairePin{
    constructor(loc, index){
        this.self = this;
        this.title = loc.title;
        this.fourSquareId = loc.fourSquareId;
        this.index = index;
        this.getFourSquareData(this.fourSquareId, this.title, this.index);
    }

     openInfoWindow(marker){
        if (largeInfowindow.marker != marker) {
            
            largeInfowindow.marker = marker;
            var content = `<div>
                                <div>${marker.title}</div>
                                <div> <a href="${this.url}">${this.url}</a></div>
                                <div><img src="${this.bestPhotoURL}"></div>
                                <div>pics:${this.numPics}</div>
                                <div>tips:${this.numTips}</div>
                            </div>`;

            // this.photos.forEach(function(pic){
            //     content = content + `<img src="${pic.prefix+"100x100"+pic.suffix}">`
            // });

            largeInfowindow.setContent(content);
            largeInfowindow.open(map, marker);

            largeInfowindow.addListener('closeclick', function() {
                largeInfowindow.marker = null;
            });
        }
    }

    getFourSquareData(fourSquareId, title ,index){
        var url = 'https://api.foursquare.com/v2/venues/' + fourSquareId + '?client_id=H3U143RXVFSPJE0XYGV2C2LUTZLPJVX4O3D4XKEKINMVMORJ&client_secret=GD2SHFG2LB1KWLZ45PUWKHGQ3MAW102ML3CVLOJDGKJV2UHB&v=20170413';
        
        fetch(url)
        .then((data) => data.json())
        .then((result) => result.response.venue)
        .then((venue) => {
            this.url = venue.url;
            this.numPics = venue.photos.count;
            this.numTips = venue.tips.count;
            //this.photos = venue.photos.groups[0].items;
            var photoObjects = venue.photos.groups[0].items;
            var photoArray = [];
            photoObjects.forEach(function(photo){
                photoArray.push({imgUrl: photo.prefix + "100x100" + photo.suffix });
            });

            this.photos = photoArray;

            if(venue.bestPhoto){
                this.bestPhotoURL = venue.bestPhoto.prefix + "100x100" + venue.bestPhoto.suffix;
            }
            
            this.marker = new google.maps.Marker({
                position: venue.location,
                title: this.title,
                animation: google.maps.Animation.DROP,
                id: this.index
            });
            
            markers.push(this.marker);

            var pin = this;
            this.marker.addListener('click', function(){
                //pin.openInfoWindow(this);
                mainViewModel.openInfoWindow(this,pin);
            });
        
            this.marker.setMap(map);
        })
        .catch((err) => {
            alert(err);
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