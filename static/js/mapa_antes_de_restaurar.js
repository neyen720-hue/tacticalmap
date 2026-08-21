const imagen = document.getElementById("mapaImagen");
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");


// =====================================
// VARIABLES GENERALES
// =====================================

let herramientaActual = "seleccionar";
let dibujos = [];
// =====================================
// HISTORIAL DESHACER / REHACER
// =====================================

let historial = [];
let posicionHistorial = -1;


// =====================================
// GUARDAR ESTADO
// =====================================

function guardarEstado() {

    // Eliminamos los estados posteriores
    // si habíamos usado Deshacer

    historial =
        historial.slice(
            0,
            posicionHistorial + 1
        );


    historial.push(
        JSON.stringify(dibujos)
    );


    posicionHistorial =
        historial.length - 1;

}


// =====================================
// DESHACER
// =====================================

function deshacer() {

    if (
        posicionHistorial <= 0
    ) {

        return;

    }


    posicionHistorial--;


    dibujos =
        JSON.parse(
            historial[
                posicionHistorial
            ]
        );


    objetoSeleccionado =
        null;


    redibujarTodo();

}


// =====================================
// REHACER
// =====================================

function rehacer() {

    if (
        posicionHistorial >=
        historial.length - 1
    ) {

        return;

    }


    posicionHistorial++;


    dibujos =
        JSON.parse(
            historial[
                posicionHistorial
            ]
        );


    objetoSeleccionado =
        null;


    redibujarTodo();

}

// =====================================
// ARRASTRAR OBJETOS
// =====================================

let arrastrandoObjeto = false;

let objetoArrastrado = null;

let offsetX = 0;
let offsetY = 0;

// =====================================
// UNIDADES
// =====================================

let unidades = [];

let modoUnidad = false;

let unidadSeleccionada = null;

let seleccionandoRuta = false;

let puntosRuta = [];

let simulacionActiva = false;

let tiempoAnterior = 0;

// =====================================
// DESPLIEGUE DE INFANTERÍA
// =====================================

let desplieguesPendientes = [];

// =====================================
// ZOOM
// =====================================

let zoomMapa = 1;

const zoomMinimo = 0.5;

const zoomMaximo = 3;

const zoomPaso = 0.1;


// =====================================
// SELECCIONAR HERRAMIENTA
// =====================================

function seleccionarHerramienta(herramienta) {

    herramientaActual = herramienta;

    const indicador =
        document.getElementById(
            "herramientaActual"
        );

    if (indicador) {

        indicador.textContent =
            "Herramienta: " +
            herramienta;

    }

}


// =====================================
// CAMBIAR MAPA
// =====================================

function cambiarMapa() {

    const selector =
        document.getElementById(
            "mapaSeleccionado"
        );

    if (!selector) {
        return;
    }

    const nombreMapa =
        selector.value;

    if (!nombreMapa) {
        return;
    }

    imagen.src =
        "/static/maps/" +
        encodeURIComponent(
            nombreMapa
        );

    dibujos = [];

    redibujarTodo();

}


// =====================================
// MAPA CARGADO
// =====================================

imagen.onload = function () {

    const ancho =
        imagen.clientWidth;

    const alto =
        imagen.clientHeight;


    canvas.width =
        imagen.naturalWidth;

    canvas.height =
        imagen.naturalHeight;


    canvas.style.width =
        ancho + "px";

    canvas.style.height =
        alto + "px";


    redibujarTodo();

};


// =====================================
// ERROR DEL MAPA
// =====================================

imagen.onerror = function () {

    console.error(
        "No se pudo cargar el mapa:",
        imagen.src
    );

};


// =====================================
// OBTENER POSICIÓN
// =====================================

function obtenerPosicion(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (event.clientX - rect.left)
            *
            (
                canvas.width /
                rect.width
            ),

        y:
            (event.clientY - rect.top)
            *
            (
                canvas.height /
                rect.height
            )

    };

}


// =====================================
// MOUSE DOWN
// =====================================

canvas.addEventListener(
    "mousedown",
    function (event) {

        if (
            herramientaActual ===
            "seleccionar"
        ) {

            return;

        }


        dibujando = true;


        const posicion =
            obtenerPosicion(event);


        inicioX =
            posicion.x;

        inicioY =
            posicion.y;

    }
);


// =====================================
// MOUSE MOVE
// =====================================

