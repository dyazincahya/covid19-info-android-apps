var mapsModule = require("nativescript-google-maps-sdk");
const permissionsModule = require('nativescript-permissions');

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage, ndata, mapView = null;


function onLoaded(args) {
    const page = args.object; 
    framePage = page.frame;
    context = GetModel;

    permissionsModule.requestPermission([
        android.Manifest.permission.ACCESS_FINE_LOCATION, 
        android.Manifest.permission.ACCESS_COARSE_LOCATION
    ], "I need these permissions because I'm cool").then( () => {
        console.log("Woo Hoo, I have the power!");
    }).catch( () => {
        console.log("Uh oh, no permissions - plan B time!");
    });

    if(page.navigationContext){
        ndata = page.navigationContext;
        if(ndata.lat && ndata.long){
            context.set("latitude", ndata.lat);
            context.set("longitude", ndata.long);
        } else {
            context.set("latitude", -4.144909999999999);
            context.set("longitude", 122.17460499999993);
        }
    } else {
        context.set("latitude", -4.144909999999999);
        context.set("longitude", 122.17460499999993);
    }
    
    context.set("zoom", 5);
    context.set("minZoom", 0);
    context.set("maxZoom", 22);
    context.set("bearing", 360);
    context.set("tilt", 35);
    context.set("padding", [80, 40, 40, 40]);
    context.set("mapAnimationsEnabled", true);

    page.bindingContext = context;
}

function onMapReady(args) {
    mapView = args.object;

    mapView.myLocationEnabled = true;

    mapView.settings.compassEnabled = true;
    mapView.settings.indoorLevelPickerEnabled = true;
    mapView.settings.mapToolbarEnabled = true;
    mapView.settings.myLocationButtonEnabled = true;
    mapView.settings.rotateGesturesEnabled = true;
    mapView.settings.scrollGesturesEnabled = true;
    mapView.settings.tiltGesturesEnabled = true;
    mapView.settings.zoomGesturesEnabled = true;
    mapView.settings.zoomControlsEnabled = true;

    for (var i = 0; i < gAllGlobal.length; i++) {
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(gAllGlobal[i].Lat, gAllGlobal[i].Long_);
        marker.title = gAllGlobal[i].Country_Region;
        marker.snippet = gAllGlobal[i].Total + " case";
        marker.positive = "Positive : " + gAllGlobal[i].Confirmed;
        marker.recovered = "Recovered : " + gAllGlobal[i].Recovered;
        marker.recovery = "Recovery : " + gAllGlobal[i].Active;
        marker.deaths = "Deaths : " + gAllGlobal[i].Deaths;
        // marker.color = "green";
        marker.userData = { index : i};
        mapView.addMarker(marker);
    }
}

function onCoordinateTapped(args) {
    console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
}

function onMarkerEvent(args) {
   console.log("Marker Event: '" + args.eventName
                + "' triggered on: " + args.marker.title
                + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
}

var lastCamera = null;
function onCameraChanged(args) {
    console.log("Camera changed: "+JSON.stringify(args.camera), JSON.stringify(args.camera) === lastCamera);
    lastCamera = JSON.stringify(args.camera);
    var bounds = mapView.projection.visibleRegion.bounds;
    console.log("Current bounds: " + JSON.stringify({
          southwest: [bounds.southwest.latitude, bounds.southwest.longitude],
          northeast: [bounds.northeast.latitude, bounds.northeast.longitude]
        }));
}

function onCameraMove(args) {
    console.log("Camera moving: "+JSON.stringify(args.camera));
}

function onIndoorBuildingFocused(args) {
    console.log("Building focus changed: " + JSON.stringify(args.indoorBuilding));
}

function onIndoorLevelActivated(args) {
    console.log("Indoor level changed: " + JSON.stringify(args.activateLevel)); 
}

exports.onLoaded = onLoaded;
exports.onMapReady = onMapReady;
exports.onCoordinateTapped = onCoordinateTapped;
exports.onMarkerEvent = onMarkerEvent;
exports.onCameraChanged = onCameraChanged;
exports.onCameraMove = onCameraMove;
exports.onIndoorBuildingFocused = onIndoorBuildingFocused;
exports.onIndoorLevelActivated = onIndoorLevelActivated;

exports.onBoard = function(){
    framePage.navigate({
        moduleName: "home/home-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};

exports.onGlobal = function(){
    framePage.navigate({
        moduleName: "global/global-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};

exports.onLocal = function(){
    framePage.navigate({
        moduleName: "local/local-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};