# Answers

Lastname: Cantú
Firstname: Arturo

## 2.2
command: docker build -t arturotucan/webrepo:app

## 2.3
question: the connection fails because we need to include the IP address and the ports to the of the container to run the docker image and specify them in the dockerfile. So the first step would be getting the IP address of the container and the ports.
command: docker run -p 3000:3000 arturotucan/webrepo:app

## 2.5
question:  because you need to name your image with your <username>/yourRepo:appname
command: docker push arturotucan/webrepo:app

## 2.6
command: docker rmi -f $(docker images -q)

question: It checked if the image needed was already there and if it wasn't it downloaded it. 
command: docker run --rm -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 arturotucan/webrepo:app

command: docker run -d -e MYSQL_HOST='localhost' -e MYSQL_USER='root' -e MYSQL_PASSWORD='' -e MYSQL_DATAQL_PORT='3306' -p 3000:3000 arturotucan/webrepo:app

## 2.7
question: the name of the container is arturotucan/webrepo:app and we know this because we can use the command "docker stats" which give us the information about the current container.
question: We can rename it to have a name that we can identify better with our container. 
command: docker container ls --all 

command:  docker rename arturotucan/webrepo:app zoomanage


## 2.8
question: You open the terminal inside of the container in question and run a bash with the "cat /etc/*release"
output: 
PRETTY_NAME="Debian GNU/Linux 9" 
NAME="Debian GNU/Linux" VERSION_ID="9" 
VERSION="9 (stretch)" 
ID=debian HOME_URL="https://www.debian.org/" 
SUPPORT_URL="https://www.debian.org/support" 
BUG_REPORT_URL="https://bugs.debian.org/"

## 3.1
command: docker-compose up

## 3.4
command: docker-compose up -d --restart:always 
command: docker-compose logs arturotucan/webrepo:app
