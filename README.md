# 2D Dungeon Generator

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Download the repository via the cmd:

#### `git clone git@github.com:lgilders/dungeon-generator-v4.git`

In the project directory via terminal, run:

#### `npm install`

Runs the installation of the app's dependencies.\

#### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make code changes.\
You may also see any lint errors in the console.


## Making a 2D Dungeon

The app begins with default values provided for the following input options:
- Map Width
- Map Height
- Partition Minimum Width
- Partition Minimum Height
- Room Minimum Width
- Room Minimum Height
- Seed

Click the Generate a Dungeon! button to see your new dungeon layout.

Note: Partition refers to the space partition / division of the map's size. See the Resources below for details.

Warning: If you provide a series of options that clash, then a default value will be substituted instead.

## Resources

### Space Partitioning

The binary space partitioning tree [implementation](https://www.pcgbook.com/chapter03.pdf)
follows the algorithm given in the book [Procedural Content Generation in Games](https://www.pcgbook.com/)

### JavaScript Binary Tree

The binary tree [implementation](https://www.30secondsofcode.org/js/s/data-structures-binary-tree/) comes from the work of Angelos Chalaris.

## TODO

Thoroughly cover buildRooms and slicePartitions with unit tests.

Convert dungeon display to graphical version using tile sets with controllable orthographic camera.