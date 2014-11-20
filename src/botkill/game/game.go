package game

type Game struct {
	Id      string    `json:"id"`
	Items   []*Item   `json:"items"`
	Players []*Player `json:"players"`
	Sounds  []string  `json:"sounds"`
	Bullets []*Bullet `json:"bullets"`
	Tiles   []*Tile   `json:"tiles"`
}

type Velocity struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}
