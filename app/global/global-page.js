const timerModule = require("tns-core-modules/timer");
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage;

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

function fetchAllData() {
    GetModel.global().then(function(result) {
        if (result) {
            if (result.length > 0) {
                var el = [];
                for (var i = 0; i < result.length; i++) {
                    var data_country;
                    if (result[i].attributes.Country_Region.toUpperCase() == "INDONESIA") {
                        data_country = {
                            OBJECTID: result[i].attributes.OBJECTID,
                            Country_Region: result[i].attributes.Country_Region,
                            Last_Update: fd(result[i].attributes.Last_Update),
                            Lat: -4.144909999999999,
                            Long_: 122.17460499999993,
                            Confirmed: fn(result[i].attributes.Confirmed),
                            Deaths: fn(result[i].attributes.Deaths),
                            Recovered: fn(result[i].attributes.Recovered),
                            Active: fn(result[i].attributes.Active)
                        };
                    } else {
                        data_country = {
                            OBJECTID: result[i].attributes.OBJECTID,
                            Country_Region: result[i].attributes.Country_Region,
                            Last_Update: fd(result[i].attributes.Last_Update),
                            Lat: result[i].attributes.Lat,
                            Long_: result[i].attributes.Long_,
                            Confirmed: fn(result[i].attributes.Confirmed),
                            Deaths: fn(result[i].attributes.Deaths),
                            Recovered: fn(result[i].attributes.Recovered),
                            Active: fn(result[i].attributes.Active)
                        };
                    }
                    el.push(data_country);
                }
                gAllGlobal = el;
                context.set("items", el);
                xLoading.hide();
            } else {
                context.set("items", []);
            }
        } else {
            context.set("items", []);
        }
        xLoading.hide();
    });
}

function getAllData() {
    timerModule.setTimeout(function() {
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
        context.set("items", el);
        xLoading.hide();
    }, gConfig.timeloader + 900);
}

exports.onLoaded = function(args) {
    const page = args.object;
    framePage = page.frame;

    const searchbar = page.getViewById('searchBar');
    if (searchbar.android) {
        searchbar.android.setFocusable(false);
        searchbar.android.clearFocus();
    }
};

exports.onNavigatingTo = function(args) {
    const page = args.object;

    context = GetModel;

    xLoading.show(gConfig.loadingOption);
    getAllData()

    page.bindingContext = context;
};

exports.onSubmit = function(args) {
    let master_data = context.items;
    gGlobal = context.items;

    var SearchBar = args.object;
    data_filter = [];
    var ij = 0;
    for (var i in master_data) {
        if (master_data[i].Country_Region.toLowerCase().indexOf(SearchBar.text) > -1) {
            data_filter[ij] = master_data[i];
            ij++;
        }
    }
    context.set("items", data_filter);
};

exports.onClear = function() {
    if (gGlobal) {
        context.set("items", gGlobal);
    }
};

exports.onItemTap = function(args) {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;

    framePage.navigate({
        moduleName: "maps/maps-page",
        animated: true,
        context: { cn: itemTapData.Country_Region, lat: itemTapData.Lat, long: itemTapData.Long_ },
        transition: {
            name: "fade"
        }
    });
};