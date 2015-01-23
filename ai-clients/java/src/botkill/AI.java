package botkill;

import java.io.IOException;

public class AI extends Thread {

    private TCPClient client;
    private MessageHandler handler;

    public AI(TCPClient client) {
        this.client = client;
        handler = new MessageHandler();
    }

    public void run() {
        System.out.println("Waiting for join requests...");

        while (!isInterrupted()) {

            String msg = client.readLine();

            // Is it a join request?
            if (msg != null) {
                // Join request contains game data which should be utilized to set our player properties
                String createPlayerMsg = handler.handleJoinRequest(msg);
                if (createPlayerMsg != null) {
                    // Create the player
                    client.send(createPlayerMsg);

                    // Start game loop
                    MessageListener listener = new MessageListener(client);
                    listener.start();
                } else {
                    System.out.println("Create player msg was null...this shouldn't happen if you want to join any games.");
                }
            }

            try {
                Thread.sleep(1000/60); // Work at maximum speed of 60fps
            } catch (InterruptedException e) {
                interrupt();
            }
        }
    }

    public static void main(String[] args) throws IOException {
        TCPClient client = new TCPClient();
        // TODO: Change the ID
        client.connect("MY_SECRET_ID");

        AI ai = new AI(client);
        ai.start();
    }
}
