import Color from '../math/Color'

export interface GameConfig {
    width?: number
    height?: number
    parent?: HTMLElement
    canvasId?: string

    antialias?: boolean
    transparent?: boolean
    debug?: boolean
    loader?: LoaderConfig

    forceSetTimeout?: boolean

    autoFocus?: boolean
}

export interface LoaderConfig {
    backgroundColor?: Color
    progressBarColor?: Color
    progressBackgroundColor?: Color
    madeByColor?: Color

    activeMadeByMessage?: boolean
}
