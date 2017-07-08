export default class Utils {
    static convert(value) {
        return value * 7;
    }

    static midpoint(lat1, long1, lat2, long2, per) {
        return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
    }

    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
}
