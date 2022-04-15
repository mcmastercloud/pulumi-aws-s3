import * as aws from "@pulumi/aws";

export enum SubnetType {
    Private,
    Public
}

export class Response {
    Vpc: aws.ec2.Vpc | undefined
    AdditionalCidrs: Array<aws.ec2.VpcIpv4CidrBlockAssociation> = []
    Subnets: Array<aws.ec2.Subnet> = []
}

export class Subnet {
    name: string = "";
    cidr: string = "";
    type: SubnetType = SubnetType.Private;

    constructor(init: Partial<Subnet>) {
        Object.assign(this, init);
    }
}

export class SubnetSettings {
    cidr: string = "";
    subnets: Array<Subnet> = [];
    count: number = 3;
    prefix: string = "";

    constructor(init?: Partial<SubnetSettings>) {
        Object.assign(this, init);
    }

    mask(): number {
        return Number(this.cidr.split("/")[1])
    }

    ip(): string {
        return this.cidr.split("/")[0]
    }
}

export class Attributes {
    cidr: Array<string> = [];
    name: string = "";
    autoSplit: boolean = false;
    privateSubnets: SubnetSettings = new SubnetSettings();
    publicSubnets: SubnetSettings = new SubnetSettings();

    constructor(init?: Partial<Attributes>) {
        Object.assign(this, init);
    }
}


