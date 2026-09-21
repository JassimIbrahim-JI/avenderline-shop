# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore
COPY ["src/AvenderLine.API/AvenderLine.API.csproj", "src/AvenderLine.API/"]
COPY ["src/AvenderLine.Application/AvenderLine.Application.csproj", "src/AvenderLine.Application/"]
COPY ["src/AvenderLine.Infrastructure/AvenderLine.Infrastructure.csproj", "src/AvenderLine.Infrastructure/"]
COPY ["src/AvenderLine.Domain/AvenderLine.Domain.csproj", "src/AvenderLine.Domain/"]
RUN dotnet restore "src/AvenderLine.API/AvenderLine.API.csproj"

# Copy everything else and publish
COPY . .
WORKDIR /src/src/AvenderLine.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "AvenderLine.API.dll"]
