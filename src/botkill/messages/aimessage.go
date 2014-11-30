package messages

type AiMessage struct {
	Join       *JoinMessage       `json:"join,omitempty"`
	CreateGame *CreateGameMessage `json:"createGame,omitempty"`
	Action     *ActionMessage     `json:"action,omitempty"`
	Leave      *LeaveMessage      `json:"leave,omitempty"`
}

type CreateGameMessage struct {
	NumberOfTeams      int     `json:"numberOfTeams"`
	PlayerPerTeam      int     `json:"playerPerTeam"`
	Indoor             bool    `json:"indoor"`
	Raining            bool    `json:"raining"`
	RainingPropability float32 `json:"rainingProbability"`
	Darkness           float32 `json:"darkness"`
	RoundTime          int     `json:"roundTime"`
	Rounds             int     `json:"rounds"`
}

type JoinMessage struct {
	GameId  string `json:"gameId"`
	Name    string `json:"name"`
	Hp      int    `json:"hp"`
	Speed   int    `json:"speed"`
	Sight   int    `json:"sight"`
	Hearing int    `json:"hearing"`
	Team    int    `json:"team"`
	Weapon  struct {
		FiringSpeed int `json:"firingSpeed"`
		Damage      int `json:"damage"`
		Carry       int `json:"carry"`
		Noise       int `json:"noise"`
	} `json:"weapon"`
}

type LeaveMessage struct {
	PlayerId string `json:"playerId"`
}

type ActionMessage struct {
	PlayerId  string `json:"playerId"`
	Type      int    `json:"type"`
	Direction struct {
		X int `json:"x"`
		Y int `json:"y"`
	} `json:"direction"`
}
