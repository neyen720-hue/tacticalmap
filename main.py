import os

from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from database import engine, Base, SessionLocal
from models import Usuario


# =========================
# APLICACIÓN
# =========================

app = FastAPI(
    title="360 Tactical Trainer"
)


# =========================
# SESIONES
# =========================

app.add_middleware(
    SessionMiddleware,
    secret_key="360-tactical-trainer-secret"
)


# =========================
# BASE DE DATOS
# =========================

Base.metadata.create_all(
    bind=engine
)


# =========================
# ARCHIVOS ESTÁTICOS
# =========================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# =========================
# PLANTILLAS
# =========================

templates = Jinja2Templates(
    directory="templates"
)


# =========================
# CARPETA DE MAPAS
# =========================

MAPS_DIRECTORY = "static/maps"


# =========================
# PÁGINA PRINCIPAL
# =========================

@app.get(
    "/",
    response_class=HTMLResponse
)
async def inicio(request: Request):

    usuario_id = request.session.get(
        "usuario_id"
    )

    if usuario_id is None:

        return RedirectResponse(
            "/usuarios",
            status_code=303
        )

    db: Session = SessionLocal()

    try:

        usuario = (
            db.query(Usuario)
            .filter(
                Usuario.id == usuario_id
            )
            .first()
        )

        if usuario is None:

            request.session.clear()

            return RedirectResponse(
                "/usuarios",
                status_code=303
            )

        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={
                "usuario": usuario
            }
        )

    finally:

        db.close()


# =========================
# SELECCIÓN DE USUARIO
# =========================

@app.get(
    "/usuarios",
    response_class=HTMLResponse
)
async def usuarios(request: Request):

    db: Session = SessionLocal()

    try:

        lista_usuarios = (
            db.query(Usuario)
            .filter(
                Usuario.activo == True
            )
            .order_by(
                Usuario.nombre_completo
            )
            .all()
        )

        return templates.TemplateResponse(
            request=request,
            name="usuarios.html",
            context={
                "usuarios": lista_usuarios
            }
        )

    finally:

        db.close()


# =========================
# CREAR USUARIO
# =========================

@app.post(
    "/usuarios/crear"
)
async def crear_usuario(

    nombre_usuario: str = Form(...),

    nombre_completo: str = Form(...),

    rol: str = Form(...)

):

    db: Session = SessionLocal()

    try:

        usuario_existente = (
            db.query(Usuario)
            .filter(
                Usuario.nombre_usuario
                == nombre_usuario
            )
            .first()
        )

        if usuario_existente:

            return RedirectResponse(
                "/usuarios",
                status_code=303
            )

        nuevo_usuario = Usuario(

            nombre_usuario=nombre_usuario,

            nombre_completo=nombre_completo,

            rol=rol

        )

        db.add(
            nuevo_usuario
        )

        db.commit()

        return RedirectResponse(
            "/usuarios",
            status_code=303
        )

    finally:

        db.close()


# =========================
# INICIAR SESIÓN
# =========================

@app.get(
    "/usuarios/entrar/{usuario_id}"
)
async def entrar_usuario(

    request: Request,

    usuario_id: int

):

    db: Session = SessionLocal()

    try:

        usuario = (
            db.query(Usuario)
            .filter(
                Usuario.id == usuario_id,
                Usuario.activo == True
            )
            .first()
        )

        if usuario is None:

            return RedirectResponse(
                "/usuarios",
                status_code=303
            )

        request.session[
            "usuario_id"
        ] = usuario.id

        return RedirectResponse(
            "/",
            status_code=303
        )

    finally:

        db.close()


# =========================
# CERRAR SESIÓN
# =========================

@app.get(
    "/logout"
)
async def logout(
    request: Request
):

    request.session.clear()

    return RedirectResponse(
        "/usuarios",
        status_code=303
    )


# =========================
# MAPA TÁCTICO
# =========================

@app.get(
    "/mapa",
    response_class=HTMLResponse
)
async def mapa(
    request: Request
):

    usuario_id = request.session.get(
        "usuario_id"
    )

    if usuario_id is None:

        return RedirectResponse(
            "/usuarios",
            status_code=303
        )

    db: Session = SessionLocal()

    try:

        usuario = (
            db.query(Usuario)
            .filter(
                Usuario.id == usuario_id
            )
            .first()
        )

        if usuario is None:

            request.session.clear()

            return RedirectResponse(
                "/usuarios",
                status_code=303
            )

        mapas = []

        if os.path.exists(
            MAPS_DIRECTORY
        ):

            mapas = [
                archivo
                for archivo in os.listdir(
                    MAPS_DIRECTORY
                )
                if archivo.lower().endswith(
                    (
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".webp"
                    )
                )
            ]

        return templates.TemplateResponse(
            request=request,
            name="mapa.html",
            context={
                "usuario": usuario,
                "mapas": mapas
            }
        )

    finally:

        db.close()