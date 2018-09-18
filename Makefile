up:; docker-compose up -d
build:; docker-compose build;
up-prod:; docker-compose -f docker-compose.prod.yml up -d;
build-prod:; docker-compose -f docker-compose.prod.yml build --no-cache;
client-log:; docker logs monitor_client_1 --tail=100 -f 
api-log:; docker logs monitor_api_1 --tail=100 -f 

build-%:; docker-compose build $
deploy:; ssh dev@46.101.134.110 'cd champagne-board && make pull-and-build'
pull-and-build:; git fetch --all && git reset --hard origin/master && make build-prod up-prod