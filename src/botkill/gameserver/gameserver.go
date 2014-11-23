package gameserver

import (
	"botkill/game"
	"botkill/messages"
	"botkill/util"
	"github.com/apcera/nats"
	"log"
)

type GameServer struct {
	Id    string            `json:"id"`
	nc    *nats.EncodedConn `json:"-"`
	Games []*game.Game      `json:"games"`
}

func NewGameServer(nc *nats.EncodedConn) *GameServer {
	gs := &GameServer{}
	gs.Id = util.Uuid()
	gs.nc = nc

	gs.nc.QueueSubscribe("createGame", "createGame", gs.subCreateGame)
	return gs
}

func (gs *GameServer) AddGame(g *game.Game) {
	log.Println("Adding game", g.Id, "to gameserver")
	gs.Games = append(gs.Games, g)
}

func (gs *GameServer) RmGame(g *game.Game) {
	log.Println("Removing game from gameserver")
	for i := range gs.Games {
		if gs.Games[i] == g {
			gs.Games = append(gs.Games[:i], gs.Games[i+1:]...)
			return
		}
	}
}

func (gs *GameServer) subCreateGame(subj string, reply string, msg *messages.CreateGameMessage) {
	log.Println("GameServer got createGame message:", msg)
	g := game.NewGame(gs.nc, gs.Id)
	gs.AddGame(g)
	gs.nc.Publish(reply, g.Id)
}
