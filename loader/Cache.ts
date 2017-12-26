class Cache {

    private game: Game;

    private _cache: CacheStorage = {
        images: [],
        sounds: []
    };


    public constructor(game: Game) {
        this.game = game;
    }

    public get images(): CacheFile[] {
        return this._cache.images;
    }

    public get sounds(): CacheFile[] {
        return this._cache.sounds;
    }


    public addImage(image: CacheFile) {
        if (image.type == "image") {
            this._cache.images.push(image);
        }
    }

    public addSound(sound: CacheFile) {
        if (sound.type == "sound") {
            this._cache.sounds.push(sound);
        }
    }


    public getImage(key: string): HTMLImageElement {

        for (let cacheImage of this._cache.images) {
            if (cacheImage.key == key) return cacheImage.data;
        }

        return null;
    }

}

interface CacheStorage {
    images: CacheFile[];
    sounds: CacheFile[];
}

interface CacheFile {
    type: string;
    key: string;
    path: string;

    data: any;

    loading: boolean,
    loaded: boolean;
    error: boolean;
}