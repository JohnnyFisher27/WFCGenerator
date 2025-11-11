import { WFCGenerator } from '../WFCGenerator.js';

const TILESET_KEY = 'tilesheet';

const TILE_IDS = {
    GRASS: 81,
    WATER: 815,
};

const WFC_RULES = {
    [TILE_IDS.GRASS]: {
        N: [TILE_IDS.GRASS, TILE_IDS.WATER], 
        E: [TILE_IDS.GRASS, TILE_IDS.WATER],
        S: [TILE_IDS.GRASS, TILE_IDS.WATER],
        W: [TILE_IDS.GRASS, TILE_IDS.WATER],
    },
    [TILE_IDS.WATER]: {
        N: [TILE_IDS.GRASS, TILE_IDS.WATER],
        E: [TILE_IDS.GRASS, TILE_IDS.WATER],
        S: [TILE_IDS.GRASS, TILE_IDS.WATER],
        W: [TILE_IDS.GRASS, TILE_IDS.WATER],
    }
};

const TILE_SIZE = 32; 
const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image(TILESET_KEY, 'assets/mapPack_tilesheet.png');
        //this.load.tilemapTiledJSON('tiles', 'assets/wfcmap.tmj');
        this.load.image('tree', 'assets/PNG/mapTile_040.png');
        this.load.image('rock', 'assets/PNG/mapTile_039.png');
    }

    create() {
        const generatedGrid = this.generatePlaceholderMap(); 

        this.map = this.make.tilemap({ 
            data: generatedGrid, 
            tileWidth: TILE_SIZE, 
            tileHeight: TILE_SIZE 
        });

        var tileset = this.map.addTilesetImage('mapPack_tilesheet', TILESET_KEY);
        
        this.map.createLayer(0, tileset, 0, 0); 

        this.placeDecorations(generatedGrid);

        this.reset = this.input.keyboard.addKey("R", false, true);
        this.add.text(
            100, 
            650, 
            'Press R to Reroll Map', 
            { 
                fontSize: '64px', 
                fill: '#fff', 
                backgroundColor: '#0008' 
            }
        ).setDepth(100); 
    

    }

    generatePlaceholderMap() {
        const grid = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            grid[y] = [];
            for (let x = 0; x < MAP_WIDTH; x++) {
                grid[y][x] = Math.random() < 0.7 ? TILE_IDS.GRASS : TILE_IDS.WATER;
            }
        }
        return grid;
    }

    placeDecorations(grid) {
        const DECORATION_CHANCE = 0.05; 

        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                
                if (grid[y][x] === TILE_IDS.GRASS) {
                    if (Math.random() < DECORATION_CHANCE) {
                        
                        const px = x * TILE_SIZE + TILE_SIZE / 2;
                        const py = y * TILE_SIZE + TILE_SIZE / 4.5;
                        
                        const decorationKey = Math.random() < 0.5 ? 'tree' : 'rock';
                        
                        this.add.image(px, py, decorationKey).setDepth(1); 
                    }
                }
            }
        }
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        
        if (this.reset.isDown) {
            this.scene.stop('Start');
            this.scene.start('Start');
        }
    }
    
}
