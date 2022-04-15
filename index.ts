// Import Class definitions from classes.ts, and export these for reference from calling modules.
import { Attributes, Response, Subnet, SubnetSettings, SubnetType } from "./classes"
export * from './classes'

// Public Imports
import * as aws from "@pulumi/aws";
import * as del_cidr from "@deloitte-cloud-uk/cidr";

enum DefaultLabels {
    PublicSunbet = "PublicSubnet",
    PrivateSubnet = "PrivateSubnet"
}

export function createVpc(attributes: Attributes): Response {

    let response = new Response()
    if (attributes.autoSplit) {
        // Pre-Calcuate the Cidr Blocks, because they have not been provided.
        getCidrs(attributes);
    }

    // Create the Main Vpc
    const vpcResponse = new aws.ec2.Vpc(
        attributes.name == "" ? "Main" : attributes.name, {
        cidrBlock: attributes.cidr[0],
        tags: {
            Name: attributes.name
        }
    }
    );
    response.Vpc = vpcResponse

    let cidrBlockAssociationResponse: aws.ec2.VpcIpv4CidrBlockAssociation
    // Attach any additional CIDR Blocks
    if (attributes.cidr.length > 1) {
        for (var i = 1; i < attributes.cidr.length; i++) {
            cidrBlockAssociationResponse = new aws.ec2.VpcIpv4CidrBlockAssociation(`Cidr${("00" + String(i)).substr(-2, 2)}`, {
                vpcId: vpcResponse.id,
                cidrBlock: attributes.cidr[i]
            });
            response.AdditionalCidrs.push(cidrBlockAssociationResponse)
        }
    }

    // Create Subnets
    let subnets: Array<Subnet> = attributes.privateSubnets.subnets.concat(attributes.publicSubnets.subnets)

    subnets.forEach((subnetData: Subnet) => {
        let subnetResponse = new aws.ec2.Subnet(subnetData.name, {
            vpcId: vpcResponse.id,
            cidrBlock: subnetData.cidr,
            tags: {
                Name: subnetData.name
            }
        }, { dependsOn: cidrBlockAssociationResponse })
        response.Subnets.push(subnetResponse)
    })

    return response
}

function getCidrs(attributes: Attributes) {
    let pvt = attributes.privateSubnets
    if (pvt.count > 0) {
        del_cidr.splitIpv4Cidr(pvt.ip(), pvt.mask(), pvt.count).getSubnetList().forEach((data: string, index: number) => {
            pvt.subnets.push(new Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PrivateSubnet : pvt.prefix) + `00${index}`.substr(-2, 2),
                type: SubnetType.Private
            }))
        })
    }
    let pub = attributes.publicSubnets
    if (pub.count > 0) {
        del_cidr.splitIpv4Cidr(pub.ip(), pub.mask(), pub.count).getSubnetList().forEach((data: string, index: number) => {
            pub.subnets.push(new Subnet({
                cidr: data,
                name: (pvt.prefix == "" ? DefaultLabels.PublicSunbet : pub.prefix) + `00${index}`.substr(-2, 2),
                type: SubnetType.Public
            }))
        })
    }
}
