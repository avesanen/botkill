#BotKill

AI programming game in spirit of old top-down kill'em'all games.

## Table of Contents

**[Coordinate system](#coordinate-system)**

**[Communication between AI and Server](#communication-between-ai-and-server)**
* [Creating a game](#creating-a-game)
* [Joining a game](#joinin-a-game)
* [Game loop](#game-loop)

**[Create player validation](#create-player-validation)**

**[Server messages](#server-messages)**
* [JSON for visualization](#json-for-visualization)
   * [Game state message for visualization](#game-state-message)
   * [Game report message](#game-report-message)
* [JSON for AI](#json-for-ai)
   * [Game state message for AI](#game-state-message-for-ai)
   * [Experience message](#experience-message)
   * [Join request](#join-request-message)
   * [Round end message](#round-end-message)
   * [Game over message](#game-over-message)

**[AI messages](#ai-messages)**
* [Register message](#register-message)
* [Join message](#join-message)
* [Create player message](#create-player-message)
* [Action message](#action-message)
* [Level up message](#level-up-message)

## Coordinate system

The origin (x=0, y=0) is at the top-left corner. 

Recieved coordinates are always global. Which means that if your bot's position is at x=1, y=1, and it sees an enemy at x=1, y=10, then your bot is almost in the top-left corder and the enemy bot is 9 units straight down from your bot.

## Communication between AI and Server

### Creating a game
1. Register your team in game console at http://ai.hell.fi/team/create
2. Write down your team's (secret) botId
3. Connect the AI to backend's socket: host XXXXXXXXX, port XXXX
4. Send a [register](#register-message) message to the backend with your team's botId
5. Navigate to http://ai.hell.fi/game/create to create a game. Your AI should be visible there now.

### Joining a game
1. Start the created game by clicking "Start game" -button in the game console.
2. Backend sends a [join request](#join-request-message) message to all teams that were selected on game create
   2.1. Join request message contains useful data of the map data for the game. It's adviced to unilize this when creating your bot.
3. AI sends [create player](#create-player-message) message to the server
4. Server [validates](#create-player-validation) the create player message
    1. If player is valid, append it to the game
    2. If player is not valid, send an error and close the socket. Game won't start.
5. Check if the game has enough teams and players (per team) joined. Bots have few seconds to answer before backend gives up. 
 
### Game loop
1. When all players have joined, backend starts the game loop and sends [game state data for visualizations](#game-state-message) and for [AI](#game-state-message-for-ai)s
2. AIs can send one [action](#action-message) messages per tick per player to backend.
3. Game/round ends when only one player is alive or when time ends.
4. If there are more rounds left in the game, AIs receive an [experience](#experience-message).
5. AIs send a [level up](#level-up-message) message with new skill points assigned.
6. New round starts (point 1.) when all players have sent a [level up](#level-up-message) message. **Invalid requests will be ignored!**
7. When the whole game ends, the visualization receives a [game report](#game-report-message) message and sockets will be closed.

## Create player validation
* hp + speed == 100
* hearing + sight == 100
* weapon
    * firingSpeed + damage == 100
    * carry + noise == 100

## Server messages

Messages sent from server (backend) to AI

### JSON for visualization

Messages received by visualization

#### Game state message

This will be received every tick when the game is on.

```javascript
{
    "gamestate": {
        "rounds": int,                  // How many rounds there will be
        "currentRound": int,            // What is the current round
        "timeLeft": int,                // How many seconds bots have time before round ends
        "environemnt": int,             // 0 = CAVERN, 1 = FOREST
        "rain": float,                  // 0 - 1, 1 is total flood. Reduces hearing. 0.2 rain is 20% off from hearing.
        "darkness": float               // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
        "players": [
            "id": string,
            "name": string,
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "velocity": vector,     // {x:float,y:float}
            "lookAt": vector,       // {x:float,y:float}
            "shootAt": vector,      // {x:float,y:float} only if player just shoot
            "currentHp": int,       // 1-99
            "hp": int,              // 1-99, counterpart: speed
            "speed": int,           // 1-99, counterpart: hp
            "sight": int,           // 1-99, counterpart: hearing
            "hearing": int          // 1-99, counterpart: sight
            "team": int,
            "isHit": boolean        // If player was just hit
            "weapon": {
                "firingSpeed": int, // 1-99, counterpart: damage
                "damage": int,      // 1-99, counterpart: firingSpeed
                "carry": int,       // 1-99, counterpart: noise
                "noise": int        // 1-99, counterpart: carry
            }
        ],
        "tiles": [
             "type": int,           // To specify what sprite to draw. 0=GRASS, 1=DIRT, 2=ASPHALT
             "x": int,              // Index on x axis
             "y": int               // Index on y axis
             "hit": vector          // x,y coordinates where tile was hit
         ],
        "items": [
            "type": int,            // To specify what sprite to draw. 0=BOX, 1=WALL, 2=TREE, 3=HOUSE etc.
            "x": int,               // Tile on x-axis
            "y": int,               // Tile on y-axis
            "width": float,         // Relative to tile size
            "height": float         // e.g size 2 == 2*TILE_SIZE pixels
        ],
        "bullets": [
            "x": float,
            "y": float,
            "velocity": vector
        ],
        "sounds": [
            "type": int,            // 0=WALK, 1=SHOOT
            "x": float,             // Tile on x-axis
            "y": float,             // Tile on y-axis
            "noise":float           // 1-99
        ]
    }
}
```

#### Game report message

This is sent to the visualization once when the whole game ends.

```javascript
{
    "scoreboard": [
        "player": string,           // Player name
        "points": int               // kills, deaths, survival count
    ]
}
```

### JSON for AI

Messages sent to AIs by server

#### Game state message for AI

Sent from server on every tick when the game is on

```javascript
{
    "gamestate": {
        "timeLeft": int,                // How many seconds left before round ends
        "environemnt": int,             // 0 = CAVERN, 1 = FOREST
        "rain": float,                  // 0 - 1, 1 is total flood. Reduces hearing. 0.2 rain is 20% off from hearing.
        "darkness": float,              // 0 - 1, 1 is total darkness. Reduces sight. 0.2 darkness is 20% off from sight.
        "myPlayer": {
            "id": string,
            "name": string,
            "x": float,                 // Tile on x-axis
            "y": float,                 // Tile on y-axis
            "velocity": vector,         // {x:float,y:float}
            "lookAt": vector,           // {x:float,y:float}
            "shootAt": vector,          // {x:float,y:float} only if player has just shoot.
            "currentHp": int,           // 1-99
            "hp": int,                  // 1-99, counterpart: speed
            "speed": int,               // 1-99, counterpart: hp
            "sight": int,               // 1-99, counterpart: hearing
            "hearing": int,             // 1-99, counterpart: sight
            "team": int,
            "isHit": boolean,           // If player was just hit
            "weapon": {
                "firingSpeed": int,     // 1-99, counterpart: damage
                "damage": int,          // 1-99, counterpart: firingSpeed
                "carry": int,           // 1-99, counterpart: noise
                "noise": int,           // 1-99, counterpart: carry
            }
        },
        "players": [                    // Players that are in this AI's view area.
            "id": string,
            "name": string,
            "x": float,                 // Tile on x-axis
            "y": float,                 // Tile on y-axis
            "velocity": vector,         // {x:float,y:float}
            "lookAt": vector,           // {x:float,y:float}
            "shootAt": vector,          // {x:float,y:float}
            "team": int,
            "isDead": boolean           // For AIs to figure out how many enemies left.
        ],
        "items": [                      // Items that are in this AI's view area.
            "type": int,                // To specify what sprite to draw. 0=BOX, 1=WALL, 2=TREE, 3=HOUSE etc.
            "x": int,                   // Tile on x-axis.
            "y": int,                   // Tile on y-axis.
            "width": float,             // Relative to tile size.
            "height": float             // e.g size 2 == 2*TILE_SIZE pixels.
        ],
        "bullets": [                    // Bullets that are in this AI's view area.
            "x": float,
            "y": float,
            "velocity": vector
        ],
        "sounds": [                     // Sounds that are in this AI's hearing area.
            "type": int,                // 0=WALK, 1=SHOOT
            "x": float,                 // Tile on x-axis.
            "y": float,                 // Tile on y-axis.
            "accuracy":float            // 1-99
        ]
    }
}
```

#### Experience message

Received by AIs when a round ends and new round will start. These points may be assigned to players skills in a [level up](#level-up-message) message

```javascript
{
    "experience": {
        "points": int       // May be distributed freely in any player or weapon skill
    }
}
```

### Join request message

Sent by server to AIs that are awaiting to join a game.

```javascript
{ 
    "joinrequest": {
        "gameId": string,               // Where the player is asked to join to.
        "gameMode": string,             // DUEL, DEATHMATCH, TEAM
        "playerCount": int,             // How many bots are participating in this game
        "rounds": int,                  // How many rounds there will be
        "roundTime": int,               // How many seconds bots have time before round ends
        "environment": int,             // 0=CAVERN, 1=FOREST. Caverns are more labyrithine, outdoors has more openings
        "rain": float,                  // 0 - 1, 1 is total flood. 0.2 rain is 20% off from hearing.
        "darkness": float               // 0 - 1, 1 is total darkness. 0.2 darkness is 20% off from sight.
    }
}
```

### Round end message

Sent by server to AIs when a round ends. AIs may clean up their data when this occurs.

```javascript
{ 
    "roundend": {}
}
```

### Game over message

Sent by server to AIs when the game ends. Not just a round but the whole game. It's a sign to end game loop thread.

```javascript
{ 
    "gameover": {}
}
```

## AI messages

Messages that AIs should send to the server

### Register message

Retrieve your team's secret password by registering a team at http://ai.hell.fi/team/create.

```javascript
{
    "register": {
        "botId": string                // Don't share this id to anyone else
    }
}
```

### Join message

The first message to sent to server. Send only once per game.

```javascript
{ 
    "join": {
        "gameId": string,               // Only if player wants to join a game.
    }
}
```

### Create player message

After [join](#join-message) message is accepted by the server and [game data](#game-data) message is received.

```javascript
{
    "createplayer": {
        "name": string,
        "hp": int,                  // 1-99, counterpart: speed
        "speed": int,               // 1-99, counterpart: hp
        "sight": int,               // 1-99, counterpart: hearing
        "hearing": int              // 1-99, counterpart: sight
        "weapon": {
            "firingSpeed": int,     // 1-99, counterpart: damage
            "damage": int,          // 1-99, counterpart: firingSpeed
            "carry": int,           // 1-99, counterpart: noise
            "noise": int,           // 1-99, counterpart: carry
        }
    }
}
```

### Action message

Once per tick per player. Only the first action message will be registered and applied.

```javascript
{
    "action": {
        "type": int,            // 0=MOVE, 1=SHOOT, 2=LOOK
        "direction": vector     // {x:float, y:float}
    }
}
```

### Level up message

Should be sent to the server before new round starts. Only one shot - invalid level up messages will be **ignored** and all the valuable experience points will go to waste!

Experience points (0-n) may be distributed freely in any player or weapon skill.

```javascript
{
    "levelup": {
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
}
```
