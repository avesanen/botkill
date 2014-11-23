package aiserver

import (
	//"botkill/messages"
	"botkill/util"
	"github.com/apcera/nats"
	//"io"
	//"encoding/json"
	"log"
	"net"
)

type AiServer struct {
	Id      string            `json:"id"`
	nc      *nats.EncodedConn `json:"-"`
	AiConns []*AiConn         `json:"aiConns"`
}

func (ai *AiServer) AiMsgHandler(msg *nats.Msg) {
	log.Println("aiserver got msg:", string(msg.Data), "replying to", msg.Reply)
	ai.nc.Publish(msg.Reply, []byte("ack"))
}

func NewAiServer(nc *nats.EncodedConn) *AiServer {
	ai := &AiServer{}
	ai.nc = nc
	ai.Id = util.Uuid()

	// Subscribe ai id to nats channel
	ai.nc.Subscribe("aiserver", ai.AiMsgHandler)
	return ai
}

func (ai *AiServer) Listen(port int) {
	l, err := net.Listen("tcp", ":2000")
	if err != nil {
		log.Println("AiServer.Listen Error:", err.Error())
		return
	}
	defer l.Close()
	for {
		sc, err := l.Accept()
		if err != nil {
			log.Println("AiServer.Listen.Accept Error:", err.Error())
		}
		ac, err := NewAiConn(ai.nc)
		if err != nil {
			log.Println("Can't accept connection:", err)
			continue
		}
		ac.AiServer = ai
		go ac.HandleConnection(sc, ai.nc)
		ai.AddAiConn(ac)
	}
}

func (ai *AiServer) AddAiConn(ac *AiConn) {
	log.Println("Adding ai connection")
	ai.AiConns = append(ai.AiConns, ac)
}

func (ai *AiServer) RmAiConn(ac *AiConn) {
	log.Println("Removing ai connection")
	for i := range ai.AiConns {
		if ai.AiConns[i] == ac {
			ai.AiConns = append(ai.AiConns[:i], ai.AiConns[i+1:]...)
			return
		}
	}
}
