"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.createVpc = void 0;
// Import Class definitions from classes.ts, and export these for reference from calling modules.
var classes_1 = require("./classes");
__exportStar(require("./classes"), exports);
// Public Imports
var aws = require("@pulumi/aws");
var del_cidr = require("@deloitte-cloud-uk/cidr");
var DefaultLabels;
(function (DefaultLabels) {
    DefaultLabels["PublicSunbet"] = "PublicSubnet";
    DefaultLabels["PrivateSubnet"] = "PrivateSubnet";
})(DefaultLabels || (DefaultLabels = {}));
function createVpc(attributes) {
    var response = new classes_1.Response();
    if (attributes.autoSplit) {
        // Pre-Calcuate the Cidr Blocks, because they have not been provided.
        getCidrs(attributes);
    }
    // Create the Main Vpc
    var vpcResponse = new aws.ec2.Vpc(attributes.name == "" ? "Main" : attributes.name, {
        cidrBlock: attributes.cidr[0],
        tags: {
            Name: attributes.name
        }
    });
    response.Vpc = vpcResponse;
    var cidrBlockAssociationResponse;
    // Attach any additional CIDR Blocks
    if (attributes.cidr.length > 1) {
        for (var i = 1; i < attributes.cidr.length; i++) {
            cidrBlockAssociationResponse = new aws.ec2.VpcIpv4CidrBlockAssociation("Cidr".concat(("00" + String(i)).substr(-2, 2)), {
                vpcId: vpcResponse.id,
                cidrBlock: attributes.cidr[i]
            });
            response.AdditionalCidrs.push(cidrBlockAssociationResponse);
        }
    }
    // Create Subnets
    var subnets = attributes.privateSubnets.subnets.concat(attributes.publicSubnets.subnets);
    subnets.forEach(function (subnetData) {
        var subnetResponse = new aws.ec2.Subnet(subnetData.name, {
            vpcId: vpcResponse.id,
            cidrBlock: subnetData.cidr,
            tags: {
                Name: subnetData.name
            }
        }, { dependsOn: cidrBlockAssociationResponse });
        response.Subnets.push(subnetResponse);
    });
    return response;
}
exports.createVpc = createVpc;
function getCidrs(attributes) {
    var pvt = attributes.privateSubnets;
    if (pvt.count > 0) {
        del_cidr.splitIpv4Cidr(pvt.ip(), pvt.mask(), pvt.count).getSubnetList().forEach(function (data, index) {
            pvt.subnets.push(new classes_1.Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PrivateSubnet : pvt.prefix) + "00".concat(index).substr(-2, 2),
                type: classes_1.SubnetType.Private
            }));
        });
    }
    var pub = attributes.publicSubnets;
    if (pub.count > 0) {
        del_cidr.splitIpv4Cidr(pub.ip(), pub.mask(), pub.count).getSubnetList().forEach(function (data, index) {
            pub.subnets.push(new classes_1.Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PublicSunbet : pub.prefix) + "00".concat(index).substr(-2, 2),
                type: classes_1.SubnetType.Public
            }));
        });
    }
}
