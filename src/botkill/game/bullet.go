package game

type Bullet struct {
	PlayerId  string    `json:"playerId"`
	LocationX float32   `json:"x"`
	LocationY float32   `json:"y"`
	Velocity  *Velocity `json:"velocity"`
	Damage    float32   `json:"dmg"`
}
