const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const httpModule        = require("tns-core-modules/http");

function xViewModel(items) {
    var viewModel = new ObservableArray(items);

    viewModel.global = function (data={}) { 
        return httpModule.request({
            url: gUrl,
            method: "GET"
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.local = function (data={}) { 
        return httpModule.request({
            url: gUrl + "indonesia/provinsi",
            method: "GET"
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.indonesia = function (data={}) { 
        return httpModule.request({
            url: gUrl + "indonesia",
            method: "GET"
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    return viewModel;
}

module.exports = xViewModel;
