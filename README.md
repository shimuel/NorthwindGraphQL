#Test
#dotnet publish -c Release -r  linux-x64  --self-contained true GraphQL-api/GraphQL-api.csproj

#docker build --pull -t graphql-api .
#docker run --rm -it -p 5000:80 graphql-api