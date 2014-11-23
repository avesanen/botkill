package botkill;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 23.11.2014
 * Time: 1:55
 */
public class MessageListener extends Thread {

    BufferedReader in;
    DataOutputStream out;
    MessageHandler handler;

    public MessageListener(BufferedReader  in, DataOutputStream out) {
        this.in = in;
        this.out = out;
        handler = new MessageHandler();
    }

    public void run() {
        while (!isInterrupted()) {

            String msg = null;
            try {
                msg = in.readLine();
            } catch (IOException e) {
                System.out.println("Can't read message from server. Exception: " + e.getMessage());
            }

            if (msg != null) {
                String response = handler.handle(msg);
                if (response != null) {
                    try {
                        out.writeBytes(response);
                    } catch (IOException e) {
                        System.out.println("Can't write message to server. Exception: " + e.getMessage());
                    }
                }
            }
        }
    }

}
