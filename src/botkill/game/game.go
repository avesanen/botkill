package game

import (
	"botkill/util"
	"github.com/apcera/nats"
)

type Game struct {
	Id           string            `json:"id"`
	Items        []*Item           `json:"items"`
	Players      []*Player         `json:"players"`
	Sounds       []string          `json:"sounds"`
	Bullets      []*Bullet         `json:"bullets"`
	Tiles        []*Tile           `json:"tiles"`
	nc           *nats.EncodedConn `json:"-"`
	gameServerId string            `json:"-"`
}

type Velocity struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

func NewGame(nc *nats.EncodedConn, gsid string) *Game {
	g := &Game{}
	g.Id = util.Uuid()
	g.nc = nc
	g.gameServerId = gsid
	g.nc.Subscribe(g.Id+".joinGame", g.subJoinGame)
	return g
}

func (g *Game) subJoinGame(msg *nats.Msg) {}
