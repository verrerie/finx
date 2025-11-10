FROM ubuntu:latest

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    gnupg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js latest (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Install pnpm
RUN npm install -g pnpm@latest

# Create non-root user
RUN useradd -m -s /bin/bash ubuntu

# Verify installations
RUN node --version && npm --version && pnpm --version

# Switch to non-root user
USER ubuntu

# Set working directory to user's home directory
WORKDIR /home/ubuntu

# Default command
CMD ["/bin/bash"]

