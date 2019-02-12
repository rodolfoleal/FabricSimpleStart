#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb cli

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
export FABRIC_START_TIMEOUT=10
#echo ${FABRIC_START_TIMEOUT}
sleep ${FABRIC_START_TIMEOUT}

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block
# Install Chaincode.
docker exec cli peer chaincode install -n cdbcc -v 1 -l node -p /opt/gopath/src/github.com/chaincode
#instantiate Chaincode
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n cdbcc -l node -v 1 -c '{"Args":["init","true"]}'


set +v
Query() {
  PEER=$1
  ORG=$2
  ARGS=$3
  setGlobals $PEER $ORG
  EXPECTED_RESULT=$4
  echo "===================== Querying on peer${PEER}.org${ORG} on channel '$CHANNEL_NAME'... with args: '$ARGS' ===================== "
  local rc=1
  local starttime=$(date +%s)
  while
    test "$(($(date +%s) - starttime))" -lt "$TIMEOUT" -a $rc -ne 0
  do
    sleep $DELAY
    echo "Attempting to Query peer${PEER}.org${ORG} ...$(($(date +%s) - starttime)) secs"
    set -x
    docker exec cli peer chaincode query -C mychannel -n cdbcc -c "$ARGS" >&log.txt
    res=$?
    set +x
  done
  echo "Query Result: $(cat log.txt)"
  echo "===================== Query successful on peer${PEER}.org${ORG} on channel $CHANNEL_NAME ===================== "
  RETURN=$(cat log.txt)


}