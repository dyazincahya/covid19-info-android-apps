const timerModule = require("tns-core-modules/timer");
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

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

function __getData() {
    GetModel.global().then(function(result) {
        ___grobalData(result);
        ___localData(result);
    });
}

function ___grobalData(data) {
    const result = data;
    if (result.length > 0) {
        let Confirmed = 0,
            Deaths = 0,
            Recovered = 0,
            Active = 0;

        for (let i = 0; i < result.length; i++) {
            Confirmed = Confirmed + parseInt(isNum(result[i].attributes.Confirmed));
            Deaths = Deaths + parseInt(isNum(result[i].attributes.Deaths));
            Recovered = Recovered + parseInt(isNum(result[i].attributes.Recovered));
            Active = Active + parseInt(isNum(result[i].attributes.Active));
        }

        context.set("confirmed", fn(Confirmed));
        context.set("deaths", fn(Deaths));
        context.set("recovered", fn(Recovered));
        context.set("active", fn(Active));
        
        let All_total = Confirmed+Deaths+Recovered+Active;

        let Confirmed_pres = (Confirmed/All_total)*100;
        let Deaths_pres = (Deaths/All_total)*100;
        let Recovered_pres = (Recovered/All_total)*100;
        let Active_pres = (Active/All_total)*100;

        context.set("confirmed_pres", Math.round(Confirmed_pres));
        context.set("deaths_pres", Math.round(Deaths_pres));
        context.set("recovered_pres", Math.round(Recovered_pres));
        context.set("active_pres", Math.round(Active_pres));

        context.set("all_total", fn(All_total));


        xLoading.hide();
    } else {
        failValue();
        xLoading.hide();
    }
}

function ___localData(data) {
    const result = data
    if (result.length > 0) {
        let lastupdate = "",
            Confirmed_id = 0,
            Deaths_id = 0,
            Recovered_id = 0,
            Active_id = 0;

        for (let i = 0; i < result.length; i++) {
            if (result[i].attributes.Country_Region.toUpperCase() == "INDONESIA") {
                lastupdate = result[i].attributes.Last_Update;
                Confirmed_id = parseInt(isNum(result[i].attributes.Confirmed));
                Deaths_id = parseInt(isNum(result[i].attributes.Deaths));
                Recovered_id = parseInt(isNum(result[i].attributes.Recovered));
                Active_id = parseInt(isNum(result[i].attributes.Active));
            }
        }

        context.set("lastupdate", fd(lastupdate));

        context.set("confirmed_id", fn(Confirmed_id));
        context.set("deaths_id", fn(Deaths_id));
        context.set("recovered_id", fn(Recovered_id));
        context.set("active_id", fn(Active_id));

        let All_total_id = Confirmed_id+Deaths_id+Recovered_id+Active_id;

        let Confirmed_pres_id = (Confirmed_id/All_total_id)*100;
        let Deaths_pres_id = (Deaths_id/All_total_id)*100;
        let Recovered_pres_id = (Recovered_id/All_total_id)*100;
        let Active_pres_id = (Active_id/All_total_id)*100;

        context.set("confirmed_pres_id", Math.round(Confirmed_pres_id));
        context.set("deaths_pres_id", Math.round(Deaths_pres_id));
        context.set("recovered_pres_id", Math.round(Recovered_pres_id));
        context.set("active_pres_id", Math.round(Active_pres_id));

        context.set("all_total_id", fn(All_total_id));

        xLoading.hide(); 
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

    context.set("confirmed_pres", "0");
    context.set("deaths_pres", "0");
    context.set("recovered_pres", "0");
    context.set("active_pres", "0");

    context.set("all_total", "0");

    context.set("confirmed_id", " 0 ");
    context.set("deaths_id", " 0 ");
    context.set("recovered_id", " 0 ");
    context.set("active_id", " 0 ");

    context.set("confirmed_pres_id", "0");
    context.set("deaths_pres_id", "0");
    context.set("recovered_pres_id", "0");
    context.set("active_pres_id", "0");

    context.set("all_total_id", "0");
}

function defaultValue() {
    context.set("lastupdate", " loading... ");

    context.set("confirmed", " loading... ");
    context.set("deaths", " loading... ");
    context.set("recovered", " loading... ");
    context.set("active", " loading... ");

    context.set("confirmed_pres", "0");
    context.set("deaths_pres", "0");
    context.set("recovered_pres", "0");
    context.set("active_pres", "0");

    context.set("all_total", "loading... ");

    context.set("confirmed_id", " loading... ");
    context.set("deaths_id", " loading... ");
    context.set("recovered_id", " loading... ");
    context.set("active_id", " loading... ");

    context.set("confirmed_pres_id", "0");
    context.set("deaths_pres_id", "0");
    context.set("recovered_pres_id", "0");
    context.set("active_pres_id", "0");

    context.set("all_total_id", "loading... ");
}

exports.onLoaded = function(args) {
    const page = args.object;
    framePage = page.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object;

    context = GetModel;

    defaultValue();

    xLoading.show(gConfig.fetchingOption);
    timerModule.setTimeout(function() {
        __getData();
    }, 100);

    page.bindingContext = context;
};

exports.onRefresh = function() {
    defaultValue();
    xLoading.show(gConfig.fetchingOption);
    timerModule.setTimeout(function() {
        __getData();
    }, gConfig.timeloader);
};