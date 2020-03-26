const toastModule = require("nativescript-toast");
const timerModule = require("tns-core-modules/timer");
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GetModel = new GlobalModel([]);

var context, framePage; 

function fn(numb){
	return numb.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function fd(ts){
	var d = new Date(ts);

	var hours = d.getHours(),
		minutes = "0" + d.getMinutes(),
		seconds = "0" + d.getSeconds(),
		date = d.getDate(),
		month = d.getMonth()+1,
		year = d.getFullYear();

	var formattedTime = date + '/' + month + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}
 
function getAllData(){
    GetModel.global().then(function (result){
        if(result){
            if(result.length > 0){
            	var el = [];
            	for (var i = 0; i < result.length; i++) {
            		el.push({
            			OBJECTID : result[i].attributes.OBJECTID,
            			Country_Region : result[i].attributes.Country_Region,
            			Last_Update : fd(result[i].attributes.Last_Update),
            			Lat : result[i].attributes.Lat,
            			Long_ : result[i].attributes.Long_,
            			Confirmed : fn(result[i].attributes.Confirmed),
            			Deaths : fn(result[i].attributes.Deaths),
            			Recovered : fn(result[i].attributes.Recovered),
            			Active : fn(result[i].attributes.Active),
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
	gGlobal = context.items;

	var SearchBar = args.object;
    data_filter=[];    
    var ij = 0;
    for(var i in master_data){
        if(master_data[i].Country_Region.toLowerCase().indexOf(SearchBar.text)>-1){
            data_filter[ij]=master_data[i];
            ij++;
        }
    }
    context.set("items", data_filter);
};

exports.onClear = function(){
    if(gGlobal){
	   context.set("items", gGlobal);
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
}

exports.onLocal = function(){
	framePage.navigate({
        moduleName: "local/local-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
}