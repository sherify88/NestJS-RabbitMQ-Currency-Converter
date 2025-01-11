#!/bin/bash

# Ensure CI_COMMIT_SHA is set
if [ -z "$CI_COMMIT_SHA" ]; then
  echo "Error: CI_COMMIT_SHA environment variable is not set."
  exit 1
fi

aws cloudformation create-stack \
        --stack-name convertify-stack \
        --template-body file://./cloudformation/convertify-ecs-fargate.yml \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameters \
          ParameterKey=Subnet1Id,ParameterValue=subnet- \
          ParameterKey=Subnet2Id,ParameterValue=subnet- \
          ParameterKey=VPCId,ParameterValue=vpc- \
          ParameterKey=ImageTag,ParameterValue=${CI_COMMIT_SHA}
