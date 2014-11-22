package main

import (
	"botkill/aiserver"
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

	// aiserver test
	ai := aiserver.NewAiServer()
	log.Println(ai)

	// Test aiserver nats connection
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		log.Panicln("Can't connect to NATS:", err.Error())
	}

	msg, err := nc.Request("aiserver", []byte("pls ack"), 10*time.Millisecond)
	if err != nil {
		log.Panicln("Can't get ack from aiserver", err.Error())
	}
	log.Println("Response from aiserver:", string(msg.Data))

	go aiserver.Listen()

	// Loop forever and log goroutine and games counts if they change.
	goRoutines := 0
	for {
		time.Sleep(time.Second * 1)
		if goRoutines != runtime.NumGoroutine() {
			goRoutines = runtime.NumGoroutine()
			log.Println("Goroutines [", goRoutines, "]")
		}
	}
}
