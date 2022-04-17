import * as aws from "@pulumi/aws";

export declare enum SubnetType {
    Private = 0,
    Public = 1
}
export declare class Response {
    Vpc: aws.ec2.Vpc | undefined;
    AdditionalCidrs: Array<aws.ec2.VpcIpv4CidrBlockAssociation>;
    Subnets: Array<aws.ec2.Subnet>;
}
export declare class Subnet {
    name: string;
    cidr: string;
    type: SubnetType;
    constructor(init: Partial<Subnet>);
}
export declare class SubnetSettings {
    cidr: string;
    subnets: Array<Subnet>;
    count: number;
    prefix: string;
    constructor(init?: Partial<SubnetSettings>);
    mask(): number;
    ip(): string;
}
export declare class Attributes {
    cidr: Array<string>;
    name: string;
    autoSplit: boolean;
    privateSubnets: SubnetSettings;
    publicSubnets: SubnetSettings;
    constructor(init?: Partial<Attributes>);
}

export declare function createVpc(attributes: Attributes): Response;
