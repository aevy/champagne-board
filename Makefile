up:; docker-compose up -d
build:; docker-compose build;
client-log:; docker logs monitor_client_1 --tail=100 -f 
api-log:; docker logs monitor_api_1 --tail=100 -f 

build-%:; docker-compose build $