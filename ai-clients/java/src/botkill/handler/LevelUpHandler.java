package botkill.handler;

import botkill.Player;
import com.google.gson.Gson;
import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 1:01
 */
public class LevelUpHandler implements Handler<Integer> {

    private Player player;

    public LevelUpHandler(Player player) {
        this.player = player;
    }

    @Override
    public String getMessage() {
        // TODO: Check if we can pass the whole player object as json
        JSONObject levelUp = new JSONObject();
        levelUp.put("levelup", new JSONObject(new Gson().toJson(player)));
        return levelUp.toString();
    }

    @Override
    public void handle(Integer exp) {
        // TODO: IMPLEMENT LEVEL UP
        int exp1, exp2;

        if (exp % 2 == 0) {
            exp1 = exp / 2;
            exp2 = exp / 2;
        } else {
            exp1 = (exp + 1) / 2;
            exp2 = (exp - 1) / 2;
        }

        player.setHp(player.getHp() + exp1);
        player.getWeapon().setDamage(player.getWeapon().getDamage() + exp2);
    }
}
