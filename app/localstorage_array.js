const appSettings = require("tns-core-modules/application-settings");

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

exports.get = function(index=null, distinct=false, xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success"   : false,
            "message"   : "Data not found!",
            "data"      : []
        };
    } else {
        const arrData = JSON.parse(appSettings.getString(xkey));
        if(index == null){
            if(arrData.length != 0){                
                if(distinct === true){
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : multiDimensionalUnique(arrData)
                    };
                } else {
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : arrData
                    };
                }
            } else {
                return {
                    "success"   : false,
                    "message"   : "Data not found!",
                    "data"      : []
                };
            }
        } else {
            if ( tmpdata[index] !== void 0 ) {
                if(distinct){
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : multiDimensionalUnique(arrData)[index]
                    };
                } else {
                    return {
                        "success"   : true,
                        "message"   : "Data found.",
                        "data"      : arrData[index]
                    };
                }
            } else {
                return {
                    "success"   : false,
                    "message"   : "Index not found!",
                    "data"      : []
                };
            }
        }        
    }
};
 
exports.insert = function(data=[], xkey="lsakc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        if(!appSettings.hasKey(xkey)){
            let tmp = [];
            tmp.push(data);
            appSettings.setString(xkey, JSON.stringify(tmp));

            return {
                "success"   : true,
                "message"   : "Data has been inserted!",
                "data"      : data
            };
        } else {
            if(Array.isArray(data)){
                let extractdata = JSON.parse(appSettings.getString(xkey));

                let ma = data.concat(extractdata);
                appSettings.remove(xkey);            
                appSettings.setString(xkey, JSON.stringify(ma)); 
            } else {
                let tmpdata = [];
                let extractdata = JSON.parse(appSettings.getString(xkey));
                tmpdata.push(data);

                let ma = tmpdata.concat(extractdata);
                appSettings.remove(xkey);            
                appSettings.setString(xkey, JSON.stringify(ma));   
            }

            return {
                "success"   : true,
                "message"   : "Data has been inserted.",
                "data"      : data
            };
        }
    }
};

exports.update = function(data=[], index=0, xkey="lsakc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];

            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                } else {
                    newdata.push(data);
                }           
            }

            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));
            
            return {
                "success"   : true,
                "message"   : "Data has been updated.",
                "data"      : data
            };
        } else {
            return {
                "success"   : false,
                "message"   : "Index not found!",
                "data"      : data
            };
        }
    }
};

exports.delete = function(index=0, xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Database not found!"
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];
            
            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                }            
            }
            
            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));

            return {
                "success" : true,
                "message" : "Data has been deleted."
            };
        } else {
            return {
                "success" : false,
                "message" : "Index not found!"
            };
        }
    }
};

exports.drop = function(xkey="lsakc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Storage not found!"
        };
    } else {
        appSettings.remove(xkey);
        
        return {
            "success" : true,
            "message" : "Storage has been dropped."
        };
    }
};