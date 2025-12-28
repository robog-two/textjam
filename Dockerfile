FROM denoland/deno:latest

WORKDIR /app

COPY main.ts telnet-server.ts .

EXPOSE 23

CMD ["deno", "run", "--allow-net", "--allow-run", "--allow-prompt", "telnet-server.ts"]
