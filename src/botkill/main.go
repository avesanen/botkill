package main

import (
	"botkill/aiserver"
	"botkill/gameserver"
	"botkill/webserver"
	"github.com/apcera/nats"
	"log"
	"runtime"
	"time"
)

func main() {
	// Start game server
	s := webserver.NewServer("localhost", "8080")
	log.Println("Got server:", s)

	// Test aiserver nats connection
	c, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		log.Panicln("Can't connect to NATS:", err.Error())
	}
	nc, err := nats.NewEncodedConn(c, "json")
	if err != nil {
		log.Panicln("Can't craete encoded NATS connection:", err.Error())
	}

	// gameServer instance
	gs := gameserver.NewGameServer(nc)
	log.Println(gs)

	// aiServer  instance
	ai := aiserver.NewAiServer(nc)
	go ai.Listen(2000)
	log.Println(ai)

	// Loop forever and log goroutine and games counts if they change.
	goRoutines := 0
	aiConnections := 0
	games := 0
	for {
		// NATS stats debug (TODO: post to influxdb)
		//nim := c.InMsgs
		//nib := c.InBytes
		//nom := c.OutMsgs
		//nob := c.OutBytes
		//log.Println(nim, nib, nom, nob)

		time.Sleep(time.Second * 1)
		if goRoutines != runtime.NumGoroutine() {
			goRoutines = runtime.NumGoroutine()
			log.Println("Goroutines [", goRoutines, "]")
		}
		if aiConnections != len(ai.AiConns) {
			aiConnections = len(ai.AiConns)
			log.Println("AiConnections [", aiConnections, "]")
		}
		if games != len(gs.Games) {
			games = len(gs.Games)
			log.Println("Games [", games, "]")
		}
	}
}
