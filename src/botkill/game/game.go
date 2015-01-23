package game

import (
	"botkill/util"
	"encoding/json"
	"github.com/apcera/nats"
	"log"
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
	g.Items = make([]*Item, 0)
	g.Players = make([]*Player, 0)
	g.Sounds = make([]string, 0)
	g.Bullets = make([]*Bullet, 0)
	g.Tiles = make([]*Tile, 0)
	g.nc.Subscribe(g.Id+".joinGame", g.subJoinGame)
	g.pubNewGame()
	return g
}

func (g *Game) subJoinGame(msg *nats.Msg) {
	log.Println("Game '" + g.Id + "' got join request: '" + string(msg.Data) + "'.")
	g.nc.Publish(msg.Reply, string(g.toJson()))
}

func (g *Game) pubNewGame() {
	log.Println("Game '" + g.Id + "' publishing new game info.")
	g.nc.Publish("newGame", g.toJson())
}

func (g *Game) toJson() []byte {
	b, err := json.Marshal(g)
	if err != nil {
		log.Println("ERROR Game '" + g.Id + "' can't marshal. Should not happen.")
		return nil
	}
	return b
}

// TODO:
func (g *Game) loadTiles(tileFile string) {}
