#!/bin/bash -e

export GOBIN=${PWD}/bin
export GOPATH=${PWD}

go test botkill -v
go test botkill/game -v
go test botkill/aiserver -v
go test botkill/webserver -v

