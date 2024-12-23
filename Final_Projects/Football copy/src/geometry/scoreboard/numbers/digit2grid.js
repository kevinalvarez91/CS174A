import { dimensions } from "../constants/constants";

const template = {
    0 : [
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1]
    ],
    1 : [
        [0,0,1,0],
        [0,1,1,0],
        [1,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [1,1,1,1]
    ],
    2 : [
        [1,1,1,1],
        [1,0,0,1],
        [0,0,0,1],
        [0,0,1,0],
        [0,1,0,0],
        [1,0,0,0],
        [1,1,1,1]
    ],
    3 : [
        [1,1,1,1],
        [1,0,0,1],
        [0,0,0,1],
        [0,1,1,0],
        [0,0,0,1],
        [1,0,0,1],
        [1,1,1,1]
    ],
    4 : [
        [1,0,0,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1],
        [0,0,0,1],
        [0,0,0,1],
        [0,0,0,1]
    ],
    5 : [
        [1,1,1,1],
        [1,0,0,0],
        [1,0,0,0],
        [1,1,1,1],
        [0,0,0,1],
        [0,0,0,1],
        [1,1,1,1]
    ],
    6 : [
        [1,1,1,1],
        [1,0,0,0],
        [1,0,0,0],
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1]
    ],
    7 : [
        [1,1,1,1],
        [0,0,0,1],
        [0,0,1,0],
        [0,1,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0]
    ],
    8 : [
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1]
    ],
    9 : [
        [1,1,1,1],
        [1,0,0,1],
        [1,0,0,1],
        [1,1,1,1],
        [0,0,0,1],
        [0,0,0,1],
        [1,1,1,1]
    ]


}
/**
 * Generates a map of scaled 2D digit arrays using linear interpolation.
 * @param {number} rows - Target number of rows.
 * @param {number} cols - Target number of columns.
 * @returns {Object} - A map of digits to scaled binary arrays.
 */
function generateDigitMap(rows, cols) {
    const scaledMap = {};

    // Loop through each digit and scale its template
    for (const digit in template) {
        const originalRows = template[digit].length;
        const originalCols = template[digit][0].length;

        // Create a scaled version of the template
        const scaledDigit = Array.from({ length: rows }, () =>
            Array(cols).fill(0)
        );

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Map scaled coordinates back to original coordinates
                const originalRow = (r / (rows - 1)) * (originalRows - 1);
                const originalCol = (c / (cols - 1)) * (originalCols - 1);

                // Find the four nearest neighbors
                const r0 = Math.floor(originalRow);
                const r1 = Math.min(r0 + 1, originalRows - 1);
                const c0 = Math.floor(originalCol);
                const c1 = Math.min(c0 + 1, originalCols - 1);

                // Compute interpolation weights
                const dr = originalRow - r0;
                const dc = originalCol - c0;

                // Interpolate using bilinear interpolation
                const value =
                    (1 - dr) * (1 - dc) * template[digit][r0][c0] +
                    (1 - dr) * dc * template[digit][r0][c1] +
                    dr * (1 - dc) * template[digit][r1][c0] +
                    dr * dc * template[digit][r1][c1];

                // Assign 1 if interpolated value is closer to 1, otherwise 0
                scaledDigit[r][c] = value >= 0.5 ? 1 : 0;
            }
        }

        scaledMap[digit] = scaledDigit;
    }

    return scaledMap;
}

// Example usage:
const digitMap = generateDigitMap(dimensions.digit.heightNum, dimensions.digit.widthNum); // Generate a map for 10 rows and 6 columns

export default digitMap;