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

    public String handle(String msg) {
        final String GAME_STATE = "gamestate";
        final String GAME_DATA = "gamedata";
        final String EXPERIENCE = "experience";

        JSONObject msgJson = new JSONObject(msg);
        String msgType = (String) msgJson.keySet().toArray()[0];
        JSONObject msgObject = msgJson.getJSONObject(msgType);

        String response = null;

        switch (msgType) {
            case GAME_STATE:
                // Update game state and return possible action message
                response = game.update(msgObject);
                break;
            case GAME_DATA:
                // Game data received. Create our own game object.
                game = new Game(msgObject);
                // Create the player and return createplayer message
                response = game.createPlayer();
                break;
            case EXPERIENCE:
                // Assign exp points in player/weapon skills and return levelup message
                response = game.getMyPlayer().levelUp(msgObject);
                break;
            default:
                System.out.println("Unknown message type received: " + msgType);
        }


        return response;
    }
}
