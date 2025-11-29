#!/bin/bash

npm i 
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/download/compact-v0.2.0/compact-installer.sh | sh
compact update 0.24.0

cd ballot-api && npm install && cd ..

cd contract && npm install  && npm run compact && npm run build && cd ..

cd ballot-cli && npm install && npm run build 

sudo docker compose -f proof-server-testnet.yml up -d 
sudo docker ps 

npm run testnet-remote

