package botkill;

import java.io.IOException;

import com.google.gson.Gson;
import org.json.JSONObject;

public class AI {

    public static void main(String[] args) throws IOException {

        TCPClient client = new TCPClient();
        client.connect();

        // Create a new game if no game id passed in arguments
        if (args.length == 0) {
            // Write create game message to the server
            client.send(new CreateGame().getMessage());

            System.out.println("Game ID: " + client.readLine());
        }
        // Otherwise join game
        else {
            JSONObject gameId = new JSONObject().put("gameId", args[0]);
            JSONObject joinGame = new JSONObject();
            joinGame.put("join", gameId);

            // Write join message to the server
            client.send(joinGame.toString());

            // Listen to server messages
            MessageListener listener = new MessageListener(client);
            listener.start();
        }
    }
}
