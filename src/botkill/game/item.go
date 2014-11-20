package game

type Item struct {
	Size      float32 `json:"size"`
	Type      string  `json:"type"`
	LocationX float32 `json:"x"`
	LocationY float32 `json:"y"`
}
