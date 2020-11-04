import Signal from '../core/Signal'

export default class Device {
    private _capabilities: DeviceCapability[]

    private _audioCapabilities: DeviceAudioCapability[]

    private _deviceReadyAt: number

    private _deviceReadyQueue: Array<[(device: Device) => void, any]>

    private _operatingSystem: DeviceOS

    private _browser: DeviceBrowser

    private _desktop: boolean

    private _initialized: boolean

    private _pixelRatio: number

    private _onInitialized: Signal

    public constructor() {
        this._capabilities = []
        this._audioCapabilities = []
        this._deviceReadyAt = -1
        this._deviceReadyQueue = []
        this._operatingSystem = DeviceOS.WINDOWS
        this._browser = DeviceBrowser.CHROME
        this._desktop = false
        this._initialized = false
        this._pixelRatio = 1
        this._onInitialized = new Signal()
    }

    public get operatingSystem(): DeviceOS {
        return this._operatingSystem
    }

    public get browser(): DeviceBrowser {
        return this._browser
    }

    public get desktop(): boolean {
        return this._desktop
    }

    public get initialized(): boolean {
        return this._initialized
    }

    public get pixelRatio(): number {
        return this._pixelRatio
    }

    public get onInitialized(): Signal {
        return this._onInitialized
    }

    public get browserName(): string {
        return DeviceBrowser[this._browser]
    }

    public get operatingSystemName(): string {
        return DeviceOS[this.operatingSystem]
    }

    public supports(capability: DeviceCapability): boolean {
        return this._capabilities.indexOf(capability) > -1
    }

    public supportsAudio(capability: DeviceAudioCapability): boolean {
        return this._audioCapabilities.indexOf(capability) > -1
    }

    public whenReady(callback: (device: Device) => void, context: any): void {
        if (this._deviceReadyAt) {
            callback.call(context, this)
            return
        } else {
            this._deviceReadyQueue.push([callback, context])

            document.addEventListener('deviceready', this._readyCheck.bind(this), false)
            document.addEventListener('DOMContentLoaded', this._readyCheck.bind(this), false)
            window.addEventListener('load', this._readyCheck.bind(this), false)
        }
    }

    private initialize(): void {
        this.checkOS()
        this.checkBrowser()
        this.checkAudio()
        this.checkDevice()
        this.checkFullscreenSupport()
        this.checkStorageSupport()
    }

    private checkAudio(): void {
        if (AudioContext || (window as any).webkitAudioContext) {
            this._audioCapabilities.push(DeviceAudioCapability.WEB_AUDIO)
        }

        const audioElement: HTMLMediaElement = document.createElement('audio')

        try {
            if (!!audioElement.canPlayType) {
                if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '')) {
                    this._audioCapabilities.push(DeviceAudioCapability.OGG)
                }
                if (
                    audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, '') ||
                    audioElement.canPlayType('audio/opus;').replace(/^no$/, '')
                ) {
                    this._audioCapabilities.push(DeviceAudioCapability.OPUS)
                }

