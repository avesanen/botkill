package botkill.util;

/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 23.11.2014
 * Time: 23:45
 */
public class Vector2d {
    public static Vector2d EAST = new Vector2d(1, 0);
    public static Vector2d WEST = new Vector2d(-1, 0);
    public static Vector2d NORTH = new Vector2d(0, -1);
    public static Vector2d SOUTH = new Vector2d(0, 1);

    private double x;
    private double y;

    public Vector2d(double value) {
        this(value, value);
    }

    public Vector2d() {
        this(0, 0);
    }

    public Vector2d(Vector2d v) {
        this.x = v.x;
        this.y = v.y;
    }

    public Vector2d(double x, double y) {
        this.x = x; this.y = y;
    }


    public void move(Vector2d v) {
        this.x += v.x;
        this.y += v.y;
    }

    public void move(double x, double y) {
        this.x += x;
        this.y += y;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public Vector2d subtract(Vector2d other) {
        double x = this.x - other.x;
        double y = this.y - other.y;
        return new Vector2d(x, y);
    }

    public double dot(Vector2d vec) {
        return (x * vec.x) + (y * vec.y);
    }

    public static double cross(Vector2d a, Vector2d b) {
        return a.cross(b);
    }

    public double cross(Vector2d vec) {
        return x * vec.y - y * vec.x;
    }

    public Vector2d multiply(double value) {
        return new Vector2d(value * x, value * y);
    }

    public double dotProduct(Vector2d other) {
        return other.x * x + other.y * y;
    }

    public Vector2d scale(double a) {
        x *= a;
        y *= a;
        return this;
    }

    public Vector2d normalize() {
        double magnitude = Math.sqrt(dotProduct(this));
        return new Vector2d(x / magnitude, y / magnitude);
    }

    public double distanceSquared(Vector2d other) {
        double dx = other.getX() - getX();
        double dy = other.getY() - getY();

        return (dx * dx) + (dy * dy);
    }

    public double distance(Vector2d other) {
        return Math.sqrt(distanceSquared(other));
    }



    public Vector2d reverse() {
        x = -x;
        y = -y;
        return this;
    }

    public double length() {
        return Math.sqrt(x * x + y * y);
    }

    public double lengthSquared() {
        return (x * x) + (y * y);
    }

    public void rotate(double angle) {
        double rx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle));
        double ry = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
        x = rx;
        y = ry;
    }

    public String toString() {
        return (new StringBuffer("[Vector2d x:")).append(x).append(" y:").append(y).append("]").toString();
    }


    public Object clone() {
        return new Vector2d(x, y);
    }
}
