export class JsonUtils {

    static objectToMap(obj) {
        const mp = new Map();
        Object.keys(obj).forEach(k => { mp.set(k, obj[k]) });
        return mp;
    }

}
