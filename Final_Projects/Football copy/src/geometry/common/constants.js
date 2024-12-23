class Team {
    constructor(teamColor, shirtTexture) {
        this.teamColor = teamColor;
        this.shirtTexture = shirtTexture;
    }
}

const Home = new Team(0xff0000, 'textures/homeTexture.jpg');
const Guest = new Team(0x0000ff, 'textures/guestTexture.jpeg');
const Teams = {Home, Guest};
const flashDuration = 200;

const Time = {flashDuration}
export { Teams,Time};