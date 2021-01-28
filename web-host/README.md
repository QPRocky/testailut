[log]
  level = "WARN"

[providers]
  [providers.docker]
    exposedByDefault = false
  [providers.file]
    directory = "/etc/traefik/dynamic"

[entryPoints]
  [entryPoints.http]
    address = ":80"
  [entryPoints.https]
    address = ":443"

[certificatesResolvers.lets-encrypt.acme]
  storage = "/etc/traefik/acme.json"
  email = "qprocky@gmail.com.com"
  [certificatesResolvers.lets-encrypt.acme.tlsChallenge]

[http.routers]
  [http.routers.force-https]
    entryPoints = ["http"]
    middlewares = ["force-https"]
    rule = "HostRegexp(`{any:.+}`)"
    service = "noop"

[http.middlewares]
  [http.middlewares.force-https.redirectScheme]
    scheme = "https"

[http.services]
  [http.services.noop.loadBalancer]  

version: '3.4'
services:
  traefik:
    image: traefik:2.1
    restart: always
    ports:
      - '80:80'
      - '443:443'
    volumes:
    - ./traefik:/etc/traefik
    - /var/run/docker.sock:/var/run/docker.sock:ro
  my-app:
    image: qprocky/stream-test
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.my-app.rule=Host(`visailu-host.com`)'
      - 'traefik.http.routers.my-app.tls=true'
      - 'traefik.http.routers.my-app.tls.certresolver=lets-encrypt'    