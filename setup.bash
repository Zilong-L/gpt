#!/bin/bash

# Initialize a flag to indicate if a reboot is required
reboot_required=false

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    # Install Docker
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io

    # Add current user to docker group
    sudo usermod -aG docker $USER
    newgrp docker

    # Set the reboot flag
    reboot_required=true
fi

# allow traffic to pass http port 80 on ubuntu.
sudo ufw allow http
if [ "$reboot_required" = true ]; then
    echo "Docker and/or nginx have been installed. Please reboot the system and run the script again."
    exit 1
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    # 1. Install nginx
    sudo apt install -y nginx

    # 2. Configure nginx to relay port 80 to localhost:3000
    sudo bash -c "cat > /etc/nginx/sites-available/default <<- 'EOF'
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"

    # 3. Restart nginx
    sudo systemctl restart nginx

    # Set the reboot flag
    reboot_required=true
fi

# If reboot is required, prompt the user and exit the script
if [ "$reboot_required" = true ]; then
    echo "Docker and/or nginx have been installed. Please reboot the system and run the script again."
    exit 1
fi


# 4. create .env.local file and ask user for GPT_API_KEY

if [ ! -f ".env.local" ]; then
    touch .env.local
    echo -n "Please enter your GPT_API_KEY: "
    read GPT_API_KEY
    echo "GPT_API_KEY=$GPT_API_KEY" >> .env.local
fi

# 5. Run docker-compose with build and detached options
docker compose up --build -d
