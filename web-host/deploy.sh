#!/usr/bin/env bash
set -e
set -o pipefail

baseIP="46.101.106.7"
password="SG83haaZX"
dockerImage="qprocky/jee"

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

function shutDownServices() {
  echo "${green}shutdown services...${reset}"
  sshpass -p $password ssh root@$baseIP 'docker-compose -f /home/docker-compose.yaml down'  
}

function removeImages() {
  echo "${green}removing images...${reset}"
  sshpass -p $password ssh root@$baseIP "docker image rm $dockerImage"
}

function buildImages() {
  echo "${green}building images...${reset}"
  docker build -t $dockerImage .
}

function pushImages() {
  echo "${green}pushing images...${reset}"
  docker push $dockerImage
}

function copyDockerComposeFiles() {
  echo "${green}copying docker-compose...${reset}"
  sshpass -p $password scp docker-compose.yaml root@$baseIP:/home/docker-compose.yaml
}

function startServices() {
  echo "${green}starting docker-compose...${reset}"
  sshpass -p $password ssh root@$baseIP -t 'docker-compose -f /home/docker-compose.yaml up -d'  
}

shutDownServices;
removeImages;
buildImages;
pushImages;
copyDockerComposeFiles;
startServices;