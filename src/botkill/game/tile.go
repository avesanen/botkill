package game

type Tile struct {
	Type        string  `json:"type"`
	LocationX   float32 `json:"x"`
	LocationY   float32 `json:"y"`
	Blocking    bool    `json:"blocking"`
	Transparent bool    `json:"transparent"`
}
