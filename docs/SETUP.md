# Setup local - TMS Service

## Requisitos

```txt
Node.js 20+
npm
Docker Desktop
SQL Server container
Kafka container
```

## Instalacion

```bash
npm install
```

## Infraestructura

```bash
npm run infra:check
npm run infra:up
npm run infra:ps
```

Contenedores esperados:

```txt
tms-sqlserver
tms-kafka
tms-zookeeper
```

SQL Server se expone en:

```txt
localhost:14330
```

Esto evita conflicto con un SQL Server local que use `1433`.

## Base de datos

```bash
npm run db:setup
```

Este comando hace:

```txt
create database
migrations
views
seeds
```

## Backend

```bash
npm run dev
```

URL:

```txt
http://localhost:4010
```

## Modo local sin Docker

```bash
npm run dev:local
```

Este modo salta:

```txt
database bootstrap
kafka bootstrap
jobs
listeners
```

Sirve para probar:

```http
GET /health
GET /api
```

Los endpoints que consultan SQL Server responderan error controlado si no hay pool de base de datos.

## Docker no aparece en PATH

Si Docker Desktop esta instalado pero la terminal no encuentra `docker`, define:

```powershell
$env:DOCKER_BIN="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
```

Luego:

```bash
npm run infra:up
```
