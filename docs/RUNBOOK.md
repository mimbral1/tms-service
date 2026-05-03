# Runbook operativo - TMS Service

## Healthcheck

```http
GET http://localhost:4010/health
```

Respuesta esperada:

```json
{
  "success": true,
  "service": "tms-service",
  "status": "healthy"
}
```

## Ver infraestructura

```bash
npm run infra:check
npm run infra:ps
```

## Levantar desde cero

```bash
npm run infra:reset
npm run db:setup
npm run dev
```

`infra:reset` borra volumenes. Usarlo solo en desarrollo.

## SQL Server no conecta

Revisar:

```txt
DB_SERVER
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
```

Para Docker local el puerto esperado es:

```txt
14330
```

Si hay SQL local en `1433`, no cambiar el compose a `1433`; usar `14330`.

## Kafka no conecta

Revisar:

```txt
KAFKA_BROKERS=localhost:9092
```

Y verificar contenedor:

```bash
npm run infra:ps
```

## Outbox queda failed

Consultar:

```sql
SELECT *
FROM tms.OutboxEvent
WHERE Status = 'failed'
ORDER BY DateCreated DESC;
```

Revisar:

```txt
Kafka disponible
Topic correcto
PayloadJson valido
ErrorMessage
RetryCount
```

## Backend levanta pero endpoints dan 500

Si `/health` responde pero endpoints de negocio fallan con:

```txt
SQL Server pool has not been initialized
```

significa que el backend fue levantado sin bootstrap de base de datos o que SQL no esta disponible.

## Probar sin infraestructura

```bash
npm run dev:local
```

Solo valida Express, health y API root.

## Comandos de verificacion rapida

```bash
npm test
npm run lint
```
