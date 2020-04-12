# https://hub.docker.com/_/microsoft-dotnet-core
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /NorthwindGraphQL
ENV ASPNETCORE_URLS http://+:5000
EXPOSE 5000

# copy csproj and restore as distinct layers
COPY GraphQL-api/*.csproj GraphQL-api/
COPY DBLayer/*.csproj DBLayer/
RUN dotnet restore GraphQL-api/GraphQL-api.csproj

# copy and build app and libraries
COPY GraphQL-api/ GraphQL-api/
COPY DBLayer/ DBLayer/

WORKDIR /NorthwindGraphQL/GraphQL-api
RUN dotnet build -c release --no-restore

# test stage -- exposes optional entrypoint
# target entrypoint with: docker build --target test
#FROM build AS test
#WORKDIR /source/tests
#COPY tests/ .
#ENTRYPOINT ["dotnet", "test", "--logger:trx"]

FROM build AS publish
RUN dotnet publish -c release --no-build -o /app

WORKDIR /NorthwindGraphQL/GraphQL-api
COPY GraphQL-api/*.db /app

#dotnet publish -c Release -r  linux-x64  --self-contained true GraphQL-api/GraphQL-api.csproj


# final stage/image
FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY --from=publish /app/ .
ENTRYPOINT ["dotnet", "GraphQL-api.dll"]