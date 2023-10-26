// Binary Space Partitioning tree implementation.
// Following algorithm given in Procedural Content Generation in Games
// (https://www.pcgbook.com/chapter03.pdf)

import { BinaryTree } from './BinaryTree.js'
import Geometry from './GeometryHelper.js'
import rand from 'random-seed'

const BY_QUADRANT = 4
const ROOM_COEFFICIENT = 20
const SLICE_TYPE_H = 'horizontal'
const SLICE_TYPE_V = 'vertical'

class BinarySpacePartitionTreeOptions {
    width;
    height;
    minNodeHeight;
    minNodeWidth;
    minRoomHeight;
    minRoomWidth;
    seed;
}

class BinarySpacePartitionNodeValue {
    width;
    height;
    position;
}

class BinarySpacePartitionTree {
    /**
     * @param {number} width Integer value for the space to work with; width
     * @param {number} height Integer value for the space to work with; height
     * @param {BinarySpacePartitionTreeOptions} options BinarySpacePartitionTreeOptions. All values are optional
     **/
    constructor(width, height, options = {}) {
        this.nodeName = 1000
        this.mapData = Geometry.buildMapGeometry(width, height)
        const nodeValue = { width, height, position: {x: 0, y: 0} }

        // Either dictated by options or the suggested for a BinarySpacePartition tree based on its dimensions
        this.minRoomWidth = this._ensureSanity( options.minRoomWidth, Math.ceil(width / ROOM_COEFFICIENT) )
        this.minRoomHeight = this._ensureSanity( options.minRoomHeight, Math.ceil(height / ROOM_COEFFICIENT) )
        // Ensure we don't slice partitions too small to fit two rooms.
        this.minRoomWidth = Math.max( this.minRoomWidth, 1 )
        this.minRoomHeight = Math.max( this.minRoomHeight, 1 )

        // Either dictated by options or the suggested for a BinarySpacePartition tree slice by quadrant
        this.minNodeWidth = this._ensureSanity( options.minNodeWidth, Math.ceil(width / BY_QUADRANT) )
        this.minNodeHeight = this._ensureSanity( options.minNodeHeight, Math.ceil(height / BY_QUADRANT) )
        // Ensure we don't slice partitions too small to fit two rooms.
        this.minNodeWidth = Math.max( (this.minRoomWidth + 2) * 2, this.minNodeWidth )
        this.minNodeHeight = Math.max( (this.minRoomHeight + 2) * 2, this.minNodeHeight )

        console.log(`minNodeWidth  = ${this.minNodeWidth}`)
        console.log(`minNodeHeight = ${this.minNodeHeight}`)
        console.log(`minRoomHeight = ${this.minRoomHeight}`)
        console.log(`minRoomWidth  = ${this.minRoomWidth}`)

        // random-seed handles non-strings, strings, and empty values alike!
        this.rando = rand.create(options.seed)

        this._bTree = new BinaryTree(this.nodeName++, nodeValue)
    }

    _ensureSanity = (userInput, calculated) => {
        // Use user input if and only if it's sane [1.0, calculated]
        if (userInput && typeof userInput == 'number' && userInput >= 1)
        {
            console.log(`UserInput ${userInput} is acceptable.`)
            return userInput
        }
        console.log(`UserInput '${userInput}' is unacceptable. Using calculated '${calculated}'`)
        return calculated
    }

    /**
     * No arg = divide the whole tree, otherwise work on the specified node
     * @param {BinaryTreeNode} node
     */
    _subdivide = (node = this._bTree.root) => {
        let firstNodeValue, secondNodeValue
        if (this._nodeIsDivisibleHorizAndVert(node.value)) {
            [firstNodeValue, secondNodeValue] = this._sliceHorizOrVert(node)
        }
        else if (this._nodeIsDivisibleHoriz(node.value)) {
            [firstNodeValue, secondNodeValue] = this._sliceHoriz(node)
        }
        else if (this._nodeIsDivisibleVert(node.value)) {
            [firstNodeValue, secondNodeValue] = this._sliceVert(node)
        }

        // Insert the new nodes!
        if (firstNodeValue && secondNodeValue) {
            const parentNodeKey = node.key
            this._bTree.insert(parentNodeKey, this.nodeName++, firstNodeValue, { left: true })
            this._bTree.insert(parentNodeKey, this.nodeName++, secondNodeValue, { right: true} )

            // Now try to subdivide them!
            this._subdivide(node.left)
            this._subdivide(node.right)
        }
    }

    /**
     * @param {BinaryTreeNode} nodeValue
     * @returns [ BinarySpacePartitionNodeValue, BinarySpacePartitionNodeValue ]
     */
    _sliceHoriz = (node) => {
        const nodeValue = node.value
        // We don't want to slice off too little from either side, so use established minimums
        const minVal = Math.min(this.minRoomWidth + 2, nodeValue.width - (this.minRoomWidth + 2))
        const maxVal = Math.max(this.minRoomWidth + 2, nodeValue.width - (this.minRoomWidth + 2))
        const slicePosition = this.rando.intBetween(minVal, maxVal)

        const firstNodeValue = {
            height: nodeValue.height,
            width: slicePosition,
            position: {x: nodeValue.position.x, y: nodeValue.position.y}
        }
        const secondNodeValue = {
            height: nodeValue.height,
            width: nodeValue.width - slicePosition,
            position: {x: nodeValue.position.x + slicePosition, y: nodeValue.position.y}
        }
        nodeValue.sliceType = SLICE_TYPE_H
        return [firstNodeValue, secondNodeValue]
    }

