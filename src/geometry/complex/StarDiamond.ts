import Star from './Star'

export default class Diamond extends Star {
    public constructor(radiusFraction?: number) {
        super(2, radiusFraction)
    }
}
