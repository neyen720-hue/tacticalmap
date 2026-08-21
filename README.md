Claro. Te dejo un `README.md` pensado para que, si mañana cerrás todo, puedas volver a levantar el proyecto sin perderte y también tengas documentado **qué estamos construyendo y qué partes ya funcionan**.

# Programa 360 Entrenamiento

Sistema web de planificación y simulación táctica desarrollado para el **Clan 360**, orientado a la planificación de operaciones, organización de unidades y simulación de movimientos sobre mapas tácticos.

El proyecto está construido con **Python + FastAPI** para el servidor y **HTML, CSS y JavaScript** para la interfaz y el sistema de mapas.

---

## 🎯 Objetivo del proyecto

El objetivo principal es desarrollar una plataforma de planificación táctica que permita:

* Visualizar mapas de operaciones.
* Seleccionar diferentes mapas.
* Dibujar elementos tácticos sobre el mapa.
* Crear y administrar unidades.
* Crear vehículos.
* Asignar rutas.
* Simular el movimiento de las unidades.
* Transportar infantería mediante vehículos.
* Desplegar tropas al finalizar el movimiento de un vehículo.
* Preparar posteriormente sistemas de planificación más avanzados.
* Integrar inteligencia artificial para asistencia en planificación.
* Integrar posteriormente información proveniente de CRCON.

La idea es que el sistema evolucione desde un simple mapa táctico hasta una herramienta completa de planificación y simulación.

---

# 🖥️ Tecnologías utilizadas

## Backend

* Python
* FastAPI
* Uvicorn

## Frontend

* HTML
* CSS
* JavaScript
* Canvas API

## Entorno

* Windows
* Entorno virtual Python (`venv`)

---

# 📁 Estructura del proyecto

La estructura actual aproximada es:

```text
E:\Programa 360 Entrenamiento
│
├── venv\
│
├── static\
│   │
│   ├── css\
│   │   └── mapa.css
│   │
│   ├── js\
│   │   ├── app.js
│   │   ├── mapa.js
│   │   └── mapa_backup_funcionando.js
│   │
│   └── maps\
│       ├── Sintítulo.jpg
│       ├── Sintítulo2.jpg
│       ├── Sintítulo3.jpg
│       ├── Sintítulo4.jpg
│       ├── Sintítulo5.jpg
│       ├── Sintítulo6.jpg
│       ├── Sintítulo7.jpg
│       └── Sintítulo8.jpg
│
├── templates\
│   └── mapa.html
│
└── main.py
```

---

# 🚀 Cómo volver a levantar el proyecto

## 1. Abrir CMD

Abrir una terminal de Windows y entrar al directorio del proyecto:

```cmd
cd /d "E:\Programa 360 Entrenamiento"
```

---

## 2. Activar el entorno virtual

Ejecutar:

```cmd
venv\Scripts\activate
```

Si se activó correctamente, la terminal debería comenzar mostrando:

```text
(venv)
```

Por ejemplo:

```text
(venv) E:\Programa 360 Entrenamiento>
```

---

# 3. Iniciar el servidor

Ejecutar:

```cmd
uvicorn main:app --reload
```

Si todo está funcionando correctamente, aparecerá algo similar a:

```text
Uvicorn running on http://127.0.0.1:8000
```

---

# 4. Abrir el sistema

Abrir el navegador y entrar en:

```text
http://127.0.0.1:8000
```

Si la aplicación utiliza una ruta específica para el mapa táctico, utilizar la ruta correspondiente definida en `main.py`.

---

# 🗺️ Sistema de mapas

Los mapas se almacenan en:

```text
static/maps/
```

Actualmente se utilizan archivos `.jpg`.

El selector de mapas de `mapa.html` debe utilizar los nombres reales de los archivos existentes.

Ejemplo:

```html
<option value="Sintítulo7.jpg">
    Sintítulo7.jpg
</option>
```

El JavaScript carga los mapas mediante:

```text
/static/maps/
```

---

# 🎨 Mapa táctico

El mapa utiliza dos elementos principales:

```html
<img id="mapaImagen">
```

y:

```html
<canvas id="mapCanvas">
```

La imagen contiene el mapa base.

El Canvas permite dibujar encima del mapa:

* Líneas
* Flechas
* Círculos
* Áreas
* Puntos
* Unidades
* Rutas
* Elementos de simulación

---

# 🛠️ Herramientas actuales

La interfaz incluye herramientas para:

### Selección

Permite seleccionar objetos del mapa.

### Línea

Permite dibujar líneas tácticas.

### Flecha

Permite indicar direcciones o movimientos.

### Círculo

Permite marcar áreas.

### Área

Permite dibujar rectángulos.

### Punto

Permite colocar marcadores.

### Texto

Sistema destinado a colocar información textual sobre el mapa.

### Unidad

Permite colocar unidades de infantería.

### Vehículo

Permite colocar vehículos.

---

# 👥 Tipos de unidades

El sistema utiliza diferentes tipos de unidades.

