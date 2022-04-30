// Import Class definitions from classes.ts, and export these for reference from calling modules.
import { Attributes, Response } from "./classes"
export * from './classes'

// Public Imports
import * as aws from "@pulumi/aws";
import * as del_cidr from "@deloitte-cloud-uk/cidr";


export function createBucket(attributes: Attributes): Response {

    let response = new Response()    

    const bucket = new aws.s3.Bucket(attributes.name, {
    })

    response.Bucket = bucket

    return response
}


