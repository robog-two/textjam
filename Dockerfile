FROM debian:latest

# Install dependencies
RUN apt-get update && apt-get install -y \
    inetutils-inetd \
    inetutils-telnetd \
    curl \
    ca-certificates \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Deno
RUN curl -fsSL https://deno.land/install.sh | sh

ENV PATH="/root/.deno/bin:$PATH"

WORKDIR /app

COPY main.ts /app/

# Create .bashrc that runs the game on login
RUN echo 'deno run /app/main.ts; exit' > /root/.bashrc

# Configure inetd for telnet - execute bash directly without login
RUN echo 'telnet stream tcp nowait root /usr/sbin/telnetd telnetd -E /bin/bash' >> /etc/inetd.conf

EXPOSE 23

# Run inetd in foreground
CMD ["/usr/sbin/inetutils-inetd", "-d"]