Actualmente están definidos:

```text
infanteria
camion_inf
camion_supply
tanque
```

Sus características se encuentran definidas en `mapa.js`.

Ejemplo conceptual:

```javascript
infanteria
camion_inf
camion_supply
tanque
```

Cada tipo puede tener:

* Nombre
* Icono
* Color
* Velocidad
* Capacidad de transporte

---

# 🚚 Vehículos

Actualmente el sistema permite crear vehículos mediante el selector de tipo de unidad.

Tipos disponibles:

```text
👤 Infantería
🚚 Camión de infantería
📦 Camión de suministros
🛡️ Tanque
```

El selector se encuentra en:

```text
templates/mapa.html
```

y utiliza:

```html
<select id="tipoUnidad">
```

---

# 🛣️ Sistema de rutas

Las unidades pueden recibir rutas.

El flujo actual es:

```text
Seleccionar unidad
        ↓
Crear ruta
        ↓
Hacer clics sobre el mapa
        ↓
Confirmar ruta
        ↓
Iniciar simulación
```

Los puntos de una ruta se almacenan en:

```javascript
unidad.ruta
```

y el índice del punto actual se controla mediante:

```javascript
unidad.puntoRuta
```

---

# ▶️ Simulación

La simulación utiliza:

```javascript
requestAnimationFrame()
```

para actualizar continuamente la posición de las unidades.

La función principal es:

```javascript
animarUnidades()
```

La simulación se inicia mediante:

```javascript
iniciarSimulacion()
```

y se pausa mediante:

```javascript
pausarSimulacion()
```

La velocidad de movimiento depende de:

```javascript
unidad.velocidad
```

---

# 🚚👥 Sistema de transporte — próximo desarrollo

Uno de los próximos objetivos principales es implementar el transporte de infantería.

La lógica prevista es:

```text
🚚 Camión
   │
   ├── transporta
   │
   └── 👥 Infantería
          │
          ▼
      Ruta del camión
          │
          ▼
       Destino
          │
          ▼
    Despliegue
          │
          ▼
      👥 Infantería
          │
          ▼
      Nueva ruta
```

La infantería **no deberá comenzar su movimiento hasta que el vehículo haya terminado su ruta**.

---

# 💾 Deshacer y rehacer

El sistema posee un historial para:

```text
↶ Deshacer
↷ Rehacer
```

El historial se almacena mediante:

```javascript
historial
```

y:

```javascript
posicionHistorial
```

Los estados de los dibujos se almacenan mediante:

```javascript
guardarEstado()
```

---

# 🗑️ Eliminación de objetos

Los objetos seleccionados pueden eliminarse mediante la función:

```javascript
eliminarObjetoSeleccionado()
```

El sistema mantiene los objetos dentro de:

```javascript
dibujos
```

---

# 🖱️ Selección y movimiento

El sistema permite seleccionar objetos del mapa.

También se está desarrollando el sistema para poder:

```text
Seleccionar objeto
       ↓
Arrastrarlo
       ↓
Soltarlo en otra posición
```

Este sistema debe mantenerse compatible con:

* Dibujos
* Unidades
* Vehículos
* Rutas

---

# 🔍 Zoom

El sistema posee un sistema de zoom mediante la rueda del mouse.

Variables principales:

```javascript
zoomMapa
zoomMinimo
zoomMaximo
zoomPaso
```

Actualmente se encuentra en desarrollo y debe mantenerse separado del sistema de dibujo y simulación.

---

# 📦 Archivos importantes

## `main.py`

Archivo principal del backend.

Se encarga de levantar FastAPI y definir las rutas del servidor.

---

## `templates/mapa.html`

Contiene la interfaz visual:

* Barra de herramientas
* Selector de mapas
* Selector de unidades
* Canvas
* Controles de simulación
* Botones

---

## `static/js/mapa.js`

Es el archivo JavaScript principal del sistema táctico.

Contiene:

* Carga del mapa
* Canvas
* Dibujos
* Selección
* Unidades
* Vehículos
* Rutas
* Simulación
* Zoom
* Historial
* Movimiento

---

## `static/css/mapa.css`

Contiene el diseño visual del sistema.

---

## `static/js/mapa_backup_funcionando.js`

**IMPORTANTE**

Este archivo funciona como respaldo de una versión estable anterior.

Si una modificación rompe el mapa o alguna función importante, **no eliminar este archivo**.

Antes de realizar cambios grandes en `mapa.js`, conviene realizar una copia:

```text
mapa_backup_YYYYMMDD.js
```

Ejemplo:

```text
mapa_backup_20260821.js
```

---

# ⚠️ Reglas importantes para continuar el desarrollo

## 1. No modificar varias cosas al mismo tiempo

Cuando se agregue una nueva función:

```text
Modificar
↓
Guardar
↓
Recargar
↓
Probar
↓
Continuar
```

Esto permite identificar rápidamente qué cambio produjo un problema.

---

## 2. Hacer backups antes de cambios grandes

