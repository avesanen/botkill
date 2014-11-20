#BotKill

AI programming game in spirit of old top-down kill'em'all games.

## Table of Contents

**[Communication between AI and Server](#communication-between-ai-and-server)**

**[Join message validation](#join-message-validation)**

**[Create player validation](#create-player-validation)**

**[Server messages](#server-messages)**
* [JSON for visualization](#json-for-visualization)
    * [Game state message for visualization](#game-state-message)
    * [Game report message](#game-report-message)
* [JSON for AI](#json-for-ai)
    * [Game data](#game-data)
    * [Game state message for AI](#game-state-message-for-ai)
    * [Experience message](#experience-message)

**[AI messages](#ai-messages)**
* [Join message](#join-message)
* [Create player message](#create-player-message)
* [Action message](#action-message)
* [Level up message](#level-up-message)

## Communication between AI and Server

1. AI sends a [join](#join-message) message to the server
2. Server [validates](#join-message-validation) the join message
3. If message is valid, server checks if gameId was specified
    1. If gameId found (and it's awaiting for more players), select the game
    2. If gameId not found, create a new game and generate the map based on the join message data
4. Server sends the [game data](#game-data) message containing a unique visualization URL and map data for the game
5. AI sends [create player](#create-player-message) message to the server
6. Server [validates](#create-player-validation) the create player message
    1. If player is valid, append it to the game
    2. If player is not valid, send an error and close the socket.
7. Check if the game has enough teams and players (per team) joined. Wait until that.
8. When all players joined, start the game loop and send [game state data for visualization](#game-state-message) and for [AI](#game-state-message-for-ai)s
9. Receive [action](#action-message) messages from AIs. Only 1 per tick per player allowed.
10. Game/round ends when only one player alive or time ends.
11. If there are more rounds left, AIs receive an [experience](#experience-message).
12. AIs sends a [level up](#level-up-message) message with new skill points assigned.
13. New round starts (point 8.) when all players have sent a [level up](#level-up-message) message. **Invalid requests will be ignored!**
14. When the whole game ends the visualization receives a [game report](#game-report-message) message and sockets will be closed.

## Join message validation

The following points are validated:
* gameId must exist or null
* numberOfTeams must be > 1 and < 100 or null
* playersPerTeam > 0 and < 10 or null
* rainingPropability >= 0 and <= 1
* roundTime in seconds > 10 < 300
* rounds > 0 and <= 5
* darkness >= 0 and <= 1

## Create player validation
* hp + speed == 100
    * hearing + sight == 100
    * team: null OR (> 0 and <= game.numberOfTeams and game.teams[team].size < game.playersPerTeam)
* weapon
    * firingSpeed + damage == 100
    * carry + noise == 100

## Server messages

Messages sent by the server

### JSON for visualization

Messages received by visualization

#### Game state message

This will be received every tick when the game is on.

```javascript
{
    "rounds": int,                  // How many rounds there will be
    "currentRound": int,            // What is the current round
    "timeLeft": int,                // How many seconds bots have time before round ends
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
    "map": {
        "indoor": boolean,          // Indoor contains more walls and rooms, outdoor has more openings
        "raining": boolean,         // Raing gives -50% to hearing and -20% to sight
        "rainPropability": float,   // Checked once per 10 seconds. Raining might stop in 5% propability.
        "darkness": float           // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
    },
    "tiles": [
         {
             "type": int,        // To specify what sprite to draw. 0=GRASS, 1=DIRT, 2=ASPHALT
             "x": int,           // Index on x axis
             "y": int,           // Index on y axis
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

#### Game report message

This is sent to the visualization once when the whole game ends.

```javascript
{
    "scoreboard": [
        {
            "player": string,       // Player name
            "points": int           // kills, deaths, survival count
        }
    ]
}
```

### JSON for AI

Messages sent to AIs by server

#### Game data

This is received by AI when a join request is accepted

```javascript
{
    "id": string,
    "visualizationUrl:" string,     // e.g. http://botkill.com/{gameId}
    "rounds": int,                  // How many rounds there will be
    "currentRound": int,            // What is the current round
    "timeLeft": int,                // How many seconds bots have time before round ends
    "map": {
        "indoor": boolean,          // Indoor contains more walls and rooms, outdoor has more openings
        "raining": boolean,         // Raing gives -50% to hearing and -20% to sight
        "rainPropability": float,   // Checked once per 10 seconds. Raining might stop with 5% propability.
        "darkness": float           // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
    }
}
```

#### Game state message for AI

Sent from server on every tick when the game is on

```javascript
{
    "timeLeft": int,                // How many seconds left before round ends
    "myPlayer": {
        "id": string,
        "name": string,
        "x": float,                 // Tile on x-axis
        "y": float,                 // Tile on y-axis
        "velocity": vector,         // {x:float,y:float}
        "lookAt": vector,           // {x:float,y:float}
        "shootAt": vector,          // {x:float,y:float} only if player has just shoot.
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
    "players": [                    // Players that are in this AI's view area.
        {
            "id": string,
            "name": string,
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "velocity": vector,     // {x:float,y:float}
            "lookAt": vector,       // {x:float,y:float}
            "shootAt": vector,      // {x:float,y:float}
            "team": int,
            "isDead": boolean       // For AIs to figure out how many enemies left.
        }
    ],
    "map": {
        "indoor": boolean,          // Indoor contains more walls and rooms, outdoor has more openings.
        "raining": boolean,         // Raining gives -50% to hearing and -20% to sight.
        "rainPropability": float,   // Checked once per 10 seconds. Raining might stop in 5% propability.
        "darkness": float           // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
    },
    "items": [                      // Items that are in this AI's view area.
        {
            "type": int,            // To specify what sprite to draw. 0=BOX, 1=WALL, 2=TREE, 3=HOUSE etc.
            "x": int,               // Tile on x-axis.
            "y": int,               // Tile on y-axis.
            "width": float,         // Relative to tile size.
            "height": float         // e.g size 2 == 2*TILE_SIZE pixels.
        }
    ],
    "bullets": [                    // Bullets that are in this AI's view area.
        {
            "x": float,
            "y": float,
            "velocity": vector,
        }
    ],
    "sounds": [                     // Sounds that are in this AI's hearing area.
        {
            "type": int,            // 0=WALK, 1=SHOOT
            "x": float,             // Tile on x-axis.
            "y": float,             // Tile on y-axis.
            "accuracy":float        // 1-99
        }
    ]
}
```

#### Experience message

Received by AIs when a round ends and new round will start. These points may be assigned to players skills in a [level up](#level-up-message) message

```javascript
{
    "points": int       // May be distributed freely in any player or weapon skill
}
```

## AI messages

Messages that AIs should send to the server

### Join message

The first message to sent to server. Send only once per game.

```javascript
{
    "gameId": string,               // Only if player wants to join a game.
    "numberOfTeams": int,           // Only if player wants to create a game.
    "playersPerTeam": int,          // Only if player wants to create a game.
    "indoor": boolean               // Whether map is indoors or outdoors
    "raining": boolean              // Whether its raining or not. Rainings gives -50% to hearing and -20% to sight.
    "rainingPropability": float     // Chances to start raining during the game. Checked once per 10 seconds.
    "darkness": float               // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
    "roundTime": int                // Round time in seconds.
    "rounds": int                   // How many rounds before game ends
}
```

### Create player message

After [join](#join-message) message is accepted by the server and [game data](#game-data) message is received.

```javascript
{
    "name": string,
    "hp": int,                  // 1-99, counterpart: speed
    "speed": int,               // 1-99, counterpart: hp
    "sight": int,               // 1-99, counterpart: hearing
    "hearing": int              // 1-99, counterpart: sight
    "team": int,                // Omit if server can decide.
    "weapon": {
        "firingSpeed": int,     // 1-99, counterpart: damage
        "damage": int,          // 1-99, counterpart: firingSpeed
        "carry": int,           // 1-99, counterpart: noise
        "noise": int,           // 1-99, counterpart: carry
    }
}
```

### Action message

Once per tick per player. Only the first action message will be registered and applied.

```javascript
{
    "type": int,            // 0=MOVE, 1=SHOOT, 2=LOOK
    "direction": vector     // {x:float, y:float}
}
```

### Level up message

Should be sent to the server before new round starts. Only one shot - invalid level up messages will be **ignored** and all the valuable experience points will go to waste!

Experience points (0-n) may be distributed freely in any player or weapon skill.

```javascript
{
    "hp": int,                  
    "speed": int,               
    "sight": int,               
    "hearing": int              
    "weapon": {
        "firingSpeed": int,     
        "damage": int,      
        "carry": int,       
        "noise": int,       
    }
}
```
