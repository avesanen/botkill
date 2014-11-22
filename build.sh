#!/bin/bash

export GOBIN=`pwd`/bin
export GOPATH=`pwd`

rm -rf bin
rm -rf pkg/linux_amd64/gomud

go get botkill
go get botkill/game
go get botkill/aiserver
go get botkill/webserver

go build botkill
#./test.sh
