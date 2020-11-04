export default class Util {
    public static getVendors(): string[] {
        return ['ms', 'moz', 'webkit', 'o']
    }

    public static sortArrayByProperty(array: any[], property: string): any[] {
        let sortOrder = 1

        if (property[0] === '-') {
            sortOrder = -1
            property = property.substr(1)
        }

        array.sort((a, b) => {
            const result: number = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
            return result * sortOrder
        })

        return array
    }

    public static copyObject<T>(object: T): T {
        const objectCopy = {} as T

        for (const key in object) {
            if ((object as any).hasOwnProperty(key)) {
                objectCopy[key] = object[key]
            }
        }

        return objectCopy
    }

    public static urlFromPath(path: string, base: string): string {
        return Util.isUrl(path) ? path : base + path
    }

    public static isUrl(str: string): boolean {
        // tslint:disable-next-line:max-line-length
        const pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/
        return pattern.test(str)
    }
}
