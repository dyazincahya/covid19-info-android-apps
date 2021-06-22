const timerModule = require("tns-core-modules/timer");
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage;

function fn(numb) {
    return numb.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function __getData() {
    GetModel.indonesia().then(function(result) {
        let el = [];
        for (var i = 0; i < result.length; i++) {
            let kasus_posi = result[i].attributes.Kasus_Posi;
            let kasus_meni = result[i].attributes.Kasus_Meni;
            let kasus_semb = result[i].attributes.Kasus_Semb;
            let kasus_akti = result[i].attributes.Kasus_Posi - (result[i].attributes.Kasus_Semb + result[i].attributes.Kasus_Meni);

            let All_Total = kasus_posi+kasus_meni+kasus_semb+kasus_akti;

            el.push({
                Index_Key: (i+1),
                FID: result[i].attributes.FID,
                Kode_Provi: result[i].attributes.Kode_Provi,
                Provinsi: result[i].attributes.Provinsi,
                Kasus_Posi: fn(kasus_posi),
                Kasus_Semb: fn(kasus_semb),
                Kasus_Meni: fn(kasus_meni),
                Kasus_akti: fn(kasus_akti),
                Kasus_Posi_pres: Math.round((kasus_posi/All_Total)*100),
                Kasus_Meni_pres: Math.round((kasus_meni/All_Total)*100),
                Kasus_Semb_pres: Math.round((kasus_semb/All_Total)*100),
                Kasus_akti_pres: Math.round((kasus_akti/All_Total)*100),
                All_Total: fn(All_Total)
            });
        }
        context.set("items", el);

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
    timerModule.setTimeout(function() {
        __getData();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onSubmit = function(args) {
    let master_data = context.items;

    var SearchBar = args.object;
    data_filter = [];
    var ij = 0;
    for (var i in master_data) {
        if (master_data[i].Provinsi.toLowerCase().indexOf(SearchBar.text) > -1) {
            data_filter[ij] = master_data[i];
            ij++;
        }
    }
    context.set("items", data_filter);
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