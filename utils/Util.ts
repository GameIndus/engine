class Util {

    public static getVendors(): string[] {
        return ['ms', 'moz', 'webkit', 'o'];
    }

    public static sortArrayByProperty(array: any[], property: string): any[] {
        let sortOrder: number = 1;

        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        array.sort(function (a, b) {
            let result: number = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        });

        return array;
    }

    public static copyObject<T>(object: T): T {
        var objectCopy = <T>{};

        for (var key in object)
            if (object.hasOwnProperty(key))
                objectCopy[key] = object[key];

        return objectCopy;
    }

    public static objectEquals(obj1: Object, obj2: Object): boolean {

        for (let key in obj1) {
            if (!obj1.hasOwnProperty(key)) continue;

            if (obj1[key] != obj2[key]) return false;
        }

        return true;
    }

    public static removeFrom(array: Array<any>, item: any): void {
        array.splice(array.indexOf(item), 1);
    }

    public static urlFromPath(path: string, base: string): string {
        let isUrl: boolean = Util.isUrl(path);

        if (isUrl) return path;
        else return base + path;
    }

    public static isUrl(str): boolean {
        var pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

        return pattern.test(str);
    }

}