                if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, '')) {
                    this._audioCapabilities.push(DeviceAudioCapability.MP3)
                }

                if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')) {
                    this._audioCapabilities.push(DeviceAudioCapability.WAV)
                }
                if (
                    audioElement.canPlayType('audio/x-m4a;') ||
                    audioElement.canPlayType('audio/aac;').replace(/^no$/, '')
                ) {
                    this._audioCapabilities.push(DeviceAudioCapability.M4A)
                }
                if (audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')) {
                    this._audioCapabilities.push(DeviceAudioCapability.WEBM)
                }
            }
        } catch (e) {
            // We don't want to log errors in the navigator console
        }
    }

    private checkBrowser(): void {
        const ua: string = navigator.userAgent

        if (/Edge\/\d+/.test(ua)) {
            this._browser = DeviceBrowser.EGDE
        } else if (/Chrome\/(\d+)/.test(ua) && this.operatingSystem !== DeviceOS.WINDOWS_PHONE) {
            this._browser = DeviceBrowser.CHROME
        } else if (/Firefox\D+(\d+)/.test(ua)) {
            this._browser = DeviceBrowser.FIREFOX
        } else if (/AppleWebKit/.test(ua) && this.operatingSystem === DeviceOS.IOS) {
            this._browser = DeviceBrowser.MOBILE_SAFARI
        } else if (/MSIE (d+\.\d+);/.test(ua)) {
            this._browser = DeviceBrowser.INTERNET_EXPLORER
        } else if (/Opera/.test(ua)) {
            this._browser = DeviceBrowser.OPERA
        } else if (/Safari\/(\d+)/.test(ua)) {
            this._browser = DeviceBrowser.SAFARI
        } else if (/Trident/.test(ua)) {
            this._browser = DeviceBrowser.TRIDENT
        }

        if ((window.navigator as any).standalone) {
            this._browser = DeviceBrowser.WEBAPP
        }
    }

    private checkDevice(): void {
        this._pixelRatio = window.devicePixelRatio || 1

        // Support for vibrations
        if (navigator.vibrate && !this.desktop) {
            this._capabilities.push(DeviceCapability.VIBRATION)
        }
    }

    private checkFullscreenSupport(): void {
        let fs = false

        const prefixes = ['fullscreenEnabled', 'webkitFullscreenEnabled', 'mozFullscreenEnabled', 'msFullscreenEnabled']

        prefixes.forEach(prefix => {
            if ((document as any)[prefix]) {
                fs = true
            }
        })

        if (fs) {
            this._capabilities.push(DeviceCapability.FULLSCREEN)
        }
    }

    private checkStorageSupport(): void {
        if (typeof localStorage !== 'object') {
            return
        }

        try {
            localStorage.setItem('localStorage', '1')
            localStorage.removeItem('localStorage')
        } catch (e) {
            return
        }

        this._capabilities.push(DeviceCapability.LOCALSTORAGE)
    }

    private checkOS(): void {
        const ua: string = navigator.userAgent

        if (/Android/.test(ua)) {
            this._operatingSystem = DeviceOS.ANDROID
        } else if (/CrOS/.test(ua)) {
            this._operatingSystem = DeviceOS.CHROMEOS
        } else if (/iP[ao]d|iPhone/i.test(ua)) {
            this._operatingSystem = DeviceOS.IOS
        } else if (/Linux/.test(ua)) {
            this._operatingSystem = DeviceOS.LINUX
        } else if (/Mac OS/.test(ua)) {
            this._operatingSystem = DeviceOS.MACOS
        } else if (/Windows/.test(ua)) {
            this._operatingSystem = DeviceOS.WINDOWS
        }

        if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
            this._operatingSystem = DeviceOS.WINDOWS_PHONE
        }

        // Now we can detect if the browser is used on a mobile
        const os = this.operatingSystem

        this._desktop =
            os === DeviceOS.WINDOWS || os === DeviceOS.MACOS || os === DeviceOS.LINUX || os === DeviceOS.CHROMEOS
    }

    private _readyCheck(): void {
        this._deviceReadyAt = Date.now()

        document.removeEventListener('deviceready', this._readyCheck)
        document.removeEventListener('DOMContentLoaded', this._readyCheck)
        window.removeEventListener('load', this._readyCheck)

        if (this.initialized) {
            return
        }

        this.initialize()
        this._initialized = true

        this.onInitialized.dispatch(this)

        // Call all callbacks
        let item: [(device: Device) => void, any] | undefined
        do {
            item = this._deviceReadyQueue.shift()
            if (item) {
                const callback: (device: Device) => void = item[0]
                const context = item[1]

                callback.call(context, this)
            }
        } while (item)

        this._deviceReadyQueue = []
        this._onInitialized.halt()
    }
}

export enum DeviceCapability {
    FULLSCREEN,
    VIBRATION,

    LOCALSTORAGE,
}

export enum DeviceAudioCapability {
    OGG,
    OPUS,
    MP3,
    WAV,
    M4A,
    WEBM,

    WEB_AUDIO,
}

export enum DeviceOS {
    ANDROID,
    CHROMEOS,
    IOS,
    LINUX,
    MACOS,
    WINDOWS,
    WINDOWS_PHONE,
}

export enum DeviceBrowser {
    EGDE,
    CHROME,
    FIREFOX,
    MOBILE_SAFARI,
    INTERNET_EXPLORER,
    OPERA,
    SAFARI,
    TRIDENT,
    WEBAPP,
}
