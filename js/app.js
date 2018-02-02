  var EauClaireLocations = [
        { title: 'Banbury Place', fourSquareId: '4c979e15f7cfa1cd9202d015', defaultUrl:'http://www.banbury.com/'},
        { title: 'Lazy Monk Brewing', fourSquareId: '4eb582a4e5e8743705159e38'},
        { title: 'Phoenix Park', fourSquareId: '4b9d6507f964a52082a936e3' , defaultUrl:'https://www.visiteauclaire.com/listings/phoenix-park/1898/'},
        { title: 'The Informalist', fourSquareId: '57229631cd1010835c5139a0', defaultUrl: 'http://theinformalist.com'},
        { title: 'Eau Claire Children\'s Museum', fourSquareId: '4c5adf90d3aee21e65b76b55', defaultUrl:'http://www.childrensmuseumec.com'},
        { title: 'Acoustic Cafe', fourSquareId: '4b7c4b8ff964a520668a2fe3'},
        { title: 'Carson Park', fourSquareId: '4bd62e257b1876b0e42f8c86', defaultUrl:'https://www.visiteauclaire.com/things-to-do/outdoors/parks/carson/'}, 
        { title: 'The Nucleus', fourSquareId: '4720b2dcf964a520c84b1fe3'},
        { title: 'UW-Eau Claire', fourSquareId: '4d7e7bb795c1a143f65dd2f2'},
    ];
    var largeInfowindow; 
    var mainViewModel;
    var map;
    // Create a new blank array for all the listing markers.
    var markers = [];

    function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:44.805463, lng: -91.506933},//Eau Claire WI
            zoom: 15,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        largeInfowindow = new google.maps.InfoWindow();

        mainViewModel = new MapViewModel(EauClaireLocations);
        ko.applyBindings(mainViewModel);
    }

    function setMapStyle(style){
        map.setOptions({styles:style});
    }

    function onGoogleMapsError(){
        console.log('error loading google maps, check url in index.html');
        alert('There was an error loading google maps. Sorry for the inconvenience.');
    }

class MapViewModel{

    constructor(EauClaireLocations){
        this.locations = [];
        EauClaireLocations.forEach(function(loc){
            this.locations.push(new EauClairePin(loc));
        },this);

        //compute filtered list on left side each time the search string changes
        //https://stackoverflow.com/questions/29551997/knockout-search-filter
        this.searchString = ko.observable('');
        this.filterPins = ko.computed(function () {
            var search = this.searchString().toLowerCase();
            
            return  ko.utils.arrayFilter(this.locations, function (pin) {
                var matchesSearch = pin.title.toLowerCase().indexOf(search) >= 0;
                pin.setMapPin(matchesSearch);
                return matchesSearch;
            });
        }, this);

        this.selectedModel = this.locations[0];
        this.selectedModelId = ko.observable(this.selectedModel.fourSquareId);

        this.SelectedStyle = ko.observable();

        this.SelectedStyle.subscribe(function(newStyle){
            setMapStyle(newStyle.style);
        });

        this.selectedModelId('');
        //when selected pin changes then change the images showing on side.
        this.selectedImages = ko.computed(function(){
            var id = this.selectedModelId();
            if(id){
                var result = this.locations.find(function (loc,id2){
                    return loc.fourSquareId === id;
                });
                this.selectedModel = result;
                return result.photos;
            }
        },this);

        this.showSideBar = ko.observable(true);
    }

    toggleSidebar(){
        this.showSideBar(!this.showSideBar());

        //make sure map resizes when flyout menu hides
        setTimeout((function() {
            google.maps.event.trigger(map, "resize");
        }), 505);
        
    }

