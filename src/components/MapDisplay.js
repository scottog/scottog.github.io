import { useEffect, useState } from "react";
import rand from 'random-seed'

const EMPTY_CELL = '-'

const getMapDataAsTextLines = (mapDataToRender) => {
    const stringsInTheProperOrientation = Array(mapDataToRender[0].length)
    for (let y = 0; y < mapDataToRender[0].length; y++) {
        const row = []
        for (let x = 0; x < mapDataToRender.length; x++) {
            row.push(mapDataToRender[x][y])
        }
        stringsInTheProperOrientation.push(row.join(''))
    }
    return stringsInTheProperOrientation
}

const createEmptyMapData = (mapData) => {
    const copy = Array(mapData.length)
    for (let x = 0; x < mapData.length; x++) {
        const row = []
        for (let y= 0; y < mapData[0].length; y++) {
            row.push('-')
        }
        copy[x] = row
    }
    return copy
}

const getAllNonEmptyPoints = (mapData) => {
    const allPoints = []
    for (let x = 0; x < mapData.length; x++) {
        for (let y = 0; y < mapData[x].length; y++) {
            if (mapData[x][y] !== EMPTY_CELL)
                allPoints.push({ x, y})
        }
    }
    return allPoints
}

// Fisher-Yates FTW
const inPlaceShuffle = (array) => {
    const random = rand.create()
    for (let i = array.length - 1; i > 0; i--) {
        const j = random.intBetween(0, i + 1)
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const MapDisplay = ({ mapData }) => {
    // millis
    const tickDelta = 50
    const sparseMapData = createEmptyMapData(mapData)
    const [ mapDataAsText, setMapDataAsText ] = useState(getMapDataAsTextLines(sparseMapData))
    const fillInSome = (mapData, renderedMapData, allNonEmptyPoints) => {
        // TODO here
        for (let numRemove = 0; numRemove < 40; numRemove++ ) {
            if (allNonEmptyPoints.length < 1) break
            const { x, y } = allNonEmptyPoints.pop()
            renderedMapData[x][y] = mapData[x][y]
        }
        return allNonEmptyPoints.length < 1
    }

    useEffect(() => {
        let complete = false
        // Da bling
        const allNonEmptyPoints = getAllNonEmptyPoints(mapData)
        inPlaceShuffle(allNonEmptyPoints)
        const tick = setInterval(() => {
            // set new state
            if (complete) return

            complete = fillInSome(mapData, sparseMapData, allNonEmptyPoints)

            const mapDataAsTextLines = getMapDataAsTextLines(sparseMapData)
            setMapDataAsText(mapDataAsTextLines)
        }, tickDelta)

        return () => clearInterval(tick)
    }, [mapData])

    return (
        <ul>{
            mapDataAsText.map( (row,index) => <li key={index}>{row}</li> )
        }</ul>
    );
};

export default MapDisplay
