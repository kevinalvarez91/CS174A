const wallDistance = 50;  
import { ballRadius } from "../geometry/ball/football";
//invisible walls(texture map with crowd)
const walls = {
    left: -wallDistance + ballRadius,
    right: wallDistance - ballRadius,
    front: -wallDistance + ballRadius,
    back: wallDistance - ballRadius
};

export default walls;