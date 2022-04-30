import * as s3 from '../index'

let attributes = new s3.Attributes({
    name: "test-bucket"
});

s3.createBucket(attributes)
