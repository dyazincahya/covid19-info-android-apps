var mapsModule = require("nativescript-google-maps-sdk");
const permissionsModule = require('nativescript-permissions');

const rootBottom = require("../bottom/bottom-page");
const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage, ndata, mapView = null;

function fn(numb) {
    if (Number.isInteger(numb)) {
        return numb.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    } else { return "0"; }
}

function fd(ts) {
    var d = new Date(ts);

    var hours = d.getHours(),
        minutes = "0" + d.getMinutes(),
        seconds = "0" + d.getSeconds(),
        date = d.getDate(),
        month = d.getMonth() + 1,
        year = d.getFullYear();

    var formattedTime = date + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}

function getAllData() {
    let result = gAllGlobal,
        el = [];
    for (var i = 0; i < result.length; i++) {
        el.push({
            OBJECTID: result[i].attributes.OBJECTID,
            Country_Region: result[i].attributes.Country_Region,
            Last_Update: fd(result[i].attributes.Last_Update),
            Lat: result[i].attributes.Lat,
            Long_: result[i].attributes.Long_,
            Confirmed: fn(result[i].attributes.Confirmed),
            Deaths: fn(result[i].attributes.Deaths),
            Recovered: fn(result[i].attributes.Recovered),
            Active: fn(result[i].attributes.Active)
        });
    }
    context.set("AD", el);
}

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
    ], "I need these permissions because I'm cool").then(() => {
        console.log("Woo Hoo, I have the power!");
    }).catch(() => {
        console.log("Uh oh, no permissions - plan B time!");
    });

    if (page.navigationContext) {
        ndata = page.navigationContext;
        if (ndata.cn != "" && ndata.lat != "" && ndata.long != "") {
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

    getAllData();

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

    let dm = context.AD;
    for (var i = 0; i < dm.length; i++) {
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(dm[i].Lat, dm[i].Long_);
        marker.title = dm[i].Country_Region;
        marker.positive = "Positive : " + dm[i].Confirmed;
        marker.recovered = "Recovered : " + dm[i].Recovered;
        marker.recovery = "Active : " + dm[i].Active;
        marker.deaths = "Deaths : " + dm[i].Deaths;
        // marker.color = "green";
        marker.userData = { index: i };
        mapView.addMarker(marker);
    }
}

function onMarkerSelect(args) {
    context.set("actionBarTitle", "# " + args.marker.title.toUpperCase());
}

function markerInfoWindowTapped() {
    rootBottom.setSelectedTab(1);
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

exports.onBoard = function() {
    framePage.navigate({
        moduleName: "home/home-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};

exports.onGlobal = function() {
    framePage.navigate({
        moduleName: "global/global-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};

exports.onLocal = function() {
    framePage.navigate({
        moduleName: "local/local-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};