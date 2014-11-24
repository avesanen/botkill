package botkill;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 1:31
 */
public class GameState {

    private int timeLeft;
    private boolean indoor;
    private float rain;
    private float darkness;
    private Player myPlayer;
    private List<Player> players;
    private List<Item> items;
    private List<Bullet> bullets;
    private List<Sound> sounds;

    public List<Bullet> getBullets() {
        return bullets;
    }

    public void setBullets(List<Bullet> bullets) {
        this.bullets = bullets;
    }

    public float getDarkness() {
        return darkness;
    }

    public void setDarkness(float darkness) {
        this.darkness = darkness;
    }

    public boolean isIndoor() {
        return indoor;
    }

    public void setIndoor(boolean indoor) {
        this.indoor = indoor;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public Player getMyPlayer() {
        return myPlayer;
    }

    public void setMyPlayer(Player myPlayer) {
        this.myPlayer = myPlayer;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public float getRain() {
        return rain;
    }

    public void setRain(float rain) {
        this.rain = rain;
    }

    public List<Sound> getSounds() {
        return sounds;
    }

    public void setSounds(List<Sound> sounds) {
        this.sounds = sounds;
    }

    public int getTimeLeft() {
        return timeLeft;
    }

    public void setTimeLeft(int timeLeft) {
        this.timeLeft = timeLeft;
    }
}
