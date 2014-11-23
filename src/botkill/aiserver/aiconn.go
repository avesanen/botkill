package aiserver

import (
	"botkill/messages"
	"botkill/util"
	"bufio"
	"encoding/json"
	"github.com/apcera/nats"
	"log"
	"net"
	"time"
)

type AiConn struct {
	Id       string             `json:"id"`
	AiServer *AiServer          `json:"-"`
	nc       *nats.EncodedConn  `json:"-"`
	sub      *nats.Subscription `json:"-"`
	sc       net.Conn           `json:"-"`
}

func NewAiConn(nc *nats.EncodedConn) (*AiConn, error) {
	ac := &AiConn{}
	ac.nc = nc
	ac.Id = util.Uuid()

	// Subscribe gameState for aiConnection
	sub, err := ac.nc.Subscribe(ac.Id+".gameState", ac.subGameState)
	if err != nil {
		log.Println("Error subscribing aiconnection to gamestate:", err.Error())
		return nil, err
	}
	ac.sub = sub
	return ac, nil
}

func (ac *AiConn) HandleConnection(sc net.Conn, nc *nats.EncodedConn) {
	ac.nc = nc
	ac.sc = sc
	log.Println("AiConn", ac.Id, "handling connectionhandler started")
	scanner := bufio.NewScanner(ac.sc)
	for scanner.Scan() {
		line := scanner.Bytes()
		log.Println("AiConnection \""+ac.Id+"\" got line:", string(line))

		var m *messages.AiMessage
		err := json.Unmarshal(line, &m)
		if err != nil {
			log.Println("Can't unmarshal game message:", err.Error())
		} else {
			log.Println(m)
			if m.CreateGame != nil {
				log.Println("Got createGame message!")
				ac.pubCreateGame(m)
			}
		}
	}
	ac.sc.Close()
	ac.AiServer.RmAiConn(ac)
	ac.sub.Unsubscribe()
	log.Println("AiConn", ac.Id, "handling connectionhandler stopped")
}

func (ac *AiConn) subGameState(msg *nats.Msg) {
	log.Println("Got GameState:", string(msg.Data))
}

func (ac *AiConn) pubCreateGame(msg *messages.AiMessage) {
	log.Println("AI sent createGame message:", msg.CreateGame)
	var response string
	err := ac.nc.Request("createGame", msg.CreateGame, &response, 100*time.Millisecond)
	if err != nil {
		log.Println("Error while sending createGame message to gameserver:", err)
	} else {
		log.Println(response)
		_, err := ac.sc.Write([]byte(response + "\n"))
		if err != nil {
			log.Println("Can't write to socket!")
		}
	}
}
