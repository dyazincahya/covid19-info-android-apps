const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const httpModule        = require("tns-core-modules/http");

function xViewModel(items) {
    var viewModel = new ObservableArray(items);

    viewModel.global = function () { 
        return httpModule.request({
            url: gUrl,
            method: "GET"
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.indonesia = function () { 
        return httpModule.request({
            url: gUrl + "indonesia/provinsi/",
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
