export class WFCGenerator {
    constructor(width, height, tiles, rules) {
        this.width = width;
        this.height = height;
        this.tiles = tiles; 
        this.rules = rules;
        
        this.grid = Array(height).fill(0).map(() => Array(width).fill([...tiles])); 
    }

    findLowestEntropyCell() {
        let lowestEntropy = Infinity;
        let bestCell = null;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const entropy = this.grid[y][x].length;
                if (entropy > 1 && entropy < lowestEntropy) {
                    lowestEntropy = entropy;
                    bestCell = {x, y};
                }
            }
        }
        return bestCell;
    }

    collapse(cell) {
        const possibilities = this.grid[cell.y][cell.x];
        if (possibilities.length > 0) {
            const chosenTile = possibilities[Math.floor(Math.random() * possibilities.length)];
            this.grid[cell.y][cell.x] = [chosenTile];
            return chosenTile;
        }
        return null;
    }
    propagate(cell) {
        const stack = [cell];

        while (stack.length > 0) {
            const current = stack.pop();

            const neighbors = [
                { dx: 0, dy: -1, direction: 'N', opposite: 'S' },
                { dx: 1, dy: 0, direction: 'E', opposite: 'W' },  
                { dx: 0, dy: 1, direction: 'S', opposite: 'N' },
                { dx: -1, dy: 0, direction: 'W', opposite: 'E' } 
            ];

            for (const neighbor of neighbors) {
                const nx = current.x + neighbor.dx;
                const ny = current.y + neighbor.dy;

                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    let changed = false;
                    const neighborPossibilities = this.grid[ny][nx];

                    if (this.grid[current.y][current.x].length === 1) {
                        const collapsedTile = this.grid[current.y][current.x][0];
                        const allowedTiles = this.rules[collapsedTile][neighbor.direction] || [];
                        
                        const newPossibilities = neighborPossibilities.filter(neighborTile => {
                            return allowedTiles.includes(neighborTile);
                        });

                        if (newPossibilities.length < neighborPossibilities.length) {
                            this.grid[ny][nx] = newPossibilities;
                            changed = true;
                        }

                    }
                    
                    if (changed) {
                        if (this.grid[ny][nx].length === 0) {
                             throw new Error("restart");
                        }
                        stack.push({ x: nx, y: ny });
                    }
                }
            }
        }
    }


    generate() {
        while (true) {
            const cellToCollapse = this.findLowestEntropyCell();

            if (!cellToCollapse) {
                break;
            }

            try {
                this.collapse(cellToCollapse);
                this.propagate(cellToCollapse);
            } catch (e) {
                this.grid = Array(this.height).fill(0).map(() => Array(this.width).fill([...this.tiles]));
                continue; 
            }
        }
        
        return this.grid.map(row => row.map(cell => cell[0] || 0)); 
    }
}