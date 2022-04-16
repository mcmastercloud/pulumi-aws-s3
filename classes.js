"use strict";
exports.__esModule = true;
exports.Attributes = exports.SubnetSettings = exports.Subnet = exports.Response = exports.SubnetType = void 0;
var SubnetType;
(function (SubnetType) {
    SubnetType[SubnetType["Private"] = 0] = "Private";
    SubnetType[SubnetType["Public"] = 1] = "Public";
})(SubnetType = exports.SubnetType || (exports.SubnetType = {}));
var Response = /** @class */ (function () {
    function Response() {
        this.AdditionalCidrs = [];
        this.Subnets = [];
    }
    return Response;
}());
exports.Response = Response;
var Subnet = /** @class */ (function () {
    function Subnet(init) {
        this.name = "";
        this.cidr = "";
        this.type = SubnetType.Private;
        Object.assign(this, init);
    }
    return Subnet;
}());
exports.Subnet = Subnet;
var SubnetSettings = /** @class */ (function () {
    function SubnetSettings(init) {
        this.cidr = "";
        this.subnets = [];
        this.count = 3;
        this.prefix = "";
        Object.assign(this, init);
    }
    SubnetSettings.prototype.mask = function () {
        return Number(this.cidr.split("/")[1]);
    };
    SubnetSettings.prototype.ip = function () {
        return this.cidr.split("/")[0];
    };
    return SubnetSettings;
}());
exports.SubnetSettings = SubnetSettings;
var Attributes = /** @class */ (function () {
    function Attributes(init) {
        this.cidr = [];
        this.name = "";
        this.autoSplit = false;
        this.privateSubnets = new SubnetSettings();
        this.publicSubnets = new SubnetSettings();
        Object.assign(this, init);
    }
    return Attributes;
}());
exports.Attributes = Attributes;
