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

function maxVal(arr){
	return Math.max.apply(null, arr);
}
 
function getAllData(){
    GetModel.global().then(function (result){
        if(result){
            if(result.length > 0){
            	var lastupdate = [],
            		lastupdate_id = "",
            		Confirmed = 0,
            		Deaths = 0,
            		Recovered = 0,
            		Active = 0;

            	for (var i = 0; i < result.length; i++) 
            	{
            		if(result[i].attributes.OBJECTID == 86){
            			lastupdate_id = result[i].attributes.Last_Update;
            		}

            		lastupdate.push(result[i].attributes.Last_Update);
            		Confirmed = Confirmed + parseInt(result[i].attributes.Confirmed);
            		Deaths = Deaths + parseInt(result[i].attributes.Deaths);
            		Recovered = Recovered + parseInt(result[i].attributes.Recovered);
            		Active = Active + parseInt(result[i].attributes.Active);
            	}

                context.set("lastupdate_id", fd(lastupdate_id));
                context.set("lastupdate", fd(maxVal(lastupdate)));
                context.set("confirmed", fn(Confirmed));
                context.set("deaths", fn(Deaths));
                context.set("recovered", fn(Recovered));
                context.set("active", fn(Active));
        		xLoading.hide();
            } else {
                defaultValue();
                xLoading.hide();
            }
        } else {
            defaultValue();
            xLoading.hide();
        }
        xLoading.hide();
    });
}

function getIndonesiaData(){
    GetModel.indonesia().then(function (result){
        if(result){
            if(result.length > 0){
                context.set("confirmed_id", fn(result[0].positif));
                context.set("deaths_id", fn(result[0].meninggal));
                context.set("recovered_id", fn(result[0].sembuh));
        		xLoading.hide();
            } else {
                defaultValue();
                xLoading.hide();
            }
        } else {
            defaultValue();
            xLoading.hide();
        }
        xLoading.hide();
    });
}

function defaultValue(){
	context.set("lastupdate", " loading... ");
    context.set("confirmed", " loading... ");
    context.set("deaths", " loading... ");
    context.set("recovered", " loading... ");
    context.set("active", " loading... ");

	context.set("lastupdate_id", " loading... ");
    context.set("confirmed_id", " loading... ");
    context.set("deaths_id", " loading... ");
    context.set("recovered_id", " loading... ");
}

exports.onLoaded = function(args) {
	const page = args.object;
    framePage = page.frame;
};

exports.onNavigatingTo = function(args) { 
    const page = args.object; 

    context = GetModel;

    defaultValue();

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function () {
        getAllData();
        getIndonesiaData();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onRefresh = function(){
	defaultValue();
	xLoading.show(gConfig.loadingOption);
	timerModule.setTimeout(function () {
        getAllData();
        getIndonesiaData();
    }, gConfig.timeloader);
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