#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Define variables
CLUSTER="my-apps-cluster"
SERVICE="convertify-service"
TASK_FAMILY="convertify-task"

# Fetch the latest task definition ARN
echo "Fetching the latest task definition ARN for $TASK_FAMILY..."
LATEST_TASK_DEFINITION=$(aws ecs describe-task-definition \
  --task-definition "$TASK_FAMILY" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

if [ -z "$LATEST_TASK_DEFINITION" ]; then
  echo "Error: Failed to fetch the latest task definition ARN."
  exit 1
fi

echo "Latest Task Definition ARN: $LATEST_TASK_DEFINITION"

# Update the ECS service with the new task definition
echo "Updating ECS service $SERVICE in cluster $CLUSTER..."
UPDATE_OUTPUT=$(aws ecs update-service \
  --cluster "$CLUSTER" \
  --service "$SERVICE" \
  --task-definition "$LATEST_TASK_DEFINITION" \
  --force-new-deployment)

if [ $? -ne 0 ]; then
  echo "Error: Failed to update the ECS service."
  exit 1
fi

echo "Service updated successfully with task definition: $LATEST_TASK_DEFINITION"
