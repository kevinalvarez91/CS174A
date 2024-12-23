import { floor } from "../geometry/pitch/floor";
import scoreBoard from "../geometry/scoreboard";

class Game {
    #homeScore;
    #guestScore;
    #floor;
    #scoreboard;

    constructor() {
        if (Game.instance) {
            return Game.instance;
        }

        this.#homeScore = 0;
        this.#guestScore = 0;
        this.#floor = floor;
        this.#scoreboard = scoreBoard;

        Game.instance = this;
    }

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    score(team) {
        if (team === 'home') {
            this.#homeScore = (this.#homeScore + 1) % 100;
        } else if (team === 'guest') {
            this.#guestScore = (this.#guestScore + 1) % 100;
        }
        this.updateScoreboard(team);
    }

    updateScoreboard(team) {
        this.#floor.updateScore(team);
        this.#scoreboard.updateScore(this.#homeScore, this.#guestScore);
    }
}

const game = Game.getInstance();
export default game;