Antes de modificar `mapa.js`:

```text
mapa.js
```

hacer una copia:

```text
mapa_backup_funcionando.js
```

---

## 3. No duplicar funciones

Antes de crear una función nueva:

```javascript
function iniciarSimulacion()
```

buscar primero si ya existe.

Usar:

```text
Ctrl + F
```

Esto es especialmente importante en `mapa.js`.

---

## 4. No duplicar botones

Antes de agregar un botón a `mapa.html`, comprobar si ya existe:

```text
Ctrl + F
```

Buscar el nombre de la función asociada.

Ejemplo:

```text
activarModoUnidad
activarModoVehiculo
activarModoRuta
confirmarRuta
iniciarSimulacion
```

---

# 🧪 Procedimiento recomendado de prueba

Después de cada modificación:

### 1. Levantar servidor

```cmd
uvicorn main:app --reload
```

### 2. Abrir

```text
http://127.0.0.1:8000
```

### 3. Actualizar

```text
Ctrl + F5
```

### 4. Probar

Comprobar:

```text
☐ El mapa aparece
☐ Los mapas se pueden cambiar
☐ Las herramientas dibujan
☐ Las unidades aparecen
☐ Los vehículos aparecen
☐ Las unidades se pueden seleccionar
☐ Las rutas funcionan
☐ La simulación funciona
☐ Deshacer funciona
☐ Rehacer funciona
```

Si algo falla, **detenerse antes de continuar modificando código**.

---

# 🧠 Roadmap del proyecto

## Fase 1 — Base

* [x] Servidor FastAPI
* [x] Página del mapa
* [x] Carga de mapas
* [x] Canvas
* [x] Herramientas de dibujo
* [x] Selección
* [x] Eliminación
* [x] Deshacer
* [x] Rehacer

## Fase 2 — Unidades

* [x] Crear infantería
* [x] Crear vehículos
* [x] Crear tanques
* [x] Crear camiones
* [x] Seleccionar unidades
* [x] Crear rutas
* [x] Confirmar rutas
* [x] Simulación de movimiento

## Fase 3 — Transporte

* [ ] Cargar infantería en camión
* [ ] Mostrar carga del vehículo
* [ ] Movimiento del vehículo
* [ ] Detectar llegada al destino
* [ ] Desplegar infantería
* [ ] Asignar nueva ruta a la infantería

## Fase 4 — Planificación avanzada

* [ ] Organización por escuadras
* [ ] Organización por pelotones
* [ ] Objetivos
* [ ] Líneas de ataque
* [ ] Zonas de defensa
* [ ] Marcadores tácticos
* [ ] Control de tiempos
* [ ] Sistema de órdenes

## Fase 5 — Persistencia

* [ ] Guardar planes
* [ ] Cargar planes
* [ ] Exportar mapas
* [ ] Compartir planes
* [ ] Sistema de usuarios

## Fase 6 — Integraciones

* [ ] Integración con CRCON
* [ ] Información de servidores
* [ ] Información de jugadores
* [ ] Automatización de datos

## Fase 7 — IA

* [ ] Asistente de planificación
* [ ] Análisis del mapa
* [ ] Sugerencias tácticas
* [ ] Generación de rutas
* [ ] Análisis de posiciones
* [ ] Asistencia durante la planificación

---

# 🔐 Estado actual

El proyecto se encuentra en una etapa temprana de desarrollo.

La prioridad actual es mantener una **base estable** antes de implementar sistemas complejos.

La arquitectura debe permitir que posteriormente se incorporen:

```text
MAPA
 │
 ├── DIBUJOS
 │
 ├── UNIDADES
 │
 ├── VEHÍCULOS
 │
 ├── RUTAS
 │
 ├── SIMULACIÓN
 │
 ├── PLANIFICACIÓN
 │
 ├── USUARIOS
 │
 ├── CRCON
 │
 └── IA
```

---

# 🆘 Si el proyecto deja de funcionar

No borrar archivos inmediatamente.

Primero:

1. Revisar la consola del navegador con `F12`.
2. Revisar la terminal donde corre Uvicorn.
3. Buscar errores como:

   * `SyntaxError`
   * `ReferenceError`
   * `TypeError`
   * `404`
4. Comprobar que `mapa.js` esté cargando.
5. Comprobar que los mapas estén dentro de:

```text
static/maps/
```

6. Si una modificación reciente rompió el sistema, comparar con:

```text
static/js/mapa_backup_funcionando.js
```

---

# 🚀 Comando rápido

Para volver a iniciar el proyecto desde cero:

```cmd
cd /d "E:\Programa 360 Entrenamiento"
venv\Scripts\activate
uvicorn main:app --reload
```

Después abrir:

```text
http://127.0.0.1:8000
```

---

# 🏴 Programa 360 Entrenamiento

Proyecto de planificación y simulación táctica del **Clan 360**.

La meta es construir una plataforma capaz de transformar una planificación realizada sobre un mapa en una simulación interactiva de una operación completa.
