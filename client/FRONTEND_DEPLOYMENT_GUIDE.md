# Frontend Deployment Guide

## Overview
This guide explains how to deploy your Next.js frontend to AWS ECS.

## Prerequisites
- ECR repository for frontend already created
- Backend deployed and running
- AWS CLI configured

## Environment Variables for ECS Task Definition

Set these environment variables in your ECS task definition:

```json
[
  {
    "name": "NEXT_PUBLIC_BACKEND_URL",
    "value": "http://your-backend-load-balancer-url:5033"
  },
  {
    "name": "NEXTAUTH_URL",
    "value": "http://your-frontend-domain:3000"
  },
  {
    "name": "NEXTAUTH_SECRET",
    "value": "your-nextauth-secret-here"
  },
  {
    "name": "NODE_ENV",
    "value": "production"
  }
]
```

## Health Check Configuration

### ECS Task Definition Health Check:
```json
{
  "healthCheck": {
    "command": [
      "CMD-SHELL",
      "curl -f http://localhost:3000 || exit 1"
    ],
    "interval": 30,
    "timeout": 5,
    "retries": 3,
    "startPeriod": 60
  }
}
```

### Load Balancer Health Check (if using ALB):
- **Protocol**: HTTP
- **Port**: 3000  
- **Path**: `/` (root path)
- **Success codes**: 200
- **Interval**: 30 seconds
- **Timeout**: 5 seconds

## Build and Deploy Commands

```bash
# Navigate to client directory
cd client

# Build and push to ECR
docker buildx build --platform linux/amd64 -t your-frontend-ecr-repo:latest --push .

# Update ECS service
aws ecs update-service --cluster your-cluster --service your-frontend-service --force-new-deployment
```

## ECS Task Definition Settings

### Container Configuration:
- **Image**: Your ECR frontend repository URL
- **Port Mappings**: Container port 3000
- **CPU**: 512 (or as needed)
- **Memory**: 1024 MiB (or as needed)

### Networking:
- **VPC**: Same VPC as backend (optional, but recommended)
- **Subnets**: Public subnets (if using public load balancer)
- **Security Groups**: Allow inbound traffic on port 3000

## Security Group Configuration

### Frontend Security Group:
**Inbound Rules:**
- Type: HTTP
- Port: 3000
- Source: Load Balancer Security Group (or 0.0.0.0/0 for testing)

**Outbound Rules:**
- Type: All traffic
- Destination: 0.0.0.0/0

## Steps to Deploy

1. **Get Backend URL**: Find your backend load balancer URL from ECS console
2. **Generate NextAuth Secret**: 
   ```bash
   openssl rand -base64 32
   ```
3. **Update Environment Variables**: Set the correct URLs in your ECS task definition
4. **Build and Push**: Run the docker build command above
5. **Create/Update ECS Service**: Deploy to ECS
6. **Test**: Access your frontend via load balancer URL

## Troubleshooting

### Common Issues:
1. **Health check failing**: Check if container is responding on port 3000
2. **Backend connection errors**: Verify `NEXT_PUBLIC_BACKEND_URL` is correct
3. **Build failures**: Check if all dependencies are properly installed

### Debug Commands:
```bash
# Check ECS task logs
aws logs describe-log-groups

# Connect to running container
aws ecs execute-command --cluster your-cluster --task your-task-id --container frontend --command "/bin/sh" --interactive

# Test health endpoint locally
curl http://localhost:3000
```

## Next Steps After Deployment

1. **Set up custom domain** (Route 53 + CloudFront)
2. **Enable HTTPS** (SSL certificate)
3. **Set up monitoring** (CloudWatch alarms)
4. **Configure auto-scaling** (based on CPU/memory usage)

## Security Best Practices

1. **Use HTTPS** in production
2. **Restrict security groups** to minimum required access
3. **Use AWS Secrets Manager** for sensitive environment variables
4. **Enable container insights** for monitoring
5. **Regular security updates** for base images 