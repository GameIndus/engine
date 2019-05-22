import Game from "../../core/Game";
import Gradient from "../../util/Gradient";
import Texture from "./Texture";

export default class GradientTexture extends Texture {

    private readonly _gradient: Gradient;

    public constructor(game: Game, gradient: Gradient) {
        super(game, null);

        this._gradient = gradient;
        this.initBuffer();
    }

    public get source(): Gradient {
        return this._gradient;
    }

}
