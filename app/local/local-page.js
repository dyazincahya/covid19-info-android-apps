const timerModule = require("tns-core-modules/timer");
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage; 

function fn(numb){
	return numb.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
 
function getAllData(){
    GetModel.local().then(function (result){
        if(result){
            if(result.length > 0){
            	var el = [];
            	for (var i = 0; i < result.length; i++) {
            		el.push({
            			FID : result[i].attributes.FID,
            			Kode_Provi : result[i].attributes.Kode_Provi,
                        Provinsi : result[i].attributes.Provinsi,
                        Kasus_Posi : fn(result[i].attributes.Kasus_Posi),
                        Kasus_Semb : fn(result[i].attributes.Kasus_Semb),
                        Kasus_Meni : fn(result[i].attributes.Kasus_Meni),
                        Kasus_akti : fn(result[i].attributes.Kasus_Posi - (result[i].attributes.Kasus_Semb+result[i].attributes.Kasus_Meni))
            		});
            	}
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
    timerModule.setTimeout(function () {
        getAllData();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onSubmit = function(args){
	let master_data = context.items;
	gLocal = context.items;

	var SearchBar = args.object;
    data_filter=[];    
    var ij = 0;
    for(var i in master_data){
        if(master_data[i].Provinsi.toLowerCase().indexOf(SearchBar.text)>-1){
            data_filter[ij]=master_data[i];
            ij++;
        }
    }
    context.set("items", data_filter);
};

exports.onClear = function(){
    if(gLocal){
	   context.set("items", gLocal);
    }
};

exports.onRefresh = function(){
	xLoading.show(gConfig.loadingOption);
	getAllData();
};

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
