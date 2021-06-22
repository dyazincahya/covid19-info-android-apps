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


function __getData() {
    GetModel.global().then(function(result) {
        let el = [];
        for (var i = 0; i < result.length; i++) {
            let confirmed = result[i].attributes.Confirmed;
            let deaths = result[i].attributes.Deaths;
            let recovered = result[i].attributes.Recovered;
            let active = result[i].attributes.Active;

            let All_Total = confirmed+deaths+recovered+active;

            el.push({
                Index_Key: (i+1),
                OBJECTID: result[i].attributes.OBJECTID,
                Country_Region: result[i].attributes.Country_Region,
                Last_Update: fd(result[i].attributes.Last_Update),
                Lat: result[i].attributes.Lat,
                Long_: result[i].attributes.Long_,
                Confirmed: fn(confirmed),
                Deaths: fn(deaths),
                Recovered: fn(recovered),
                Active: fn(active),
                Confirmed_pres: Math.round((confirmed/All_Total)*100),
                Deaths_pres: Math.round((deaths/All_Total)*100),
                Recovered_pres: Math.round((recovered/All_Total)*100),
                Active_pres: Math.round((active/All_Total)*100),
                All_Total: fn(All_Total)
            });
        }
        context.set("items", el);
        context.set("lastupdate", fd(result[0].attributes.Last_Update));

        xLoading.hide();
    });
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
    __getData()

    page.bindingContext = context;
};

exports.onSubmit = function(args) {
    let master_data = context.items;

    var SearchBar = args.object;
    data_filter = [];
    var ij = 0;
    for (var i in master_data) {
        if (master_data[i].Country_Region.toLowerCase().indexOf(SearchBar.text) > -1) {
            data_filter[ij] = master_data[i];
            ij++;
        }
    }

    if(data_filter.length > 0){
        context.set("items", data_filter);
    } else {
        context.set("items", false);
    }
};

exports.onClear = function() {
    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        __getData();
    }, gConfig.timeloader);
};

exports.onRefresh = function() {
    xLoading.show(gConfig.fetchingOption);
    timerModule.setTimeout(function() {
        __getData();
    }, gConfig.timeloader);
};