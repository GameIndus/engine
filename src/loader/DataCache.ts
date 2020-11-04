export default class DataCache {
    private _cache: DataCacheStorage

    public constructor() {
        this._cache = { images: [], sounds: [] }
    }

    public get images(): CacheFile[] {
        return this._cache.images
    }

    public get sounds(): CacheFile[] {
        return this._cache.sounds
    }

    public addImage(image: CacheFile) {
        if (image.type === 'image') {
            this._cache.images.push(image)
        }
    }

    public addSound(sound: CacheFile) {
        if (sound.type === 'sound') {
            this._cache.sounds.push(sound)
        }
    }

    public getImage(key: string): HTMLImageElement | null {
        for (const cacheImage of this._cache.images) {
            if (cacheImage.key === key) {
                return cacheImage.data
            }
        }
        return null
    }
}

export interface DataCacheStorage {
    images: CacheFile[]
    sounds: CacheFile[]
}

export interface CacheFile {
    type: string
    key: string
    path: string

    data: any

    loading: boolean
    loaded: boolean
    error: boolean
}
