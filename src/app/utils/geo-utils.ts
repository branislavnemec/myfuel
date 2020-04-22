export class GeoUtils {

    public static lat = 0.009009009009009; // degrees latitude per kilometer
    public static lon = 0.011299435028248; // degrees longitude per kilometer

    // Default geohash length
    public static GEOHASH_PRECISION = 10;

    // Characters used in location geohashes
    public static BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';


    /**
     * Generates a geohash of the specified precision/string length from the  [latitude, longitude]
     * pair, specified as an array.
     *
     * @param location The [latitude, longitude] pair to encode into a geohash.
     * @param precision The length of the geohash to create. If no precision is specified, the
     * global default is used.
     * @returns The geohash of the inputted location.
     */
    public static encodeGeohash(location: number[], precision: number = GeoUtils.GEOHASH_PRECISION): string {
        GeoUtils.validateLocation(location);
        if (typeof precision !== 'undefined') {
            if (typeof precision !== 'number' || isNaN(precision)) {
                throw new Error('precision must be a number');
            } else if (precision <= 0) {
                throw new Error('precision must be greater than 0');
            } else if (precision > 22) {
                throw new Error('precision cannot be greater than 22');
            } else if (Math.round(precision) !== precision) {
                throw new Error('precision must be an integer');
            }
        }
    
        const latitudeRange = {
            min: -90,
            max: 90
        };
        const longitudeRange = {
            min: -180,
            max: 180
        };
        let hash = '';
        let hashVal = 0;
        let bits = 0;
        let even: number | boolean = 1;
    
        while (hash.length < precision) {
            const val = even ? location[1] : location[0];
            const range = even ? longitudeRange : latitudeRange;
            const mid = (range.min + range.max) / 2;
        
            if (val > mid) {
                hashVal = (hashVal << 1) + 1;
                range.min = mid;
            } else {
                hashVal = (hashVal << 1) + 0;
                range.max = mid;
            }
        
            even = !even;
            if (bits < 4) {
                bits++;
            } else {
                bits = 0;
                hash += GeoUtils.BASE32[hashVal];
                hashVal = 0;
            }
        }
    
        return hash;
    }

    /**
     * Validates the inputted location and throws an error if it is invalid.
     *
     * @param location The [latitude, longitude] pair to be verified.
     */
    public static validateLocation(location: number[]): void {
        let error: string;
    
        if (!Array.isArray(location)) {
            error = 'location must be an array';
        } else if (location.length !== 2) {
            error = 'expected array of length 2, got length ' + location.length;
        } else {
            const latitude = location[0];
            const longitude = location[1];
    
            if (typeof latitude !== 'number' || isNaN(latitude)) {
                error = 'latitude must be a number';
            } else if (latitude < -90 || latitude > 90) {
                error = 'latitude must be within the range [-90, 90]';
            } else if (typeof longitude !== 'number' || isNaN(longitude)) {
                error = 'longitude must be a number';
            } else if (longitude < -180 || longitude > 180) {
                error = 'longitude must be within the range [-180, 180]';
            }
        }
    
        if (typeof error !== 'undefined') {
            throw new Error('Invalid location \'' + location + '\': ' + error);
        }
    }    

}
