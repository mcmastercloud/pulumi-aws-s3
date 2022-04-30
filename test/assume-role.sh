#!/bin/bash
. ./reset-role.sh

export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s" \
$(aws sts assume-role \
--role-arn $1 \
--role-session-name AWSCli \
--query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
--output text))

