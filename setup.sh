#!/bin/bash

echo "Setting up your environment..."

# Function to check and install Docker
check_install_docker() {
  if command -v docker &> /dev/null; then
    echo "Docker is already installed: $(docker --version)"
  else
    echo "Docker not found. Installing Docker..."
    
    # Update package lists
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common gnupg
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up the Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package lists again with the new repository
    sudo apt-get update
    
    # Install Docker Engine
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    echo "Docker installed successfully. You may need to log out and back in for user group changes to take effect."
  fi
}

# Function to check and install Docker Compose
check_install_docker_compose() {
  if command -v docker compose &> /dev/null; then
    echo "Docker Compose is already installed"
  else
    echo "Docker Compose not found. Installing Docker Compose..."
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    echo "Docker Compose installed successfully."
  fi
}

# Check Docker and Docker Compose installation first
check_install_docker
check_install_docker_compose

# Check if both commands were provided
if [ $# -lt 2 ]; then
  echo "Error: Not enough arguments"
  echo "Usage: $0 [prod|dev] [up|down|build|logs]"
  exit 1
fi

# Store both parameters separately
ENV=$1
ACTION=$2

# First check the environment
case $ENV in
  prod)
    COMPOSE_FILE="docker-compose.yml"
    echo "Using production environment"
    ;;
  dev)
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "Using development environment"
    ;;
  *)
    echo "Unknown environment: $ENV"
    echo "Usage: $0 [prod|dev] [up|down|build|logs]"
    exit 1
    ;;
esac

# Then check the action
case $ACTION in
  up)
    echo "Starting $ENV containers..."
    docker compose -f $COMPOSE_FILE up -d --build
    ;;
  down)
    echo "Stopping $ENV containers..."
    docker compose -f $COMPOSE_FILE down
    ;;
  build)
    echo "Building $ENV containers..."
    docker compose -f $COMPOSE_FILE build
    ;;
  logs)
    echo "Showing $ENV logs..."
    docker compose -f $COMPOSE_FILE logs -f
    ;;
  *)
    echo "Unknown action: $ACTION"
    echo "Usage: $0 [prod|dev] [up|down|build|logs]"
    exit 1
    ;;
esac