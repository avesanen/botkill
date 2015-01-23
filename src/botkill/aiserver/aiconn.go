package aiserver

import (
	"botkill/messages"
	"botkill/util"
	"bufio"
	"encoding/json"
	"github.com/apcera/nats"
	"log"
	"net"
	"sync"
	"time"
)

// AiConn is a struct for one ai-connection through socket.
type AiConn struct {
	Id        string             `json:"id"`
	AiServer  *AiServer          `json:"-"`
	nc        *nats.EncodedConn  `json:"-"`
	sub       *nats.Subscription `json:"-"`
	sc        net.Conn           `json:"-"`
	outbound  chan *nats.Msg     `json:"-"`
	writeLock *sync.Mutex        `json:"-"`
}

// NewAiConn will return a new AiConn, takes a EncodedConn as parameter,
func NewAiConn(nc *nats.EncodedConn) (*AiConn, error) {
	ac := &AiConn{}
	ac.nc = nc
	ac.Id = util.Uuid()
	ac.writeLock = &sync.Mutex{}
	ac.outbound = make(chan *nats.Msg)

	// Subscribe gameState for aiConnection
	sub, err := ac.nc.Subscribe(ac.Id+".gameState", ac.subGameState)
	if err != nil {
		log.Println("Error subscribing aiconnection to gamestate:", err.Error())
		return nil, err
	}
	ac.sub = sub
	return ac, nil
}

// HandleConnection will handle socket connections and messages coming in and out.
func (ac *AiConn) HandleConnection(sc net.Conn, nc *nats.EncodedConn) {
	log.Println("AiConn '" + ac.Id + "' connection handler starting.")
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
			if m.CreateGame != nil {
				ac.pubCreateGame(m.CreateGame)
			} else if m.Join != nil {
				ac.pubJoin(m.Join)
			} else if m.Action != nil {
				ac.pubAction(m.Action)
			} else if m.Leave != nil {
				ac.pubLeave(m.Leave)
			} else {
				log.Println("AI message type not indentified.")
			}
		}
	}
	ac.sc.Close()
	ac.AiServer.RmAiConn(ac)
	ac.sub.Unsubscribe()
	log.Println("AiConn '" + ac.Id + "' connection handler stopped.")
}

// write will write []byte to AiConn.sc with lock, so we don't get corrupted messages with overlapping writes
func (ac *AiConn) write(b []byte) error {
	ac.writeLock.Lock()
	if _, err := ac.sc.Write(b); err != nil {
		return err
	}
	if _, err := ac.sc.Write([]byte("\n")); err != nil {
		return err
	}
	ac.writeLock.Unlock()
	return nil
}

// subGameState subscribes to gamestate messages with address "<AiConn.Id>.gameState"
func (ac *AiConn) subGameState(msg *nats.Msg) {
	log.Println("AiConn '" + ac.Id + "' got GameState.")
	log.Println("Got GameState:", string(msg.Data))
	if err := ac.write(msg.Data); err != nil {
		log.Println("AiConn '" + ac.Id + "' subGameState write error: '" + err.Error() + "'.")
		return
	}
}

// pubCreateGame publishes messages coming to socket to address "createGame"
func (ac *AiConn) pubCreateGame(msg *messages.CreateGameMessage) {
	log.Println("AiConn '" + ac.Id + "' got createGame message from AI.")
	var response string
	err := ac.nc.Request("createGame", msg, &response, 1000*time.Millisecond)
	if err != nil {
		log.Println("Error while sending createGame message to gameserver:", err)
	} else {
		log.Println(response)
		_, err := ac.sc.Write([]byte(response))
		if err != nil {
			log.Println("Can't write to socket!")
		}
	}
}

// {"join":{"gameId":"ef7cc7f7-7a06-4025-805b-b2df34dc0aa2"}}
func (ac *AiConn) pubJoin(msg *messages.JoinMessage) {
	log.Println("AiConn '" + ac.Id + "' got joinGame message from AI.")
	var response string
	err := ac.nc.Request(msg.GameId+".joinGame", msg, &response, 1000*time.Millisecond)
	if err != nil {
		log.Println("ERROR AiConn '" + ac.Id + "' can't send joinGame message: " + err.Error())
	} else {
		_, err := ac.sc.Write([]byte(response))
		if err != nil {
			log.Println("Can't write to socket!")
		}
	}
}

func (ac *AiConn) pubLeave(msg *messages.LeaveMessage) {
	log.Println("AiConn '" + ac.Id + "' got leaveGame message from AI.")
	var response string
	err := ac.nc.Request(msg.PlayerId+".leaveGame", msg, &response, 1000*time.Millisecond)
	if err != nil {
	} else {
		log.Println(response)
		_, err := ac.sc.Write([]byte(response))
		if err != nil {
			log.Println("Can't write to socket!")
		}
	}
}

func (ac *AiConn) pubAction(msg *messages.ActionMessage) {
	log.Println("AiConn '" + ac.Id + "' got action message from AI.")
	var response string
	err := ac.nc.Request(msg.PlayerId+".action", msg, &response, 1000*time.Millisecond)
	if err != nil {
	} else {
		log.Println(response)
		_, err := ac.sc.Write([]byte(response))
		if err != nil {
			log.Println("Can't write to socket!")
		}
	}
}
