import { createGoalies } from './people.js';

export function addCrowd(scene, createGoalies) {
    const baseYL = 3;     
    const baseZL = -50;
    const baseZR = 50;   
    const count = 13;    
    const spacing = 3; 

    for (let i = 0; i < 10; i++) {
        const rowY = baseYL + i * 1.2;  
        const rowZ = baseZL - i * 2.5;
        const rowX = i % 2 === 0 ? -40.5 : -40.5 + 1 * 1.5; 
        const rowCount = i % 2 === 0 ? count : count - 1;
        const goalies = createGoalies({ rowX, rowY, rowZ, spacing, count: rowCount ,team:'guest'});
        goalies.forEach(goalie => {
            scene.add(goalie);
        });
    }

    for (let i = 0; i < 10; i++) {
        const rowY = baseYL + i * 1.2;  
        const rowZ = baseZL - i * 2.5;
        const rowX = i % 2 === 0 ? 4.5 : 4.5 + 1 * 1.5; 
        const rowCount = i % 2 === 0 ? count : count - 1;
        const goalies = createGoalies({ rowX, rowY, rowZ, spacing, count: rowCount,team:'guest' });
        goalies.forEach(goalie => {
            scene.add(goalie);
        });
    }

    for (let i = 0; i < 10; i++) {
        const rowY = baseYL + i * 1.2;  
        const rowZ = baseZR + i * 2.5;
        const rowX = i % 2 === 0 ? 4.5 : 4.5 + 1 * 1.5; 
        const rowCount = i % 2 === 0 ? count : count - 1;

        const goalies = createGoalies({ rowX, rowY, rowZ, spacing, count: rowCount ,team:'home'});
        goalies.forEach(goalie => {
            goalie.rotation.y = Math.PI; 
            scene.add(goalie);
        });
    }

    for (let i = 0; i < 10; i++) {
        const rowY = baseYL + i * 1.2;  
        const rowZ = baseZR + i * 2.5;
        const rowX = i % 2 === 0 ? -40.5 : -40.5 + 1 * 1.5;
        const rowCount = i % 2 === 0 ? count : count - 1;
        const goalies = createGoalies({ rowX, rowY, rowZ, spacing, count: rowCount ,team:'home'});
        goalies.forEach(goalie => {
            goalie.rotation.y = Math.PI; // Rotate 180 degrees around the Y-axis
            scene.add(goalie);
        });
    }
}
