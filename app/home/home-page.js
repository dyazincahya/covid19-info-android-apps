const timerModule = require("tns-core-modules/timer");
const permissionsModule = require('nativescript-permissions');
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const appSettings = require("tns-core-modules/application-settings");

const lsa = require('../localstorage_array');

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage;

function isNum(angka) {
    if (Number.isInteger(angka)) {
        return angka;
    } else { return "0"; }
}

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

function maxVal(arr) {
    return Math.max.apply(null, arr);
}

function getAllData() {
    GetModel.global().then(function(result) {
        lsa.drop();

        timerModule.setTimeout(function() {
            xLoading.hide();
            lsa.insert(result);
            prosesDataGlobal();
            // prosesDataLocal();
        }, 740);

    });
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

function aaaa(aa){
    var abc = JSON.stringify(a)
}

function prosesDataGlobal() {
    const result = lsa.get();
    console.log((JSON.parse(appSettings.getString("lsakc")))); 
    console.log(result.data[0].attributes); 
    /* if (result.success) {
        if (result.data.length > 0) {
            var lastupdate = [],
                Confirmed = 0,
                Deaths = 0,
                Recovered = 0,
                Active = 0;

            for (var i = 0; i < result.data.length; i++) {
                lastupdate.push(result[i].attributes.Last_Update);
                Confirmed = Confirmed + parseInt(isNum(result.data[i].attributes.Confirmed));
                Deaths = Deaths + parseInt(isNum(result.data[i].attributes.Deaths));
                Recovered = Recovered + parseInt(isNum(result.data[i].attributes.Recovered));
                Active = Active + parseInt(isNum(result.data[i].attributes.Active));
            }

            context.set("lastupdate", fd(maxVal(lastupdate)));
            context.set("confirmed", fn(Confirmed));
            context.set("deaths", fn(Deaths));
            context.set("recovered", fn(Recovered));
            context.set("active", fn(Active));
            xLoading.hide();
        } else {
            failValue();
            xLoading.hide();
        }
    } else {
        failValue();
        xLoading.hide();
    } */
}

function prosesDataLocal() {
    const result = lsa.get();
    if (result.success) {
        if (result.data.length > 0) {
            var lastupdate_id = "",
                Confirmed_id = 0,
                Deaths_id = 0,
                Recovered_id = 0,
                Active_id = 0,
                lastupdate_id = "";

            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].attributes.Country_Region.toUpperCase() == "INDONESIA") {
                    lastupdate_id = result.data[i].attributes.Last_Update;
                    Confirmed_id = result.data[i].attributes.Confirmed;
                    Deaths_id = result.data[i].attributes.Deaths;
                    Recovered_id = result.data[i].attributes.Recovered;
                    Active_id = result.data[i].attributes.Active;
                }
            }

            context.set("lastupdate_id", fd(lastupdate_id));
            context.set("confirmed_id", fn(Confirmed_id));
            context.set("deaths_id", fn(Deaths_id));
            context.set("recovered_id", fn(Recovered_id));
            context.set("active_id", fn(Active_id));

            xLoading.hide(); 
        } else {
            failValue();
            xLoading.hide();
        }
    } else {
        failValue();
        xLoading.hide();
    }
}

function failValue() {
    context.set("lastupdate", " 0 ");
    context.set("confirmed", " 0 ");
    context.set("deaths", " 0 ");
    context.set("recovered", " 0 ");
    context.set("active", " 0 ");

    context.set("lastupdate_id", " 0 ");
    context.set("confirmed_id", " 0 ");
    context.set("deaths_id", " 0 ");
    context.set("recovered_id", " 0 ");
    context.set("active_id", " 0 ");
}

function defaultValue() {
    context.set("lastupdate", " loading... ");
    context.set("confirmed", " loading... ");
    context.set("deaths", " loading... ");
    context.set("recovered", " loading... ");
    context.set("active", " loading... ");

    context.set("lastupdate_id", " loading... ");
    context.set("confirmed_id", " loading... ");
    context.set("deaths_id", " loading... ");
    context.set("recovered_id", " loading... ");
    context.set("active_id", " loading... ");
}

exports.onLoaded = function(args) {
    const page = args.object;
    framePage = page.frame;

    permissionsModule.requestPermission([
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION
    ], "I need these permissions because I'm cool").then(() => {
        console.log("Woo Hoo, I have the power!");
    }).catch(() => {
        console.log("Uh oh, no permissions - plan B time!");
    });
};

exports.onNavigatingTo = function(args) {
    const page = args.object;

    context = GetModel;

    defaultValue();

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        getAllData();
    }, 500);

    page.bindingContext = context;
};

exports.onRefresh = function() {
    defaultValue();
    xLoading.show(gConfig.fetchingOption);
    timerModule.setTimeout(function() {
        getAllData();
    }, gConfig.timeloader);
};