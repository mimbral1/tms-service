# Ciclo de vida de Route

## Estados

```txt
created
scheduled
started
finished
cancelled
error
```

## Flujo normal

```txt
created -> scheduled -> started -> finished
```

Tambien se permite:

```txt
created -> started -> finished
```

## Cancelaciones

```txt
created -> cancelled
scheduled -> cancelled
started -> cancelled
```

## Errores

```txt
created -> error
scheduled -> error
started -> error
```

## Estados finales

```txt
finished
cancelled
error
```

Una ruta en estado final no debe volver a modificarse operacionalmente.

## created

La ruta existe, pero aun no necesariamente fue iniciada.

## scheduled

La ruta tiene horario planificado.

## started

El conductor inicio la ruta.

Desde este estado se puede:

```txt
registrar tracking
registrar ubicacion del vehiculo
marcar entregas completadas
marcar entregas fallidas
```

## finished

La ruta termino.

## cancelled

La ruta fue cancelada.

## error

La ruta quedo en estado inconsistente.

## Tracking

Estados de tracking:

```txt
pending
onTheWay
arrived
completed
failed
postponed
```
