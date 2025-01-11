
# My Application

A brief description of your application and its purpose.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (version 18)
- **npm** 
- **MongoDB** (optional, if not using a cloud database)
- **RabbitMQ** (optional, if not using a cloud queue service)

---

## Getting Started


### Install Dependencies
```bash
npm install
```

### Environment Variables
1. Create a `.env` file in the project root directory.
2. Add the following environment variables:
   ```env
   APP_PORT=4100
   PAYLOAD_SIZE_LIMIT='2mb'
   DB_URI=mongodb+srv://test:sdfergr
   JWT_SECRET=wwwww
   JWT_EXPIRATION_TIME=604800
   CURRENCY_CONVERSION_URI=
   CURRENCY_CONVERSION_API_KEY=
   CONVERSION_QUEUE_NAME=
   RABBITMQ_URL=
   RABBITMQ_USERNAME=
   RABBITMQ_PASSWORD=
   ```
3. Replace placeholders (e.g., `DB_URI`, `RABBITMQ_URL`) with your actual values.

---

## Running the Application

### Locally Without Docker
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the application:
   ```bash
   npm start
   ```

The application will run on `http://localhost:4100`.

---

### Locally With Docker
1. Build and run the container:
   ```bash
   docker build -t my-app .
   docker run -p 4100:8080 --env-file .env my-app
   ```
2. The application will run on `http://localhost:4100`.

---

## Testing

To run tests:
1. Install dependencies (if not already done):
   ```bash
   npm install
   ```
2. Run the test suite:
   ```bash
   npm test
   ```

---

## Deployment to AWS ECS Fargate

1. **Build Docker Image**:
   ```bash
   docker build -t my-app .
   docker tag my-app:latest <your-ecr-repo>:latest
   docker push <your-ecr-repo>:latest
   ```

2. **Deploy Using CloudFormation**:
   ```bash
   aws cloudformation deploy \
       --template-file cloudformation.yml \
       --stack-name my-app-stack \
       --capabilities CAPABILITY_NAMED_IAM
   ```

---

## Additional Notes
- Ensure RabbitMQ and MongoDB are running locally or accessible from the environment.
- For cloud environments, update `.env` with production credentials and URLs.
