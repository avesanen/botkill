package game

type Sound struct {
	Type      string  `json:"type"`
	Accuracy  float32 `json:"accuracy"`
	Noise     float32 `json:"noise"`
	LocationX float32 `json:"x"`
	LocationY float32 `json:"y"`
}
