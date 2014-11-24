package botkill;

import botkill.enums.Action;
import botkill.util.Vector2d;
import com.google.gson.Gson;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 2:20
 */
public class ActionMessage {
    private int type;
    private Vector2d direction;

    public String getMessage() {
        return new Gson().toJson(this);
    }

    public Vector2d getDirection() {
        return direction;
    }

    public void setDirection(Vector2d direction) {
        this.direction = direction;
    }

    public void setActionType(Action type) {
        this.type = type.ordinal();
    }

    public Action getActionType() {
        return Action.getByIndex(type);
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setSpeed(float speed) {
        this.direction.scale(speed);
    }
}
