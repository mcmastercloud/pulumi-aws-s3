"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Import Class definitions from classes.ts, and export these for reference from calling modules.
const classes_1 = require("./classes");
__export(require("./classes"));
// Public Imports
const aws = require("@pulumi/aws");
const del_cidr = require("@deloitte-cloud-uk/cidr");
var DefaultLabels;
(function (DefaultLabels) {
    DefaultLabels["PublicSunbet"] = "PublicSubnet";
    DefaultLabels["PrivateSubnet"] = "PrivateSubnet";
})(DefaultLabels || (DefaultLabels = {}));
function createVpc(attributes) {
    let response = new classes_1.Response();
    if (attributes.autoSplit) {
        // Pre-Calcuate the Cidr Blocks, because they have not been provided.
        getCidrs(attributes);
    }
    // Create the Main Vpc
    const vpcResponse = new aws.ec2.Vpc(attributes.name == "" ? "Main" : attributes.name, {
        cidrBlock: attributes.cidr[0],
        tags: {
            Name: attributes.name
        }
    });
    response.Vpc = vpcResponse;
    let cidrBlockAssociationResponse;
    // Attach any additional CIDR Blocks
    if (attributes.cidr.length > 1) {
        for (var i = 1; i < attributes.cidr.length; i++) {
            cidrBlockAssociationResponse = new aws.ec2.VpcIpv4CidrBlockAssociation(`Cidr${("00" + String(i)).substr(-2, 2)}`, {
                vpcId: vpcResponse.id,
                cidrBlock: attributes.cidr[i]
            });
            response.AdditionalCidrs.push(cidrBlockAssociationResponse);
        }
    }
    // Create Subnets
    let subnets = attributes.privateSubnets.subnets.concat(attributes.publicSubnets.subnets);
    subnets.forEach((subnetData) => {
        let subnetResponse = new aws.ec2.Subnet(subnetData.name, {
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
    let pvt = attributes.privateSubnets;
    if (pvt.count > 0) {
        del_cidr.splitIpv4Cidr(pvt.ip(), pvt.mask(), pvt.count).getSubnetList().forEach((data, index) => {
            pvt.subnets.push(new classes_1.Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PrivateSubnet : pvt.prefix) + `00${index}`.substr(-2, 2),
                type: classes_1.SubnetType.Private
            }));
        });
    }
    let pub = attributes.publicSubnets;
    if (pub.count > 0) {
        del_cidr.splitIpv4Cidr(pub.ip(), pub.mask(), pub.count).getSubnetList().forEach((data, index) => {
            pub.subnets.push(new classes_1.Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PublicSunbet : pub.prefix) + `00${index}`.substr(-2, 2),
                type: classes_1.SubnetType.Public
            }));
        });
    }
}
//# sourceMappingURL=index.js.map