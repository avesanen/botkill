botkill
=======

AI programming game in spirit of old top-down kill'em'all games.

## JSON for visualization
```javascript
{
    "players": [
        {
            "id": string,
            "name": string,
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "velocity": vector,     // {x:float,y:float}
            "lookAt": vector,       // {x:float,y:float}
            "shootAt": vector,      // {x:float,y:float} only if player just shoot
            "currentHp": int,       // 1-99
            "maxHp": int,           // 1-99, counterpart: speed
            "speed": int,           // 1-99, counterpart: hp
            "sight": int,           // 1-99, counterpart: hearing
            "hearing": int          // 1-99, counterpart: sight
            "team": int,
            "isHit": boolean        // If player was just hit
            "weapon": {
                "firingSpeed": int, // 1-99, counterpart: damage
                "damage": int,      // 1-99, counterpart: firingSpeed
                "carry": int,       // 1-99, counterpart: noise
                "noise": int,       // 1-99, counterpart: carry
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
            "width": float,         // Relative to tile size
            "height": float         // e.g size 2 == 2*TILE_SIZE pixels
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

## JSON for AI
```javascript
{
    "myPlayer": {
        "id": string,
        "name": string,
        "x": float,                 // Tile on x-axis
        "y": float,                 // Tile on y-axis
        "velocity": vector,         // {x:float,y:float}
        "lookAt": vector,           // {x:float,y:float}
        "shootAt": vector,          // {x:float,y:float} only if player just shoot
        "currentHp": int,           // 1-99
        "maxHp": int,               // 1-99, counterpart: speed
        "speed": int,               // 1-99, counterpart: hp
        "sight": int,               // 1-99, counterpart: hearing
        "hearing": int              // 1-99, counterpart: sight
        "team": int,
        "isHit": boolean            // If player was just hit
        "weapon": {
            "firingSpeed": int,     // 1-99, counterpart: damage
            "damage": int,          // 1-99, counterpart: firingSpeed
            "carry": int,           // 1-99, counterpart: noise
            "noise": int,           // 1-99, counterpart: carry
        }
    },
    "players": [                    // Players that are in this AI's view area
        {
            "id": string,
            "name": string,
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "velocity": vector,     // {x:float,y:float}
            "lookAt": vector,       // {x:float,y:float}
            "shootAt": vector,      // {x:float,y:float}
            "team": int,
            "isDead": boolean       // For AIs to figure out how many enemies left
        }
    ],
    "tiles": [                      // Tiles that are in this AI's view area
        {
            "type": int,            // To specify what sprite to draw. 0=GRASS, 1=DIRT, 2=ASPHALT
            "x": int,               // Index on x axis
            "y": int,               // Index on y axis
        }
    ],
    "items": [                      // Items that are in this AI's view area
        {
            "type": int,            // To specify what sprite to draw. 0=BOX, 1=WALL, 2=TREE, 3=HOUSE etc.
            "x": int,               // Tile on x-axis
            "y": int,               // Tile on y-axis
            "width": float,         // Relative to tile size
            "height": float         // e.g size 2 == 2*TILE_SIZE pixels
        }
    ],
    "bullets": [                    // Bullets that are in this AI's view area
        {
            "x": float,
            "y": float,
            "velocity": vector,
        }
    ],
    "sounds": [                     // Sounds that are in this AI's hearing area
        {
            "type": int,            // 0=WALK, 1=SHOOT
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "accuracy":float        // 1-99
        }
    ]
}

```

## Game communication between AI and Server

1. AI sends **join** message to the server
3. Server validates **player** object from the message
2. If player is valid, server checks if gameID was specified
    1. If gameID found (and it's awaiting players), select the game and append player into that game
    2. If gameID not found, create a new game and append player into that game
3. Send the unique visualization URL for the game
4. Check if the game has enough teams and players (per team) joined. Wait until that.
5. When all players joined, start the game loop and send the above JSON data for visualization and AIs
6. Receive the following messages from AIs. Only 1 per tick.
    * Move
    * Shoot
    * Look

## AI messages

### Join message
```javascript
{
    "gameId": string,               // Only if player wants to join a game
    "numberOfTeams": int            // Only if player wants to create a game
    "playersPerTeam": int           // Only if player wants to create a game
    "player": {
        "name": string,
        "hp": int,                  // 1-99, counterpart: speed
        "speed": int,               // 1-99, counterpart: hp
        "sight": int,               // 1-99, counterpart: hearing
        "hearing": int              // 1-99, counterpart: sight
        "team": int,
        "weapon": {
            "firingSpeed": int,     // 1-99, counterpart: damage
            "damage": int,          // 1-99, counterpart: firingSpeed
            "carry": int,           // 1-99, counterpart: noise
            "noise": int,           // 1-99, counterpart: carry
        }
    },

}

```

### Action message
```javascript
{
    "type": int,            // 0=MOVE, 1=SHOOT, 2=LOOK
    "direction": vector     // {x:float, y:float}
}
```