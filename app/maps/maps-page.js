var mapsModule = require("nativescript-google-maps-sdk");
const permissionsModule = require('nativescript-permissions');

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage, ndata, mapView = null;

function zoomLevelSetting(param) {
    switch (param.toUpperCase()) {
        case "ITALY":
            context.set("zoom", 10);
            break;
        case "ANDORRA":
            context.set("zoom", 10);
            break;
        case "HOLY SEE":
            context.set("zoom", 10);
            break;
    
        default:
            context.set("zoom", 6);
            break;
    }
}

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
        if(ndata.cn && ndata.lat && ndata.long){
            context.set("actionBarTitle", "now # " + ndata.cn.toUpperCase());
            context.set("latitude", ndata.lat);
            context.set("longitude", ndata.long);
            zoomLevelSetting(ndata.cn.toUpperCase());
        } else {
            context.set("actionBarTitle", "# INDONESIA");
            context.set("latitude", -4.144909999999999);
            context.set("longitude", 122.17460499999993);
            context.set("zoom", 5);
        }
    } else {
        context.set("actionBarTitle", "# INDONESIA");
        context.set("latitude", -4.144909999999999);
        context.set("longitude", 122.17460499999993);
        context.set("zoom", 5);
    }
    
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
        marker.positive = "Positive : " + gAllGlobal[i].Confirmed;
        marker.recovered = "Recovered : " + gAllGlobal[i].Recovered;
        marker.recovery = "Active : " + gAllGlobal[i].Active;
        marker.deaths = "Deaths : " + gAllGlobal[i].Deaths;
        // marker.color = "green";
        marker.userData = { index : i};
        mapView.addMarker(marker);
    }
}

function onMarkerSelect(args) {
    context.set("actionBarTitle", "# " + args.marker.title.toUpperCase());
}

function markerInfoWindowTapped(args) {
    framePage.navigate({
        moduleName: "global/global-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
}


exports.onLoaded = onLoaded;
exports.onMapReady = onMapReady;
exports.onMarkerSelect = onMarkerSelect;
exports.markerInfoWindowTapped = markerInfoWindowTapped;

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