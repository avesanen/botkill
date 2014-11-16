package main

import (
	"botkill/webserver"
	"log"
	"runtime"
	"time"
)

func main() {
	// Start game server
	s := webserver.NewServer("localhost", "8080")
	log.Println("Got server:", s)
	// Loop forever and log goroutine and games counts if they change.
	goRoutines := 0
	//games := -1
	for {
		time.Sleep(time.Second * 1)
		if goRoutines != runtime.NumGoroutine() {
			goRoutines = runtime.NumGoroutine()
			log.Println("Goroutines [", goRoutines, "]")
		}
	}
}
