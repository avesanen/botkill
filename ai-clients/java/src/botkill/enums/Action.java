package botkill.enums;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 2:17
 */
public enum Action {
    MOVE(0),
    SHOOT(1),
    LOOK(2);

    private final int index;

    Action(int i) {
        this.index = i;
    }

    public static Action getByIndex(int i) {
        return Action.values()[i];
    }
}
