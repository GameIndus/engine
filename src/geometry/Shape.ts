import Position from '../geometry/Position'
import Point from './Point'
import { RectangleSize } from './Rectangle'

export default interface Shape {
    points: Point[]
}

export interface ComplexShape {
    points: Point[]

    calculatePoints(position: Position, size: RectangleSize): Point[]
}

export enum ShapeType {
    // Basic shapes
    RECTANGLE,
    CIRCLE,
    TRIANGLE,

    // Custom & Complex shape
    COMPLEX,
    POLYGON,
}
