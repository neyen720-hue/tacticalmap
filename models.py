from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Usuario(Base):

    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nombre_usuario = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False
    )

    nombre_completo = Column(
        String(100),
        nullable=False
    )

    rol = Column(
        String(30),
        nullable=False,
        default="infanteria"
    )

    activo = Column(
        Boolean,
        default=True
    )