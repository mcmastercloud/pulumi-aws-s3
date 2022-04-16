"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubnetType;
(function (SubnetType) {
    SubnetType[SubnetType["Private"] = 0] = "Private";
    SubnetType[SubnetType["Public"] = 1] = "Public";
})(SubnetType = exports.SubnetType || (exports.SubnetType = {}));
class Response {
    constructor() {
        this.AdditionalCidrs = [];
        this.Subnets = [];
    }
}
exports.Response = Response;
class Subnet {
    constructor(init) {
        this.name = "";
        this.cidr = "";
        this.type = SubnetType.Private;
        Object.assign(this, init);
    }
}
exports.Subnet = Subnet;
class SubnetSettings {
    constructor(init) {
        this.cidr = "";
        this.subnets = [];
        this.count = 3;
        this.prefix = "";
        Object.assign(this, init);
    }
    mask() {
        return Number(this.cidr.split("/")[1]);
    }
    ip() {
        return this.cidr.split("/")[0];
    }
}
exports.SubnetSettings = SubnetSettings;
class Attributes {
    constructor(init) {
        this.cidr = [];
        this.name = "";
        this.autoSplit = false;
        this.privateSubnets = new SubnetSettings();
        this.publicSubnets = new SubnetSettings();
        Object.assign(this, init);
    }
}
exports.Attributes = Attributes;
//# sourceMappingURL=classes.js.map