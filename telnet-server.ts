import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

// Create a TCP listener on port 23 (telnet)
const listener = Deno.listen({ port: 23 });
console.log("Telnet server listening on port 23");

for await (const conn of listener) {
  handleConnection(conn);
}

async function handleConnection(conn: Deno.Conn) {
  console.log("New telnet connection from", conn.remoteAddr);

  try {
    // Start a new game process for this connection
    const process = new Deno.Command("deno", {
      args: ["run", "--allow-prompt", "/app/main.ts"],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    }).spawn();

    // Forward telnet input to game stdin and game output to telnet client
    const inputTask = conn.readable
      .pipeTo(process.stdin, { preventClose: true })
      .catch(() => {}); // Connection closed or error

    const outputTask = process.stdout
      .pipeTo(conn.writable, { preventClose: false })
      .catch(() => {}); // Connection closed or error

    // Wait for the game process to finish
    const status = await process.status;
    console.log(`Game ended with status: ${status.code}`);

    // Close the connection when game finishes
    conn.close();
  } catch (error) {
    console.error("Error handling connection:", error);
    try {
      conn.close();
    } catch {}
  }
}
