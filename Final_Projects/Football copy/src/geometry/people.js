import { goalie as createGoalie } from './goalie/index.js';

export function createGoalies({ rowX = 0, rowY = 0, rowZ = 0, spacing = 5, count = 10,team='' } = {}) {
    const goalies = [];

    for (let i = 0; i < count; i++) {
        const goalie = createGoalie({
            position: { 
                x: rowX + i * spacing, // Adjust x position based on rowX and spacing
                y: rowY,               // Use the rowY for the y position
                z: rowZ
                
            },team
        });
        goalies.push(goalie);
    }
    return goalies;
}