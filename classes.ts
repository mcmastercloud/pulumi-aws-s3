import * as aws from "@pulumi/aws";

export class Attributes {
    name: string = "";

    constructor(init: Partial<Attributes>) {
        Object.assign(this, init);
    }
}

export class Response {
    Bucket: aws.s3.Bucket | undefined
}
