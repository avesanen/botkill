package webserver

import (
	//"github.com/apcera/nats"
	"botkill/messages"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
)

const (
	writeWait  = 10 * time.Second
	readWait   = 10 * time.Second
	pingPeriod = (readWait * 9) / 10
)

func (webserver *WebServer) websocketHandler(w http.ResponseWriter, r *http.Request) {
	defer func() {
		log.Println("WebSocketHandler DONE!")
	}()
	// Get gameId from mux vars
	vars := mux.Vars(r)
	gameId := vars["gameId"]
	log.Print("New websocket request on '", gameId, "'.")

	// Only get requests
	if r.Method != "GET" {
		log.Println("Not GET")
		return
	}

	/*/ Force same origin policy
	if r.Header.Get("Origin") != "http://"+r.Host {
		log.Println("Origin not allowed")
		http.Error(w, "Origin not allowed", 403)
		return
	}//*/

	// Try to init websocket connection
	c, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		log.Println("Not websocket handshake")
		return
	} else if err != nil {
		log.Println(err)
		http.Error(w, "Server Error", 500)
		log.Println(err.Error())
		return
	}

	// Create new WebsocketConn and feed gamestate subscription to it
	wc := NewWebsocketConn(gameId)
	log.Println("webserver.nc:", webserver.nc)

	sub, err := webserver.nc.Subscribe("gamestate."+gameId, func(m *messages.GameStateMessage) {
		wc.GamestateIn <- m
	})
	if err != nil {
		log.Println("Can't subscribe gamestate to websocket:", err.Error())
	}

	// Pass handle responsibility to socketconn
	wc.handle(c)

	// Disconnected, unsubscribe and close everything.
	sub.Unsubscribe()
}

type WebsocketConn struct {
	GameId      string
	GamestateIn chan *messages.GameStateMessage
	Outbound    chan []byte
	Inbound     chan []byte
	ws          *websocket.Conn
}

func NewWebsocketConn(gameId string) *WebsocketConn {
	c := &WebsocketConn{}
	c.GameId = gameId
	c.GamestateIn = make(chan *messages.GameStateMessage)
	c.Outbound = make(chan []byte)
	c.Inbound = make(chan []byte)
	return c
}

func (c *WebsocketConn) handle(wsc *websocket.Conn) {
	log.Println("Handling...")
	c.ws = wsc
	go c.reader()
	go c.writer()
	for {
		select {
		case m, ok := <-c.Inbound:
			if !ok {
				break
			}
			log.Println("Inbound ws:", m)
		case m, ok := <-c.GamestateIn:
			if !ok {
				break
			}
			log.Println("Gamestate in:", m)
		}
	}
}

// reader is started as a routine, it will continue to read data from
// websocket connection and sends it to the connections inbound channel
// as strings
func (c *WebsocketConn) reader() {
	log.Print("connection reader gorouting starting.")
	defer func() {
		log.Print("connection reader gorouting stopping.")
		// Close in and outbound channels to message listening goroutines
		// that this connection has closed
		close(c.Inbound)
		c.ws.Close()
	}()
	c.ws.SetPongHandler(func(string) error {
		c.ws.SetReadDeadline(time.Now().Add(writeWait))
		return nil
	})
	c.ws.SetReadDeadline(time.Now().Add(readWait))
	for {
		_, message, err := c.ws.ReadMessage()
		if err != nil {
			break
		}
		c.Inbound <- message
	}
}

// Write message as byte array to connection, with messagetype
func (c *WebsocketConn) write(mt int, payload []byte) error {
	//log.Print("connection.write() called")
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// Routine to continue to write from outbound channel to websocket
// connection. Will close outbound channel when closed.
func (c *WebsocketConn) writer() {
	log.Print("connection writer gorouting starting.")
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		log.Print("connection writer gorouting stopping.")
		ticker.Stop()
		close(c.Outbound)
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.Outbound:
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				log.Println("[connection.writePump] !ok.")
				return
			}
			if err := c.write(websocket.TextMessage, []byte(message)); err != nil {
				log.Println("[connection.writePump] err: '", err, "'.")
				return
			}
		case <-ticker.C:
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				log.Println("[connection.writePump] ticker err: '", err, "'.")
				log.Println("ping")
				return
			}
		}
	}
}
