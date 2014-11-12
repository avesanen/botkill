#!/bin/bash -e

export GOBIN=${PWD}/bin
export GOPATH=${PWD}

rm -rf bin
rm -rf pkg/linux_amd64/gomud

go get botkill
go install botkill
./test.sh
