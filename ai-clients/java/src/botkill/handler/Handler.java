package botkill.handler;


/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 1:07
 */
public interface Handler<T> {
    public void handle(T obj);
    public String getMessage();
}
