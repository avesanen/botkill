package aiserver

import (
	"botkill/messages"
	"bufio"
	"github.com/apcera/nats"
	//"io"
	"encoding/json"
	"log"
	"net"
	"runtime"
)

type AiServer struct {
	Id string
	nc *nats.Conn
}

func (ai *AiServer) AiMsgHandler(msg *nats.Msg) {
	log.Println("aiserver got msg:", string(msg.Data), "replying to", msg.Reply)
	ai.nc.Publish(msg.Reply, []byte("ack"))
}

func NewAiServer() *AiServer {
	ai := &AiServer{}
	runtime.SetFinalizer(ai, func(*AiServer) { log.Println("Finalized!") })

	ai.Id = "test"

	// Connect Aiserver to nats
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		log.Panicln("Can't conenct to NATS:", err.Error())
	}
	ai.nc = nc

	// Subscribe ai id to nats channel
	ai.nc.Subscribe("aiserver", ai.AiMsgHandler)
	return ai
}

func Listen() {
	// Listen on TCP port 2000 on all interfaces.
	l, err := net.Listen("tcp", ":2000")
	if err != nil {
		log.Fatal(err)
	}
	defer l.Close()
	for {
		// Wait for a connection.
		conn, err := l.Accept()
		if err != nil {
			log.Fatal(err)
		}

		// Handle the connection in a new goroutine.
		// The loop then returns to accepting, so that
		// multiple connections may be served concurrently.
		go func(c net.Conn) {
			scanner := bufio.NewScanner(c)
			for scanner.Scan() {
				line := scanner.Bytes()
				var m messages.AiMessage
				err := json.Unmarshal(line, &m)
				if err != nil {
					log.Println("Can't unmarshal game message:", err.Error())
				} else {
					log.Println(m)
					if m.Join != nil {
						log.Println("Got join message!")
					}
					if m.CreatePlayer != nil {
						log.Println("Got createPlayer message!")
					}
					if m.Action != nil {
						log.Println("Got action message!")
					}
				}
			}
			c.Close()
		}(conn)
	}
}