    /**
     * @param {BinaryTreeNode} nodeValue
     * @returns [ BinarySpacePartitionNodeValue, BinarySpacePartitionNodeValue ]
     */
    _sliceVert = (node) => {
        const nodeValue = node.value
        // We don't want to slice off too little from either side, so use established minimums
        const minVal = Math.min(this.minRoomHeight + 2, nodeValue.height - (this.minRoomHeight + 2))
        const maxVal = Math.max(this.minRoomHeight + 2, nodeValue.height - (this.minRoomHeight + 2))
        const slicePosition = this.rando.intBetween( minVal, maxVal )

        const firstNodeValue = {
            height: slicePosition,
            width: nodeValue.width,
            position: {x: nodeValue.position.x, y: nodeValue.position.y}
        }
        const secondNodeValue = {
            height: nodeValue.height - slicePosition,
            width: nodeValue.width,
            position: {x: nodeValue.position.x, y: nodeValue.position.y + slicePosition}
        }
        nodeValue.sliceType = SLICE_TYPE_V
        return [firstNodeValue, secondNodeValue]
    }

    /**
     * @param {BinarySpacePartitionNodeValue} nodeValue
     */
    _sliceHorizOrVert = (node) => {
        const chooseSlice = this.rando.intBetween(1, 2)
        if (chooseSlice == 1) {
            return this._sliceHoriz(node)
        } else {
            return this._sliceVert(node)
        }
    }

    /**
     * @param {BinarySpacePartitionNodeValue} nodeValue
     */
    _nodeIsDivisibleVert = (nodeValue) => {
        return nodeValue.height > this.minNodeHeight
    }

    /**
     * @param {BinarySpacePartitionNodeValue} nodeValue
     */
    _nodeIsDivisibleHoriz = (nodeValue) => {
        return nodeValue.width > this.minNodeWidth
    }

    /**
     *
     * @param {BinarySpacePartitionNodeValue} nodeValue
     */
    _nodeIsDivisibleHorizAndVert = (nodeValue) => {
        return (this._nodeIsDivisibleHoriz(nodeValue) && this._nodeIsDivisibleVert(nodeValue))
    }

    /**
     *
     * @param {BinaryTreeNode} node
     */
    buildRooms = (node = this._bTree.root) => {
        if (node.isLeaf) {
            this._buildRoom(node)
        } else {
            if (node.left) this.buildRooms(node.left)
            if (node.right) this.buildRooms(node.right)
        }
    }

    /**
     *
     * @param {BinaryTreeNode} node
     */
    _buildRoom = (node) => {
        if (!node || !node.isLeaf) return

        // Guarantee the room takes up > 50% of the available space
        const minRoomWidth = Math.max( Math.ceil(node.value.width / 2), this.minRoomWidth )
        const minRoomHeight = Math.max( Math.ceil(node.value.height / 2), this.minRoomHeight )

        const roomWidth = this.rando.intBetween(minRoomWidth, node.value.width - 2)
        const roomHeight = this.rando.intBetween(minRoomHeight, node.value.height - 2)
        const topIndent = this.rando.intBetween(1, node.value.height - roomHeight)
        const leftIndent = this.rando.intBetween(1, node.value.width - roomWidth)

        // Remember these for corridor-building convenience
        node.value.room = {
            leftIndent,
            topIndent,
            roomWidth,
            roomHeight,
        }

        Geometry.buildRoomData(
            this.mapData,
            {
                x: node.value.position.x,
                y: node.value.position.y
            },
            {
                x: leftIndent,
                y: topIndent
            },
            {
                width: roomWidth,
                height: roomHeight
            }
        )
    }

    /**
     *
     * @param {BinaryTreeNode} node
     */
    buildCorridors = (node = this._bTree.root) => {
        if (node.isLeaf) {
            return
        }

        if (node.left) this.buildCorridors(node.left)
        if (node.right) this.buildCorridors(node.right)

        Geometry.buildCorridorData(this.mapData, node.left, node.right)
    }

    // ========== Debugging convenience methods ============
    dumpTree = () => {
        console.log([...this._bTree.inOrderTraversal()].map(x => `W: ${x.value.width} Y: ${x.value.height} PosX: ${x.value.position.x} PosY: ${x.value.position.y} \n`));
    }

    dumpMap = (joinString = '') => {
        for (let x = 0; x < this.mapData.length; x++) {
            console.log( this.mapData[x].join(joinString))
        }
    }

    checkRandoms = () => {
        for (let x = 0; x < 10; x++) {
            console.log(this.rando.intBetween(1,100))
        }
    }

}

export default BinarySpacePartitionTree
