# Use the official Node.js runtime as the base image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies and browsers
RUN apt-get update && apt-get install -y \
    # Essential packages
    wget \
    curl \
    gnupg \
    unzip \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    # For running browsers in headless mode
    xvfb \
    # For Chrome
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo-gobject2 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install Firefox
RUN wget -q -O - https://packages.mozilla.org/apt/repo-signing-key.gpg | gpg --dearmor -o /usr/share/keyrings/packages.mozilla.org.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/packages.mozilla.org.gpg] https://packages.mozilla.org/apt mozilla main" | tee -a /etc/apt/sources.list.d/mozilla.list \
    && apt-get update \
    && apt-get install -y firefox \
    && rm -rf /var/lib/apt/lists/*

# Install Microsoft Edge (optional - uncomment if needed)
# RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg \
#     && install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/ \
#     && sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/microsoft.gpg] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list' \
#     && apt-get update \
#     && apt-get install -y microsoft-edge-stable \
#     && rm -rf /var/lib/apt/lists/*

# Create a non-root user for better security
RUN groupadd -r selenium && useradd -r -g selenium -G audio,video selenium \
    && mkdir -p /home/selenium/Downloads \
    && chown -R selenium:selenium /home/selenium \
    && chown -R selenium:selenium /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application
COPY . .

# Build the TypeScript application
RUN npm run build

# Create directories and set permissions
RUN mkdir -p /app/screenshots /app/downloads /app/logs \
    && chown -R selenium:selenium /app

# Switch to non-root user
USER selenium

# Set environment variables for headless browser operation
ENV DISPLAY=:99
ENV CHROME_BIN=/usr/bin/google-chrome
ENV FIREFOX_BIN=/usr/bin/firefox
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Expose port (if your MCP server needs HTTP access - adjust as needed)
EXPOSE 3000

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Default command to start the MCP server
CMD ["npm", "start"]
