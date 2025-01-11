
# Cloud Deployment Instructions

This document provides clear steps for deploying the application to AWS ECS Fargate using the provided `cloudformation` scripts and templates.

---

## Prerequisites

Ensure you have the following installed and configured:

1. **AWS CLI** (latest version):
   - [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
   - Configure AWS CLI with your credentials:
     ```bash
     aws configure
     ```

2. **Docker** (latest version):
   - [Install Docker](https://docs.docker.com/get-docker/)

3. **Environment Variables**:
   - Ensure the following variables are set in your environment or `.env` file:
     ```env
     CI_COMMIT_SHA=<commit-sha>
     AWS_REGION=eu-central-1
     IMAGE_URI=<your-ecr-uri>/<repository-name>:<tag>
     ```
     Replace `<commit-sha>` with a unique identifier (e.g., Git commit hash) and `<your-ecr-uri>` with your AWS ECR repository URI.

---

## Deployment Steps

### Step 1: Build Docker Image

Use the `docker-build.sh` script to build the Docker image:
```bash
./cloudformation/docker-build.sh
```

Alternatively, build the image manually:
```bash
docker build -t <your-ecr-uri>/<repository-name>:<commit-sha> .
```

---

### Step 2: Push Docker Image to Amazon ECR

Push the Docker image using the `docker-push.sh` script:
```bash
./cloudformation/docker-push.sh
```

If running manually:
1. Log in to AWS ECR:
   ```bash
   aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <your-ecr-uri>
   ```
2. Push the image:
   ```bash
   docker push <your-ecr-uri>/<repository-name>:<commit-sha>
   ```

---

### Step 3: Create or Update CloudFormation Stack

To deploy the infrastructure, use the provided CloudFormation templates.

#### Create a New Stack
Run the `create-stack.sh` script:
```bash
./cloudformation/create-stack.sh
```

#### Update an Existing Stack
Run the `update-stack.sh` script:
```bash
./cloudformation/update-stack.sh
```

---

### Step 4: Update ECS Task Definition

Update the ECS task definition with the new Docker image using the `update-task.sh` script:
```bash
./cloudformation/update-task.sh
```

If running manually, update the `task-def.json` file with the new `IMAGE_URI` and use the AWS CLI to register the new task definition:
```bash
aws ecs register-task-definition --cli-input-json file://cloudformation/task-def.json
```

---

### Step 5: Update ECS Service

Ensure the ECS service uses the updated task definition by running:
```bash
./cloudformation/update-ecs-service.sh
```

If running manually:
```bash
aws ecs update-service --cluster <cluster-name> --service <service-name> --force-new-deployment
```

---

### Step 6: Verify Deployment

1. Log in to the AWS Management Console.
2. Navigate to the ECS section and verify the following:
   - The service is running with the latest task definition.
   - Tasks are in the `RUNNING` state.
3. Check the CloudWatch logs for your ECS tasks to confirm the application is functioning correctly.

---

## Additional Notes

- **Split Commands**:
  - The `cloudformation` folder includes separate scripts (`docker-build.sh`, `docker-push.sh`, `update-task.sh`, `update-ecs-service.sh`) for each deployment step, allowing flexibility for manual control.

- **Lifecycle Policy**:
  - Use the `ecr-lifecycle-policy.json` to manage your ECR repository images. Apply it with the following command:
    ```bash
    aws ecr put-lifecycle-policy --repository-name <repository-name> --lifecycle-policy-text file://cloudformation/ecr-lifecycle-policy.json
    ```

- **Environment-Specific Settings**:
  - Update the `.env` file or environment variables as required for your production, staging, or testing environments.

---

