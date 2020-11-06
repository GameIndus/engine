import Position from '../geometry/Position'
import Point from './Point'
import { Size } from './Rectangle'

export default interface Shape {
    points: Point[]
}

export interface ComplexShape {
    points: Point[]

    calculatePoints(position: Position, size: Size): Point[]
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
