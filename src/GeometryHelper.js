const buildMapGeometry = (width, height) => {
    const geometry = new Array(width);

    for (let x = 0; x < width; x++) {
        const vals = new Array(height)
        vals.fill('-', 0)
        geometry[x] = vals
    }

    return geometry;
}

class Position {
    x
    y
}

class Dimension {
    width
    height
}

/**
 *
 * @param {*} mapData
 * @param {Position} partitionLocation
 * @param {Position} roomInset
 * @param {Dimension} roomDimensions
 */
const buildRoomData = (mapData, partitionLocation, roomInset, roomDimensions) => {
    const startX = partitionLocation.x + roomInset.x
    const startY = partitionLocation.y + roomInset.y

    for (let x = 0; x < roomDimensions.width; x++) {
        for (let y = 0; y < roomDimensions.height; y++) {
            const dX = Math.min(mapData.length - 1, startX + x)
            const dY = Math.min(mapData[0].length - 1, startY + y)
            mapData[dX][dY] = 'X'
        }
    }
}

/**
 * @param {Array} mapData 2D array of space data
 * @param {*} firstNode Always either the top or left partition
 * @param {*} secondNode Always either the bottom or right partition
 */
const buildCorridorData = (mapData, firstNode, secondNode) => {

    // Stupid algo: connect middle to middle, always!
    const firstMidpoint = calcMidpoint(firstNode.value)
    const secondMidpoint = calcMidpoint(secondNode.value)

    denoteCorridor(mapData, firstMidpoint, secondMidpoint)
}

const calcMidpoint = ( nodeValue ) => {
    const midX = Math.round(nodeValue.position.x + (nodeValue.width / 2))
    const midY = Math.round(nodeValue.position.y + (nodeValue.height / 2))
    return { x: midX, y: midY }
}

const denoteCorridor = (mapData, pointA, pointB) => {
    // Horizontal!
    if (pointA.x === pointB.x) {
        for (let y = pointA.y; y < pointB.y; y++) {
            if (mapData[pointA.x][y] === '-') {
                mapData[pointA.x][y] = '*'
            }
        }
        // Vertical!
    } else if (pointA.y == pointB.y ){
        for (let x = pointA.x; x < pointB.x; x++) {
            if (mapData[x][pointA.y] === '-') {
                mapData[x][pointA.y] = '*'
            }
        }
    }
}


const Geometry = {
    buildMapGeometry,
    buildRoomData,
    buildCorridorData,
}

export default Geometry
