package botkill;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 24.11.2014
 * Time: 0:02
 */
public class Weapon {
    private int firingSpeed;
    private int damage;
    private int carry;
    private int noise;

    public Weapon() {
        // TODO: IMPLEMENT THIS
        firingSpeed = 50;
        damage = 50;
        carry = 50;
        noise = 50;
    }

    public int getCarry() {
        return carry;
    }

    public void setCarry(int carry) {
        this.carry = carry;
    }

    public int getDamage() {
        return damage;
    }

    public void setDamage(int damage) {
        this.damage = damage;
    }

    public int getFiringSpeed() {
        return firingSpeed;
    }

    public void setFiringSpeed(int firingSpeed) {
        this.firingSpeed = firingSpeed;
    }

    public int getNoise() {
        return noise;
    }

    public void setNoise(int noise) {
        this.noise = noise;
    }
}