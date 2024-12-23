import * as THREE from 'three';
import finalBackPlate from './board/backplate'
import BorderLights from './lighting/borderLights';
import digitPlatesGroup, { lights } from './numbers/numberPlate';
import textGroup from './text/text';
import digitMap from './numbers/digit2grid';
import { Teams, Time } from '../common/constants';

// Extend THREE.Group to include scoreboard functionality
class ScoreBoard extends THREE.Group {
    constructor() {
        super();

        // Add all components to the scoreboard group
        this.add(finalBackPlate);

        // Create and add border lights as a property
        this.borderLights = new BorderLights();
        this.add(this.borderLights);

        this.add(digitPlatesGroup);
        this.add(textGroup);

        // Raise the scoreboard by 10 meters in the Y-axis
        this.position.y += 10;

        // Attach lights object for easier grid management
        this.lights = lights;

        // Initialize the score property
        this.score = { home: 0, guest: 0 };
        this.updateScore(0, 0);
    }

    /**
     * Updates the score displayed on the scoreboard if it has changed.
     * Flashes the border lights for the team whose score changed.
     * @param {number} homeScore - The score for the home team (0-99).
     * @param {number} guestScore - The score for the guest team (0-99).
     */
    updateScore(homeScore, guestScore) {
        // Check if scores are valid (0-99); reset to 0 if invalid
        if (homeScore > 99 || guestScore > 99) {
            console.warn('Scores exceeded 99. Resetting both scores to 0.');
            homeScore = 0;
            guestScore = 0;
        }

        // Detect score changes
        const homeScoreChanged = homeScore !== this.score.home;
        const guestScoreChanged = guestScore !== this.score.guest;

        // Update the score property
        this.score.home = homeScore;
        this.score.guest = guestScore;

        // Split scores into digits
        const homeLeftDigit = Math.floor(homeScore / 10);
        const homeRightDigit = homeScore % 10;
        const guestLeftDigit = Math.floor(guestScore / 10);
        const guestRightDigit = guestScore % 10;


        // Update home score grids
        if (this.lights.home.left) {
            this.lights.home.left.updateDigit(digitMap[homeLeftDigit]);
        } else {
            console.error('Home Left Grid is not properly initialized.');
        }

        if (this.lights.home.right) {
            this.lights.home.right.updateDigit(digitMap[homeRightDigit]);
        } else {
            console.error('Home Right Grid is not properly initialized.');
        }

        // Update guest score grids
        if (this.lights.guest.left) {
            this.lights.guest.left.updateDigit(digitMap[guestLeftDigit]);
        } else {
            console.error('Guest Left Grid is not properly initialized.');
        }

        if (this.lights.guest.right) {
            this.lights.guest.right.updateDigit(digitMap[guestRightDigit]);
        } else {
            console.error('Guest Right Grid is not properly initialized.');
        }

        // Flash border lights if the score changes
        if (homeScoreChanged) {
            this.borderLights.flash(this.borderLights.leftLightsGroup, Teams.Home.teamColor, 4.0, Time.flashDuration); // Flash home lights
        }
        if (guestScoreChanged) {
            this.borderLights.flash(this.borderLights.rightLightsGroup, Teams.Guest.teamColor, 4.0, Time.flashDuration); // Flash guest lights
        }
    }
}

// Create an instance of the ScoreBoard class
const scoreBoard = new ScoreBoard();
scoreBoard.position.set(0, 25, -75);
// Export the ScoreBoard instance
export default scoreBoard;
