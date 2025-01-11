#!/bin/bash

TASK_NAME="convertify-task"
OUTPUT_FILE="task-def.json"
UPDATED_FILE="update-task-def.json"

# Ensure CI_COMMIT_SHA is set
if [ -z "$CI_COMMIT_SHA" ]; then
  echo "Error: CI_COMMIT_SHA environment variable is not set."
  exit 1
fi

# Construct the image tag using the commit SHA
IMAGE=".dkr.ecr.eu-central-1.amazonaws.com/convertify:$CI_COMMIT_SHA"

# Step 1: Describe the current task definition and clean the output
echo "Fetching the current task definition..."
aws ecs describe-task-definition \
  --task-definition "$TASK_NAME" \
  --query 'taskDefinition' \
  --output json | jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)' > "$OUTPUT_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to describe the current task definition."
  exit 1
fi

echo "Cleaned task definition saved to $OUTPUT_FILE"

# Step 2: Update the container image tag in the task definition
echo "Updating the container image tag..."
jq --arg IMAGE "$IMAGE" '.containerDefinitions[0].image = $IMAGE' "$OUTPUT_FILE" > "$UPDATED_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to update the container image tag."
  exit 1
fi

echo "Updated task definition with new image tag saved to $UPDATED_FILE"

# Step 3: Register the updated task definition
echo "Registering the updated task definition..."
TASK_DEF_OUTPUT=$(aws ecs register-task-definition \
  --cli-input-json file://"$UPDATED_FILE")

if [ $? -ne 0 ]; then
  echo "Failed to register the updated task definition."
  exit 1
fi

# Extract and log the new Task Definition ARN
TASK_DEF_ARN=$(echo "$TASK_DEF_OUTPUT" | jq -r '.taskDefinition.taskDefinitionArn')
if [ -z "$TASK_DEF_ARN" ]; then
  echo "Failed to extract the new task definition ARN."
  exit 1
fi

echo "Task definition registered successfully with ARN: $TASK_DEF_ARN"

# Pass the new Task Definition ARN to the parent script (optional)
export NEW_TASK_DEF_ARN="$TASK_DEF_ARN"