canvas.addEventListener(
    "mousemove",
    function (event) {

        if (!dibujando) {
            return;
        }


        redibujarTodo();


        const posicion =
            obtenerPosicion(event);


        dibujarTemporal(
            posicion.x,
            posicion.y
        );

    }
);


// =====================================
// MOUSE UP
// =====================================

canvas.addEventListener(
    "mouseup",
    function (event) {

        if (!dibujando) {
            return;
        }


        dibujando = false;


        const posicion =
            obtenerPosicion(event);


        dibujos.push({

            tipo:
                herramientaActual,

            x1:
                inicioX,

            y1:
                inicioY,

            x2:
                posicion.x,

            y2:
                posicion.y

        });


        redibujarTodo();

    }
);


// =====================================
// DOBLE CLICK — SELECCIONAR UNIDAD
// =====================================

canvas.addEventListener(
    "dblclick",
    function (event) {

        seleccionarUnidadEnMapa(
            event
        );

    }
);


// =====================================
// DIBUJAR TEMPORAL
// =====================================

function dibujarTemporal(x, y) {

    ctx.lineWidth = 4;

ctx.strokeStyle = "red";

ctx.fillStyle = "red";

    if (
        herramientaActual ===
        "linea"
    ) {

        ctx.beginPath();

        ctx.moveTo(
            inicioX,
            inicioY
        );

        ctx.lineTo(
            x,
            y
        );

        ctx.stroke();

    }


    if (
        herramientaActual ===
        "flecha"
    ) {

        dibujarFlecha(
            inicioX,
            inicioY,
            x,
            y
        );

    }


    if (
        herramientaActual ===
        "circulo"
    ) {

        const radio =
            Math.sqrt(
                Math.pow(
                    x - inicioX,
                    2
                )
                +
                Math.pow(
                    y - inicioY,
                    2
                )
            );


        ctx.beginPath();

        ctx.arc(
            inicioX,
            inicioY,
            radio,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    if (
        herramientaActual ===
        "rectangulo"
    ) {

        ctx.strokeRect(
            inicioX,
            inicioY,
            x - inicioX,
            y - inicioY
        );

    }


    if (
        herramientaActual ===
        "punto"
    ) {

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// =====================================
// FLECHA
// =====================================

function dibujarFlecha(
    x1,
    y1,
    x2,
    y2
) {

    const cabeza = 18;


    const angulo =
        Math.atan2(
            y2 - y1,
            x2 - x1
        );


    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );


    ctx.lineTo(
        x2 -
        cabeza *
        Math.cos(
            angulo -
            Math.PI / 6
        ),

        y2 -
        cabeza *
        Math.sin(
            angulo -
            Math.PI / 6
        )
    );


    ctx.lineTo(
        x2 -
        cabeza *
        Math.cos(
            angulo +
            Math.PI / 6
        ),

        y2 -
        cabeza *
        Math.sin(
            angulo +
            Math.PI / 6
        )
    );


    ctx.closePath();

    ctx.fillStyle =
        "red";

    ctx.fill();

}


// =====================================
// DIBUJAR OBJETO
// =====================================

function dibujarObjeto(dibujo) {

   ctx.lineWidth =
    dibujo.grosor || 4;

ctx.strokeStyle =
    dibujo.color || "red";

ctx.fillStyle =
    dibujo.color || "red";


    if (
        dibujo.tipo ===
        "linea"
    ) {

        ctx.beginPath();

        ctx.moveTo(
            dibujo.x1,
            dibujo.y1
        );

        ctx.lineTo(
            dibujo.x2,
            dibujo.y2
        );

        ctx.stroke();

    }


    if (
        dibujo.tipo ===
        "flecha"
    ) {

        dibujarFlecha(
            dibujo.x1,
            dibujo.y1,
            dibujo.x2,
            dibujo.y2
        );

    }


    if (
        dibujo.tipo ===
        "circulo"
    ) {

        const radio =
            Math.sqrt(
                Math.pow(
                    dibujo.x2 -
                    dibujo.x1,
                    2
                )
                +
                Math.pow(
                    dibujo.y2 -
                    dibujo.y1,
                    2
                )
            );


        ctx.beginPath();

        ctx.arc(
            dibujo.x1,
            dibujo.y1,
            radio,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    if (
        dibujo.tipo ===
        "rectangulo"
    ) {

        ctx.strokeRect(
            dibujo.x1,
            dibujo.y1,
            dibujo.x2 -
            dibujo.x1,
            dibujo.y2 -
            dibujo.y1
        );

    }


    if (
        dibujo.tipo ===
        "punto"
    ) {

        ctx.beginPath();

        ctx.arc(
            dibujo.x2,
            dibujo.y2,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }
// -----------------------------
// TEXTO
// -----------------------------

if (
    dibujo.tipo === "texto"
) {

    ctx.fillStyle =
        dibujo.color || "#ffffff";

    ctx.font =
        "bold " +
        (dibujo.tamaño || 24) +
        "px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        dibujo.texto,
        dibujo.x,
        dibujo.y
    );

}

}


// =====================================
// BORRAR TODO
// =====================================

function borrarTodo() {

    if (dibujos.length === 0) {

        return;

    }


    dibujos = [];


    guardarEstado();


    objetoSeleccionado =
        null;


    redibujarTodo();

}


// =====================================
// CREAR UNIDAD
// =====================================

function crearUnidad(
    x,
    y,
    nombre = null,
    tipo = "infanteria"
) {

    const tipos = {

        infanteria: {

            nombre:
                "Infantería",

            icono:
                "👤",

            velocidad:
                50,

            capacidad:
                0

        },


        camion_inf: {

            nombre:
                "Camión de infantería",

            icono:
                "🚚",

            velocidad:
                80,

            capacidad:
                8

        },


        tanque: {

            nombre:
                "Tanque",

            icono:
                "🛡️",

            velocidad:
                60,

            capacidad:
                0

        },


        camion_supply: {

            nombre:
                "Camión de suministros",

            icono:
                "📦",

            velocidad:
                70,

            capacidad:
                100

        }

    };


    const informacion =
        tipos[tipo] ||
        tipos.infanteria;


    const unidad = {

        id:
            Date.now() +
            Math.random(),


        nombre:
            nombre ||
            informacion.nombre +
            "-" +
            (
                unidades.length +
                1
            ),


        tipo:
            tipo,


        tipoNombre:
            informacion.nombre,


        icono:
            informacion.icono,


        x:
            x,


        y:
            y,


        velocidad:
            informacion.velocidad,


        capacidad:
            informacion.capacidad,


        carga:
            [],


        ruta:
            [],


        puntoRuta:
            0,


        desplegada:
            true

    };


    unidades.push(
        unidad
    );


    redibujarTodo();

}


// =====================================
// DIBUJAR UNIDADES
// =====================================

function dibujarUnidades() {

    for (
        const unidad of unidades
    ) {

        ctx.font =
            "28px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.fillText(
            unidad.icono,
            unidad.x,
            unidad.y
        );


        ctx.font =
            "bold 15px Arial";

        ctx.fillStyle =
            "white";

        ctx.textAlign =
            "left";

        ctx.textBaseline =
            "alphabetic";


        ctx.fillText(
            unidad.nombre,
            unidad.x + 18,
            unidad.y - 12
        );


        if (
            unidad.carga &&
            unidad.carga.length > 0
        ) {

            ctx.font =
                "12px Arial";

            ctx.fillStyle =
                "yellow";


            ctx.fillText(
                "Carga: " +
                unidad.carga.length,
                unidad.x + 18,
                unidad.y + 5
            );

        }

    }

}


// =====================================
// DIBUJAR RUTA TEMPORAL
// =====================================

function dibujarRutaTemporal() {

    if (
        !unidadSeleccionada ||
        puntosRuta.length === 0
    ) {

        return;

    }


    ctx.lineWidth =
        5;

    ctx.strokeStyle =
        "yellow";


    ctx.beginPath();


    ctx.moveTo(
        unidadSeleccionada.x,
        unidadSeleccionada.y
    );


    for (
        const punto of puntosRuta
    ) {

        ctx.lineTo(
            punto.x,
            punto.y
        );

    }


    ctx.stroke();


    ctx.fillStyle =
        "yellow";


    for (
        const punto of puntosRuta
    ) {

        ctx.beginPath();

        ctx.arc(
            punto.x,
            punto.y,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// =====================================
// REDIBUJAR TODO
// =====================================

function redibujarTodo() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        const dibujo of dibujos
    ) {

        dibujarObjeto(
            dibujo
        );

    }


    dibujarUnidades();


    if (
        seleccionandoRuta
    ) {

        dibujarRutaTemporal();

    }

}


// =====================================
// ACTIVAR MODO UNIDAD
// =====================================

function activarModoUnidad() {

    modoUnidad =
        true;

    seleccionandoRuta =
        false;

    unidadSeleccionada =
        null;


    const indicador =
        document.getElementById(
            "herramientaActual"
        );


    if (indicador) {

        indicador.textContent =
            "Herramienta: colocar unidad";

    }

}


// =====================================
// ACTIVAR MODO RUTA
// =====================================

function activarModoRuta() {

    if (
        !unidadSeleccionada
    ) {

        alert(
            "Primero seleccioná una unidad con doble clic."
        );

        return;

    }


    seleccionandoRuta =
        true;

    modoUnidad =
        false;

    puntosRuta =
        [];


    const indicador =
        document.getElementById(
            "herramientaActual"
        );


    if (indicador) {

        indicador.textContent =
            "Ruta para: " +
            unidadSeleccionada.nombre;

    }

}


// =====================================
// CLIC DEL MAPA
// =====================================

canvas.addEventListener(
    "click",
    function (event) {

        const posicion =
            obtenerPosicion(
                event
            );


        // -----------------------------
        // COLOCAR UNIDAD
        // -----------------------------

        if (modoUnidad) {

            const selector =
                document.getElementById(
                    "tipoUnidad"
                );


            const campoNombre =
                document.getElementById(
                    "nombreUnidad"
                );


            const tipo =
                selector
                    ? selector.value
                    : "infanteria";


            let nombre =
                campoNombre
                    ? campoNombre.value.trim()
                    : "";


            if (!nombre) {

                nombre =
                    "UNIDAD-" +
                    (
                        unidades.length +
                        1
                    );

            }


            crearUnidad(
                posicion.x,
                posicion.y,
                nombre,
                tipo
            );


            if (campoNombre) {

                campoNombre.value =
                    "";

            }


            modoUnidad =
                false;


            return;

        }


        // -----------------------------
        // CREAR RUTA
        // -----------------------------

        if (
            seleccionandoRuta
        ) {

            if (
                !unidadSeleccionada
            ) {

                alert(
                    "Primero seleccioná una unidad."
                );

                seleccionandoRuta =
                    false;

                return;

            }


            puntosRuta.push({

                x:
                    posicion.x,

                y:
                    posicion.y

            });


            redibujarTodo();

            return;

        }

    }
);


// =====================================
// CONFIRMAR RUTA
// =====================================

function confirmarRuta() {

    if (
        !unidadSeleccionada ||
        puntosRuta.length === 0
    ) {

        alert(
            "Seleccioná una unidad y agregá puntos."
        );

        return;

    }


    unidadSeleccionada.ruta =
        [
            ...puntosRuta
        ];


    unidadSeleccionada.puntoRuta =
        0;


    seleccionandoRuta =
        false;


    puntosRuta =
        [];


    redibujarTodo();


    alert(
        "Ruta asignada a " +
        unidadSeleccionada.nombre
    );

}


// =====================================
// SELECCIONAR UNIDAD
// =====================================

function seleccionarUnidadEnMapa(
    event
) {

    const posicion =
        obtenerPosicion(
            event
        );


    for (
        let i =
            unidades.length - 1;

        i >= 0;

        i--
    ) {

        const unidad =
            unidades[i];


        const distancia =
            Math.sqrt(
                Math.pow(
                    posicion.x -
                    unidad.x,
                    2
                )
                +
                Math.pow(
                    posicion.y -
                    unidad.y,
                    2
                )
            );


        if (
            distancia < 35
        ) {

            unidadSeleccionada =
                unidad;


            const indicador =
                document.getElementById(
                    "herramientaActual"
                );


            if (indicador) {

                indicador.textContent =
                    "Seleccionada: " +
                    unidad.nombre;

            }


            redibujarTodo();

            return;

        }

    }

}


// =====================================
// SIMULACIÓN
// =====================================



function pausarSimulacion() {

    simulacionActiva =
        false;

}


function animarUnidades(
    timestamp
) {

    if (
        !simulacionActiva
    ) {

        return;

    }


    if (
        !tiempoAnterior
    ) {

        tiempoAnterior =
            timestamp;

    }


    const delta =
        (
            timestamp -
            tiempoAnterior
        ) / 1000;


    tiempoAnterior =
        timestamp;


    for (
        const unidad of unidades
    ) {

        if (
            unidad.puntoRuta >=
            unidad.ruta.length
        ) {

            continue;

        }


        const destino =
            unidad.ruta[
                unidad.puntoRuta
            ];


        const dx =
            destino.x -
            unidad.x;


        const dy =
            destino.y -
            unidad.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


       if (
    distancia < 3
) {

    unidad.x =
        destino.x;

    unidad.y =
        destino.y;

    unidad.puntoRuta++;


    // =================================
    // CAMIÓN DE INFANTERÍA
    // =================================

    if (
        unidad.tipo ===
        "camion_inf"
        &&
        unidad.puntoRuta >=
        unidad.ruta.length
    ) {

        desplegarInfanteria(
            unidad
        );

    }


    continue;

}

        const movimiento =
            unidad.velocidad *
            delta;


        unidad.x +=
            (
                dx /
                distancia
            ) *
            movimiento;


        unidad.y +=
            (
                dy /
                distancia
            ) *
            movimiento;

    }


    redibujarTodo();


    requestAnimationFrame(
        animarUnidades
    );

}


// =====================================
// ZOOM
// =====================================

function aplicarZoom() {

    const workspace =
        document.getElementById(
            "mapWorkspace"
        );


    if (!workspace) {

        return;

    }


    workspace.style.transform =
        "scale(" +
        zoomMapa +
        ")";


    actualizarIndicadorZoom();

}


function actualizarIndicadorZoom() {

    const indicador =
        document.getElementById(
            "zoomIndicador"
        );


    if (!indicador) {

        return;

    }


    indicador.textContent =
        "ZOOM: " +
        Math.round(
            zoomMapa * 100
        ) +
        "%";

}


const mapContainer =
    document.querySelector(
        ".map-container"
    );


if (mapContainer) {

    mapContainer.addEventListener(
        "wheel",
        function (event) {

            event.preventDefault();


            if (
                event.deltaY < 0
            ) {

                zoomMapa +=
                    zoomPaso;

            } else {

                zoomMapa -=
                    zoomPaso;

            }


            if (
                zoomMapa <
                zoomMinimo
            ) {

                zoomMapa =
                    zoomMinimo;

            }


            if (
                zoomMapa >
                zoomMaximo
            ) {

                zoomMapa =
                    zoomMaximo;

            }


            aplicarZoom();

        },
        {
            passive:
                false
        }
    );

}


// =====================================
// MAPA INICIAL
// =====================================
guardarEstado();
const mapaInicial =
    "Sin título7.jpg";


imagen.src =
    "/static/maps/" +
    encodeURIComponent(
        mapaInicial
    );


// =====================================
// SELECTOR DE MAPA
// =====================================

const selectorMapa =
    document.getElementById(
        "mapaSeleccionado"
    );


if (selectorMapa) {

    selectorMapa.addEventListener(
        "change",
        cambiarMapa
    );

}
// =====================================
// SISTEMA DE SELECCIÓN DE OBJETOS
// =====================================

let objetoSeleccionado = null;


// =====================================
// MOSTRAR PROPIEDADES
// =====================================

function mostrarPropiedadesObjeto(objeto) {

    objetoSeleccionado = objeto;


    const panel =
        document.getElementById(
            "objetoSeleccionado"
        );


    if (!panel) {
        return;
    }


    if (!objeto) {

        panel.textContent =
            "Ninguno";

        return;

    }


    panel.innerHTML =
        `
        <strong>
            ${objeto.tipo}
        </strong>
        <br><br>

        X: ${Math.round(objeto.x1 || 0)}
        <br>

        Y: ${Math.round(objeto.y1 || 0)}
        `;

}
// =====================================
// DETECTAR OBJETO AL HACER CLIC
// =====================================

function seleccionarObjetoEnMapa(event) {

    const posicion =
        obtenerPosicion(event);

    let encontrado = null;


    // Buscar desde el último objeto
    // hacia el primero

    for (
        let i = dibujos.length - 1;
        i >= 0;
        i--
    ) {

        const dibujo =
            dibujos[i];


        // -----------------------------
        // PUNTO
        // -----------------------------

        if (
            dibujo.tipo === "punto"
        ) {

            const distancia =
                Math.sqrt(
                    Math.pow(
                        posicion.x -
                        dibujo.x2,
                        2
                    ) +
                    Math.pow(
                        posicion.y -
                        dibujo.y2,
                        2
                    )
                );


            if (distancia < 20) {

                encontrado =
                    dibujo;

                break;

            }

        }


        // -----------------------------
        // LÍNEA / FLECHA
        // -----------------------------

        if (
            dibujo.tipo === "linea" ||
            dibujo.tipo === "flecha"
        ) {

            const distancia =
                distanciaAPuntoLinea(
                    posicion.x,
                    posicion.y,
                    dibujo.x1,
                    dibujo.y1,
                    dibujo.x2,
                    dibujo.y2
                );


            if (distancia < 15) {

                encontrado =
                    dibujo;

                break;

            }

        }


        // -----------------------------
        // CÍRCULO
        // -----------------------------

        if (
            dibujo.tipo === "circulo"
        ) {

            const radio =
                Math.sqrt(
                    Math.pow(
                        dibujo.x2 -
                        dibujo.x1,
                        2
                    ) +
                    Math.pow(
                        dibujo.y2 -
                        dibujo.y1,
                        2
                    )
                );


            const distanciaCentro =
                Math.sqrt(
                    Math.pow(
                        posicion.x -
                        dibujo.x1,
                        2
                    ) +
                    Math.pow(
                        posicion.y -
                        dibujo.y1,
                        2
                    )
                );


            if (
                Math.abs(
                    distanciaCentro -
                    radio
                ) < 15
            ) {

                encontrado =
                    dibujo;

                break;

            }

        }


        // -----------------------------
        // RECTÁNGULO
        // -----------------------------

        if (
            dibujo.tipo ===
            "rectangulo"
        ) {

            const minX =
                Math.min(
                    dibujo.x1,
                    dibujo.x2
                );

            const maxX =
                Math.max(
                    dibujo.x1,
                    dibujo.x2
                );

            const minY =
                Math.min(
                    dibujo.y1,
                    dibujo.y2
                );

            const maxY =
                Math.max(
                    dibujo.y1,
                    dibujo.y2
                );


            const dentro =
                posicion.x >= minX &&
                posicion.x <= maxX &&
                posicion.y >= minY &&
                posicion.y <= maxY;


            if (dentro) {

                encontrado =
                    dibujo;

                break;

            }

        }

    }


    mostrarPropiedadesObjeto(
        encontrado
    );

}
// =====================================
// DISTANCIA A UNA LÍNEA
// =====================================

function distanciaAPuntoLinea(
    px,
    py,
    x1,
    y1,
    x2,
    y2
) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;


    if (
        dx === 0 &&
        dy === 0
    ) {

        return Math.sqrt(
            Math.pow(
                px - x1,
                2
            ) +
            Math.pow(
                py - y1,
                2
            )
        );

    }


    const t =
        (
            (px - x1) * dx +
            (py - y1) * dy
        ) /
        (
            dx * dx +
            dy * dy
        );


    const limitado =
        Math.max(
            0,
            Math.min(
                1,
                t
            )
        );


    const cercanoX =
        x1 +
        limitado * dx;


    const cercanoY =
        y1 +
        limitado * dy;


    return Math.sqrt(
        Math.pow(
            px - cercanoX,
            2
        ) +
        Math.pow(
            py - cercanoY,
            2
        )
    );

}
// =====================================
// CLIC DE SELECCIÓN
// =====================================

canvas.addEventListener(
    "click",
    function(event) {

        if (
            herramientaActual ===
            "texto"
        ) {

            crearTextoEnMapa(
                event
            );

            return;

        }


        if (
            herramientaActual !==
            "seleccionar"
        ) {

            return;

        }


        seleccionarObjetoEnMapa(
            event
        );

    }
);
// =====================================
// ELIMINAR OBJETO SELECCIONADO
// =====================================

function eliminarObjetoSeleccionado() {

    if (!objetoSeleccionado) {

        alert(
            "Primero seleccioná un objeto."
        );

        return;

    }


    const indice =
        dibujos.indexOf(
            objetoSeleccionado
        );


    if (indice === -1) {

        return;

    }


   dibujos.splice(
    indice,
    1
);

guardarEstado();


    objetoSeleccionado = null;


    const panel =
        document.getElementById(
            "objetoSeleccionado"
        );


    if (panel) {

        panel.textContent =
            "Ninguno";

    }


    redibujarTodo();

}
// =====================================
// CAMBIAR COLOR DEL OBJETO
// =====================================

function cambiarColorObjeto(color) {

    if (!objetoSeleccionado) {

        return;

    }

    objetoSeleccionado.color =
        color;

    redibujarTodo();

}
// =====================================
// CAMBIAR GROSOR DEL OBJETO
// =====================================

function cambiarGrosorObjeto(grosor) {

    if (!objetoSeleccionado) {

        return;

    }

    objetoSeleccionado.grosor =
        Number(grosor);


    const indicador =
        document.getElementById(
            "valorGrosor"
        );


    if (indicador) {

        indicador.textContent =
            grosor + " px";

    }


    redibujarTodo();

}
// =====================================
// CREAR TEXTO EN EL MAPA
// =====================================

function crearTextoEnMapa(event) {

    const posicion =
        obtenerPosicion(event);

    const texto =
        prompt(
            "Escribí el texto:"
        );

    if (!texto) {
        return;
    }

    const nuevoTexto = {

        tipo: "texto",

        x: posicion.x,

        y: posicion.y,

        texto: texto,

        color: "#ffffff",

        tamaño: 24

    };

    dibujos.push(dibujo);

guardarEstado();

redibujarTodo();
}
// =====================================
// INICIAR ARRASTRE
// =====================================

canvas.addEventListener(
    "mousedown",
    function(event) {

        if (
            herramientaActual !==
            "seleccionar"
        ) {
            return;
        }

        const posicion =
            obtenerPosicion(event);

        let encontrado = null;


        // Buscar el objeto más cercano
        for (
            let i = dibujos.length - 1;
            i >= 0;
            i--
        ) {

            const dibujo =
                dibujos[i];


            // =============================
            // TEXTO
            // =============================

            if (
                dibujo.tipo === "texto"
            ) {

                const distancia =
                    Math.sqrt(
                        Math.pow(
                            posicion.x -
                            dibujo.x,
                            2
                        ) +
                        Math.pow(
                            posicion.y -
                            dibujo.y,
                            2
                        )
                    );

                if (distancia < 50) {

                    encontrado =
                        dibujo;

                    break;

                }

            }


            // =============================
            // PUNTO
            // =============================

            if (
                dibujo.tipo === "punto"
            ) {

                const distancia =
                    Math.sqrt(
                        Math.pow(
                            posicion.x -
                            dibujo.x2,
                            2
                        ) +
                        Math.pow(
                            posicion.y -
                            dibujo.y2,
                            2
                        )
                    );

                if (distancia < 25) {

                    encontrado =
                        dibujo;

                    break;

                }

            }


            // =============================
            // LÍNEA / FLECHA
            // =============================

            if (
                dibujo.tipo === "linea" ||
                dibujo.tipo === "flecha"
            ) {

                const distancia =
                    distanciaAPuntoLinea(
                        posicion.x,
                        posicion.y,
                        dibujo.x1,
                        dibujo.y1,
                        dibujo.x2,
                        dibujo.y2
                    );

                if (distancia < 20) {

                    encontrado =
                        dibujo;

                    break;

                }

            }


            // =============================
            // CÍRCULO
            // =============================

            if (
                dibujo.tipo === "circulo"
            ) {

                const radio =
                    Math.sqrt(
                        Math.pow(
                            dibujo.x2 -
                            dibujo.x1,
                            2
                        ) +
                        Math.pow(
                            dibujo.y2 -
                            dibujo.y1,
                            2
                        )
                    );

                const distanciaCentro =
                    Math.sqrt(
                        Math.pow(
                            posicion.x -
                            dibujo.x1,
                            2
                        ) +
                        Math.pow(
                            posicion.y -
                            dibujo.y1,
                            2
                        )
                    );

                if (
                    Math.abs(
                        distanciaCentro -
                        radio
                    ) < 20
                ) {

                    encontrado =
                        dibujo;

                    break;

                }

            }


            // =============================
            // RECTÁNGULO
            // =============================

            if (
                dibujo.tipo ===
                "rectangulo"
            ) {

                const minX =
                    Math.min(
                        dibujo.x1,
                        dibujo.x2
                    );

                const maxX =
                    Math.max(
                        dibujo.x1,
                        dibujo.x2
                    );

                const minY =
                    Math.min(
                        dibujo.y1,
                        dibujo.y2
                    );

                const maxY =
                    Math.max(
                        dibujo.y1,
                        dibujo.y2
                    );

                if (
                    posicion.x >= minX &&
                    posicion.x <= maxX &&
                    posicion.y >= minY &&
                    posicion.y <= maxY
                ) {

                    encontrado =
                        dibujo;

                    break;

                }

            }

        }


        if (!encontrado) {
            return;
        }


        // Guardamos el objeto
        objetoArrastrado =
            encontrado;

        arrastrandoObjeto =
            true;

        objetoSeleccionado =
            encontrado;


        // Guardamos la diferencia
        // entre el mouse y el objeto

        if (
            encontrado.tipo === "texto"
        ) {

            offsetX =
                posicion.x -
                encontrado.x;

            offsetY =
                posicion.y -
                encontrado.y;

        }

        else if (
            encontrado.tipo === "punto"
        ) {

            offsetX =
                posicion.x -
                encontrado.x2;

            offsetY =
                posicion.y -
                encontrado.y2;

        }

        else {

            // Para líneas, flechas,
            // círculos y rectángulos
            // usamos el primer punto.

            offsetX =
                posicion.x -
                encontrado.x1;

            offsetY =
                posicion.y -
                encontrado.y1;

        }


        mostrarPropiedadesObjeto(
            encontrado
        );

    }
);


// =====================================
// MOVER OBJETO
// =====================================

canvas.addEventListener(
    "mousemove",
    function(event) {

        if (
            !arrastrandoObjeto ||
            !objetoArrastrado
        ) {
            return;
        }


        const posicion =
            obtenerPosicion(event);


        const objeto =
            objetoArrastrado;


        // =============================
        // TEXTO
        // =============================

        if (
            objeto.tipo === "texto"
        ) {

            objeto.x =
                posicion.x -
                offsetX;

            objeto.y =
                posicion.y -
                offsetY;

        }


        // =============================
        // PUNTO
        // =============================

        else if (
            objeto.tipo === "punto"
        ) {

            objeto.x2 =
                posicion.x -
                offsetX;

            objeto.y2 =
                posicion.y -
                offsetY;

        }


        // =============================
        // LÍNEA / FLECHA
        // =============================

        else {

            const nuevoX =
                posicion.x -
                offsetX;

            const nuevoY =
                posicion.y -
                offsetY;


            const desplazamientoX =
                nuevoX -
                objeto.x1;

            const desplazamientoY =
                nuevoY -
                objeto.y1;


            objeto.x1 +=
                desplazamientoX;

            objeto.y1 +=
                desplazamientoY;

            objeto.x2 +=
                desplazamientoX;

            objeto.y2 +=
                desplazamientoY;

        }


        redibujarTodo();

    }
);


// =====================================
// FINALIZAR ARRASTRE
// =====================================

canvas.addEventListener(
    "mouseup",
    function() {

        if (
            arrastrandoObjeto &&
            objetoArrastrado
        ) {

            guardarEstado();

        }


        arrastrandoObjeto =
            false;


        objetoArrastrado =
            null;

    }
);
// =====================================
// GUARDAR ESTADO
// =====================================

function guardarEstado() {

    const estado =
        JSON.stringify(dibujos);

    // Si hicimos un cambio después
    // de haber usado Deshacer,
    // eliminamos los estados futuros.

    historial =
        historial.slice(
            0,
            posicionHistorial + 1
        );

    historial.push(
        estado
    );

    posicionHistorial =
        historial.length - 1;

}
// =====================================
// DESHACER
// =====================================

function deshacer() {

    if (
        posicionHistorial <= 0
    ) {

        return;

    }

    posicionHistorial--;

    dibujos =
        JSON.parse(
            historial[
                posicionHistorial
            ]
        );

    objetoSeleccionado =
        null;

    redibujarTodo();

}
// =====================================
// REHACER
// =====================================

function rehacer() {

    if (
        posicionHistorial >=
        historial.length - 1
    ) {

        return;

    }

    posicionHistorial++;

    dibujos =
        JSON.parse(
            historial[
                posicionHistorial
            ]
        );

    objetoSeleccionado =
        null;

    redibujarTodo();

}
// =====================================
// DESPLEGAR INFANTERÍA
// =====================================

function desplegarInfanteria(
    camion
) {

    const cantidad =
        camion.capacidad || 8;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const angulo =
            Math.random() *
            Math.PI *
            2;


        const distancia =
            20 +
            Math.random() *
            35;


        const x =
            camion.x +
            Math.cos(
                angulo
            ) *
            distancia;


        const y =
            camion.y +
            Math.sin(
                angulo
            ) *
            distancia;


        crearUnidad(
            x,
            y,
            "INF-" +
            (unidades.length + 1),
            "infanteria"
        );

    }


    // El camión ya realizó
    // su función.

    camion.desplegada =
        true;


    redibujarTodo();

}
// =====================================
// INICIAR SIMULACIÓN
// =====================================

function iniciarSimulacion() {

    if (unidades.length === 0) {

        alert(
            "Primero creá una unidad."
        );

        return;

    }


    simulacionActiva =
        true;

    tiempoAnterior =
        0;


    requestAnimationFrame(
        animarUnidades
    );

}
// =====================================
// PAUSAR SIMULACIÓN
// =====================================

function pausarSimulacion() {

    simulacionActiva =
        false;

}