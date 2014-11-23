package botkill;

import java.io.IOException;
import org.json.JSONObject;

public class AI {

    public static void main(String[] args) throws IOException {

        TCPClient client = new TCPClient();
        client.connect();

        // Create new game if no game id passed in arguments
        if (args.length == 0) {

            JSONObject createGame = new JSONObject();
            createGame.put("createGame", new JSONObject(new CreateGame()));

            client.send(createGame.toString());

            System.out.println("Game ID: " + client.getReader().readLine());
        }
        // Otherwise join game
        else {
            JSONObject gameId = new JSONObject().put("gameId", args[0]);
            JSONObject joinGame = new JSONObject();
            joinGame.put("join", gameId);

            // Write join message to the server
            client.send(joinGame.toString());

            // Listen to server messages
            MessageListener listener = new MessageListener(client.getReader(), client.getWriter());
            listener.start();
        }
    }
}
