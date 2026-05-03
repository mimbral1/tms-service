# Ciclo de vida de Route Dispatch

Route Dispatch representa la entrega fisica de paquetes desde bodega al conductor.

## Estados

```txt
pending
readyForDispatch
preparingForDispatch
dispatched
notDispatched
```

## Flujo normal

```txt
pending -> readyForDispatch -> preparingForDispatch -> dispatched
```

## Flujo fallido

```txt
pending -> notDispatched
readyForDispatch -> notDispatched
preparingForDispatch -> notDispatched
```

## pending

El despacho fue creado.

## readyForDispatch

Bodega indica que la ruta esta lista para ser despachada.

## preparingForDispatch

El equipo de bodega esta preparando y escaneando paquetes.

## dispatched

Los paquetes fueron entregados al conductor.

## notDispatched

No se pudo despachar la ruta.

## Validacion LIFO

La carga fisica ideal usa LIFO:

```txt
Primer cliente en entregar = ultimo paquete en cargar
Ultimo cliente en entregar = primer paquete en cargar
```

Esto evita descargar todo el vehiculo para encontrar un paquete.
