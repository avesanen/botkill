package botkill;

import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 23.11.2014
 * Time: 2:04
 */
public class MessageHandler {

    private Game game;

    public static final String GAME_OVER = "gameover";

    public String handleJoinRequest(String msg) {
        final String JOIN_REQUEST = "joinrequest";

        JSONObject msgJson = new JSONObject(msg);
        String msgType = (String) msgJson.keySet().toArray()[0];
        JSONObject msgObject = msgJson.getJSONObject(msgType);

        String response = null;

        switch (msgType) {
            case JOIN_REQUEST:
                // Game data received. Create our own game object.
                game = new Game(msgObject);
                // Create the player and return createplayer message
                response = game.createPlayer();
                break;
            default:
                System.out.println("Unknown message type received: " + msgType);
        }

        return response;
    }

    public String handle(String msg) {
        final String GAME_STATE = "gamestate";
        final String EXPERIENCE = "experience";
        final String ROUND_END = "roundend";

        JSONObject msgJson = new JSONObject(msg);
        String msgType = (String) msgJson.keySet().toArray()[0];
        JSONObject msgObject = msgJson.getJSONObject(msgType);

        String response = null;

        switch (msgType) {
            case GAME_STATE:
                // Update game state and return possible action message
                response = game.update(msgObject);
                break;
            case EXPERIENCE:
                // Assign exp points in player/weapon skills and return levelup message
                response = game.getMyPlayer().levelUp(msgObject);
                break;
            case GAME_OVER:
                game = null;
                response = GAME_OVER;
            case ROUND_END:
                assert game != null;
                game.reset();
            default:
                System.out.println("Unknown message type received: " + msgType);
        }

        return response;
    }
}
