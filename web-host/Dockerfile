# build environment
FROM node:12-alpine as build
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . ./
RUN yarn build

# --------- #

FROM nginx:stable-alpine
#COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html


# docker build . -t qprocky/stream-test  
# docker push qprocky/stream-test
# docker run qprocky/stream-test 
# docker run -it qprocky/stream-test sh
# docker run -it -p 80:80 qprocky/stream-test sh

# docker-compose -f docker-compose.yaml up -d
# docker-compose -f docker-compose.yaml down

# docker run -it -p 80:80 qprocky/jee sh
# docker run -p 80:80 qprocky/jee

# docker-compose -f docker-compose.yaml down
# docker-compose -f docker-compose.yaml up -d

# sshpass -p SG83haaZX ssh root@46.101.106.7

# http://www.visailu-host.com/

# make certbot-test DOMAINS="visailu-host.com www.visailu-host.com" EMAIL=qprocky@gmail.com
# make certbot-prod DOMAINS="visailu-host.com www.visailu-host.com" EMAIL=qprocky@gmail.com

# docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build --force-recreate