#! /bin/bash   
set -e

docker info

docker rm $(docker ps -a -q)
docker rmi $(docker images -q)

# build web image
docker build -t stsilabs/openfda-web:$CIRCLE_SHA1 .
    
# run docker containers
if [ "$BUILD_POSTGRES_IMAGE" = "true"  ]
then
  docker run --name openfda-postgres -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -d stsilabs/postgres
  docker run --link openfda-postgres:postgres -p 80:80 -e "RAILS_ENV=demo" --name openfda-web stsilabs/openfda-web:$CIRCLE_SHA1 bundle exec rake db:setup
  # create image
  docker commit openfda-postgres stsilabs/openfda-postgres:$OPENFDA_POSTGRES_VERSION
fi

