#Test
#dotnet publish -c Release -r  linux-x64  --self-contained true GraphQL-api/GraphQL-api.csproj

#docker build --pull -t graphql-api .
#docker run --rm -it -p 5000:80 graphql-api

#docker run --name container-graphql-api -p 5000:80 graphql-api   ----(ru with container name and image name )
#docker exec -it 01e03740af81  ls  - to run commands on container

#docker container prune
#docker container ls -aq
#docker container stop $(docker container ls -aq) - To stop all running containers use the docker container stop
#docker container rm $(docker container ls -aq) - 
#docker rmi $(docker images -a -q)
#docker image ls
#docker container ls -aq
#docker start / stop containerName
#docker start / stop containerName
#docker system prune -a



#printf '[{"name":"container-graphql-api","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
#cat imagedefinitions.json
#artifacts:
#files:imagedefinitions.json
#test