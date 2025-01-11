#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if CI_COMMIT_SHA is set and not empty
if [ -z "$CI_COMMIT_SHA" ]; then
  echo "Error: CI_COMMIT_SHA is not set or empty."
  exit 1
fi

# Define variables
IMAGE_URI=".dkr.ecr.eu-central-1.amazonaws.com/convertify:${CI_COMMIT_SHA}"
AWS_REGION="eu-central-1"

# Step 1: Build Docker image
echo "Building Docker image: $IMAGE_URI"
docker build -t "$IMAGE_URI" .

# Step 2: Push Docker image
echo "Pushing Docker image: $IMAGE_URI"
docker push "$IMAGE_URI" || {
  echo "Unauthorized error. Attempting to log in to AWS ECR..."
  aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin ".dkr.ecr.$AWS_REGION.amazonaws.com"
  echo "Retrying Docker push..."
  docker push "$IMAGE_URI"
}

# Step 3: Update ECS Task Definition
echo "Updating ECS Task Definition..."
./cloudformation/update-task.sh || {
  echo "Failed to update ECS Task Definition."
  exit 1
}

# Step 4: Update ECS Service
echo "Updating ECS Service..."
./cloudformation/update-ecs-service.sh || {
  echo "Failed to update ECS Service."
  exit 1
}

echo "Deployment completed successfully!"