    openInfoWindow(marker, clickedPin){
         //if not already showing this marker
         if (largeInfowindow.marker != marker) {
            
            //unselect previous marker
            this.selectedModel.marker.setIcon('img/red pin.png');
            this.selectedModel.isSelected(false);

            //this triggers knockout computed images property to update
            this.selectedModelId(clickedPin.fourSquareId);

            largeInfowindow.marker = marker;
            largeInfowindow.setContent(clickedPin.infoWindowContent);
            largeInfowindow.open(map, marker);

            largeInfowindow.addListener('closeclick', function() {
                largeInfowindow.marker = null;
            });
            
            marker.setAnimation(google.maps.Animation.BOUNCE);
            marker.setIcon('img/green pin.png');
            clickedPin.isSelected(true);

            //stop bouncing after 1.4 seconds (about 2 bounces)
            setTimeout((function() {
                this.setAnimation(null);
            }).bind(marker), 1400);
        }
    }
}

class EauClairePin{
    constructor(loc){
        this.title = loc.title;
        this.defaultUrl = loc.defaultUrl;
        this.fourSquareId = loc.fourSquareId;
        this.getFourSquareData(this.fourSquareId, this.title);
        this.isSelected = ko.observable(false);
    }

    //the next 3 functions are list item events
    onClick(){
        mainViewModel.openInfoWindow(this.marker, this);
    }

    onHoverOver(){
        this.setIconIfValid('img/light green.png');
    }

    onMouseOut(){
        this.setIconIfValid('img/red pin.png');
    }

    setIconIfValid(icon){
        //only set icon if is loaded already and don't change the selected icon from green
        if(this.marker && this.fourSquareId !== mainViewModel.selectedModelId()){
            this.marker.setIcon(icon);
        }
    }

    setMapPin(pinOnMap){
        if(this.marker){
            this.marker.setMap((pinOnMap ? map : null));
        }
    }

    getFourSquareData(fourSquareId, title ){
        var url = 'https://api.foursquare.com/v2/venues/' + fourSquareId + '?client_id=H3U143RXVFSPJE0XYGV2C2LUTZLPJVX4O3D4XKEKINMVMORJ&client_secret=GD2SHFG2LB1KWLZ45PUWKHGQ3MAW102ML3CVLOJDGKJV2UHB&v=20170413';
        
        fetch(url)
        .then((data) => data.json())
        .then((result) => result.response.venue)
        .then((venue) => {
            
            var photoObjects = venue.photos.groups[0].items;
            var photoArray = [];
            photoObjects.forEach(function(photo){
                photoArray.push({imgUrl: photo.prefix + "300x300" + photo.suffix });
            });

            this.photos = photoArray;
            this.location = venue.location;

            if(venue.bestPhoto){
                this.bestPhotoURL = venue.bestPhoto.prefix + "100x100" + venue.bestPhoto.suffix;
            }

            //some places like parks didn't have websites registered with foursquare so fall back to defaultUrl
            var url = venue.url ? venue.url : this.defaultUrl;

            //no good way to bind the google maps infowindow so cheating on mvvm by hardcoding view.
            this.infoWindowContent =  `<div style="max-width:360px;">
                                            <h3 class="venue-name">${venue.name}</h3>
                                            <div class="info-window">
                                                <div>
                                                    <img class="info-image" src="${this.bestPhotoURL}">
                                                </div>
                                                <div class="venue-data">
                                                    <div class="location-website"> <a href="${url}">${url}</a></div>
                                                    <div>${venue.location.formattedAddress[0]}</div>
                                                    <div>${venue.location.formattedAddress[1]}</div>
                                                    <div>${venue.location.formattedAddress[2]}</div>
                                                </div>
                                            </div>
                                        </div>`;
            
            this.marker = new google.maps.Marker({
                position: venue.location,
                title: this.title,
                icon: 'img/red pin.png',
                animation: google.maps.Animation.DROP,//drop in initially, animation is switched to bounce later
            });
            
            markers.push(this.marker);

            var pin = this;//capturing the EauClairePin Model so can pass to openInfoWIndow function

            this.marker.addListener('click', function(){
                mainViewModel.openInfoWindow(this, pin);
            });

            //setMap makes the marker show up on the map
            this.marker.setMap(map);
        })
        .catch((err) => {
            alert("There was an error loading data from Four Square for " + this.title);
        });
    }
}