export default function distance(startPoint, endPoint) {
    return (
        Math.pow(endPoint.x - startPoint.x, 2) +
        Math.pow(endPoint.y - startPoint.y, 2)
    );
}
