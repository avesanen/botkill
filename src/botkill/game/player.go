package game

type Player struct {
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	LocationX float32   `json:"x"`
	LocationY float32   `json:"y"`
	Velocity  *Velocity `json:"velocity"`
	Weapon    *Weapon   `json:"weapon"`
}

type Weapon struct {
	Carry       float32 `json:"carry"`
	Damage      float32 `json:"damage"`
	FiringSpeed float32 `json:"firingSpeed"`
	Noise       float32 `json:"noise"`
}
