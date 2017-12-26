interface Shape {
	points: Point[];
}

interface ComplexShape {
	points: Point[];
	calculatePoints(position: Position, size: RectangleSize) : Point[];
}

enum ShapeType {
	// Basic shapes
	RECTANGLE,
	CIRCLE,
	TRIANGLE,

	// Custom & Complex shape
	COMPLEX,
	POLYGON
}