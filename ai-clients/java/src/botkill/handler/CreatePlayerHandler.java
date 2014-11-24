package botkill.handler;

import botkill.Game;
import botkill.Player;
import botkill.Weapon;
import com.google.gson.Gson;
import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 1:10
 */
public class CreatePlayerHandler implements Handler<Game> {

    private Player player;

    public CreatePlayerHandler(Player player) {
        this.player = player;
    }

    @Override
    public String getMessage() {
        JSONObject createPlayer = new JSONObject();
        createPlayer.put("createplayer", new JSONObject(new Gson().toJson(player)));
        return createPlayer.toString();
    }

    @Override
    public void handle(Game game) {
        // TODO: IMPLEMENT PLAYER CREATION

        player.setName("Bot");
        player.setHp(50);
        player.setSpeed(50);
        player.setSight(50);
        player.setHearing(50);
        player.setWeapon(new Weapon());
    }
}
