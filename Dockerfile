FROM debian:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    inetutils-inetd \
    inetutils-telnetd \
    curl \
    ca-certificates \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with UID 10000 (avoids overlap with system UIDs)
RUN groupadd -r appgroup && useradd -r -u 10000 -g appgroup -m appuser

WORKDIR /app

# Copy and set ownership before switching user
COPY main.ts /app/
RUN chown -R appuser:appgroup /app

# Create a wrapper script for telnetd to execute
RUN mkdir -p /app/bin && echo '#!/bin/sh' > /app/bin/telnet-wrapper.sh && echo 'exec /home/appuser/.deno/bin/deno run /app/main.ts' >> /app/bin/telnet-wrapper.sh && chmod +x /app/bin/telnet-wrapper.sh

# Configure inetd for telnet - run as non-root user
# Note: telnetd may require CAP_NET_BIND_SERVICE to bind port 23
RUN echo 'telnet stream tcp nowait appuser /usr/sbin/telnetd telnetd -E /app/bin/telnet-wrapper.sh' >> /etc/inetd.conf

EXPOSE 23

# Switch to non-root user
USER appuser

# Install Deno as the non-root user
RUN curl -fsSL https://deno.land/install.sh | sh

# Run inetd in foreground
CMD ["/usr/sbin/inetutils-inetd", "-d"]
