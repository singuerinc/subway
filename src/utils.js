export default class Utils {
    static convert(value) {
        return value * 7;
    }

    static midpoint(lat1, long1, lat2, long2, per) {
        return [lat1 + (lat2 - lat1) * per, long1 + (long2 - long1) * per];
    }
}
