export class JsonRevivers {
    static dateFormat: RegExp = /^\d{4}-\d{2}-\d{2}/;

    static date(key, value) {
        if (typeof value === "string" && JsonRevivers.dateFormat.test(value)) {
            return new Date(value);
        }

        return value;
    }
}
