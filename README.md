botkill
=======

AI programming game in spirit of old top-down kill'em'all games.

## json for visualization
    ```javascript
    {
        "players": [
            {
                "id": string,
                "name": string,
                "x": float,             // Tile on x-axis
                "y": float,             // Tile on y-axis
                "velocity": vector,     // {x:float,y:float}
                "hp": int,              // 1-99, counterpart: speed
                "speed": float,         // 1-99, counterpart: hp
                "sight": float,         // 1-99, counterpart: hearing
                "hearing": float        // 1-99, counterpart: sight
                "team": int,
                "state": int,           // 0=STAND, 1=RUN, 2=HIT, 3=SHOOT
                "weapon": {
                    "firingSpeed": float,// 1-99, counterpart: damage
                    "damage": int,      // 1-99, counterpart: firingSpeed
                    "carry": float,     // 1-99, counterpart: noise
                    "noise": float,     // 1-99, counterpart: carry
                }
            }
        ],
        "tiles": [
            {
                "type": int,            // To specify what sprite to draw. 0=GRASS, 1=DIRT, 2=ASPHALT
                "x": int,               // Index on x axis
                "y": int,               // Index on y axis
            }
        ],
        "items": [
            {
                "type": int,            // To specify what sprite to draw. 0=BOX, 1=WALL, 2=TREE, 3=HOUSE etc.
                "x": int,               // Tile on x-axis
                "y": int,               // Tile on y-axis
                width: float,           // Relative to tile size
                height: float           // e.g size 2 == 2*TILE_SIZE pixels
            }
        ],
        "bullets": [
            {
                "x": float,
                "y": float,
                "velocity": vector,
            }
        ],
        "sounds": [
            {
                "type": int,            // 0=WALK, 1=SHOOT
                "x": float,             // Tile on x-axis
                "y": float,             // Tile on y-axis
                "noise":float           // 1-99
            }
        ]
    }

    ```
