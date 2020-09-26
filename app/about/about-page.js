const GlobalModel = require("../global-model");
const GModel = new GlobalModel([]);

let context;
let framePage;

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

    page.bindingContext = context;
};