import * as THREE from 'three';
import LightBox from './numberLight';

// Class to manage a grid of LightBoxes
class LightBoxGrid {
    constructor({ xStart, xEnd, yStart, yEnd, rows, columns, boxConfig, innerSpacing }) {
        this.group = new THREE.Group();
        this.rows = rows;
        this.columns = columns;

        // Calculate dimensions
        const totalWidth = xEnd - xStart;
        const totalHeight = yStart - yEnd;
        const boxWidth = (totalWidth - (columns - 1) * innerSpacing) / columns;
        const boxHeight = (totalHeight - (rows - 1) * innerSpacing) / rows;

        this.lights = Array.from({ length: rows }, () => Array(columns).fill(null));

        // Create grid
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const x = xStart + col * (boxWidth + innerSpacing) + boxWidth / 2;
                const y = yStart - row * (boxHeight + innerSpacing) - boxHeight / 2;
                const z = 0;

                const lightBox = new LightBox({ ...boxConfig, width: boxWidth, height: boxHeight });
                this.lights[row][col] = lightBox;
                lightBox.getObject().position.set(x, y, z);
                this.group.add(lightBox.getObject());
            }
        }
    }

    // Method to update the grid based on a digit template
    updateDigit(template) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if(template[row][col] ){
                    this.lights[row][col].turnOn();
                }else{
                    this.lights[row][col].turnOff();
                }
            }
        }
    }

    getObject() {
        return this.group;
    }
}

export default LightBoxGrid;
