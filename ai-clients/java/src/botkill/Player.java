package botkill;

import botkill.handler.CreatePlayerHandler;
import botkill.handler.Handler;
import botkill.handler.LevelUpHandler;
import botkill.util.Vector2d;
import com.google.gson.Gson;
import org.json.JSONObject;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 23.11.2014
 * Time: 23:31
 */
public class Player {

    private Handler<Integer> levelUpHandler;
    private Handler<Game> createPlayerHandler;

    private String id;
    private String name;

    private Integer currentHp;
    private int hp;
    private int speed;
    private int sight;
    private int hearing;
    private Weapon weapon;

    private Float x;
    private Float y;
    private Vector2d velocity;
    private Vector2d lookAt;
    private Vector2d shootAt;
    private Integer team;
    private Boolean isDead;

    // Create our player based on the game data
    public Player(Game game) {
        createPlayerHandler = new CreatePlayerHandler(this);
        createPlayerHandler.handle(game);

        levelUpHandler = new LevelUpHandler(this);
    }

    public String levelUp(JSONObject exp) {
        int points = new JSONObject(exp).getInt("points");
        levelUpHandler.handle(points);
        return levelUpHandler.getMessage();
    }

    public String getCreatePlayerMessage() {
        return createPlayerHandler.getMessage();
    }

    public Integer getCurrentHp() {
        return currentHp;
    }

    public void setCurrentHp(int currentHp) {
        this.currentHp = currentHp;
    }

    public int getHearing() {
        return hearing;
    }

    public void setHearing(int hearing) {
        this.hearing = hearing;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean isDead() {
        return isDead;
    }

    public void setDead(boolean dead) {
        isDead = dead;
    }

    public Vector2d getLookAt() {
        return lookAt;
    }

    public void setLookAt(Vector2d lookAt) {
        this.lookAt = lookAt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Vector2d getShootAt() {
        return shootAt;
    }

    public void setShootAt(Vector2d shootAt) {
        this.shootAt = shootAt;
    }

    public int getSight() {
        return sight;
    }

    public void setSight(int sight) {
        this.sight = sight;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public Integer getTeam() {
        return team;
    }

    public void setTeam(int team) {
        this.team = team;
    }

    public Vector2d getVelocity() {
        return velocity;
    }

    public void setVelocity(Vector2d velocity) {
        this.velocity = velocity;
    }

    public Weapon getWeapon() {
        return weapon;
    }

    public void setWeapon(Weapon weapon) {
        this.weapon = weapon;
    }

    public Float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public Float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }
}
