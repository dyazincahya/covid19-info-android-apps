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

    context.set("selectedIndex", 0);
    page.bindingContext = context;
};

exports.setSelectedTab = function(val) {
    context.set("selectedIndex", val);
};