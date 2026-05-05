# Billzen

> Sistema contable y de facturación electrónica para MiPyMEs colombianas.

Billzen es una plataforma web que permite a pequeñas y medianas empresas colombianas gestionar su facturación electrónica bajo los lineamientos de la DIAN, junto con módulos de contactos, artículos, gastos y reportes financieros — todo desde una intranet PWA que funciona incluso sin conexión a internet.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Módulos](#módulos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Identidad visual](#identidad-visual)
- [Convenciones de código](#convenciones-de-código)
- [Cómo contribuir](#cómo-contribuir)
- [Equipo](#equipo)

---

## Descripción general

Billzen está compuesto por dos partes principales:

- **Sitio público** — Página de presentación del producto, desplegada en GitHub Pages.
- **Intranet** — Aplicación web progresiva (PWA) para uso interno de las empresas registradas. Soporta modo offline mediante Service Worker e IndexedDB, y sincroniza automáticamente cuando se restablece la conexión.

---

## Stack tecnológico

### Frontend
- HTML5 / CSS3 / JavaScript vanilla (sin frameworks)
- PWA con Service Worker e IndexedDB para soporte offline
- Fuentes: [Fraunces](https://fonts.google.com/specimen/Fraunces), [Sora](https://fonts.google.com/specimen/Sora), [DM Mono](https://fonts.google.com/specimen/DM+Mono)
- Despliegue: GitHub Pages

### Backend
- Python 3.11+
- [FastAPI](https://fastapi.tiangolo.com/) — framework REST
- Autenticación con JWT
- Despliegue: servidor Python (VPS / servicio cloud)

### Base de datos
- MySQL 8.0 en Azure Database for MySQL

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Cliente (Browser)                 │
│                                                     │
│   ┌───────────────────────────────────────────┐     │
│   │             PWA — Intranet                │     │
│   │  HTML / CSS / JS vanilla                  │     │
│   │  Service Worker  ←→  IndexedDB            │     │
│   └────────────────────┬──────────────────────┘     │
└────────────────────────│────────────────────────────┘
                         │ HTTP / REST (JSON)
                         ▼
┌─────────────────────────────────────────────────────┐
│                 Backend — FastAPI                    │
│                                                     │
│   Rutas REST → Servicios → Repositorios             │
│   Autenticación JWT                                 │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           MySQL 8.0 — Azure Database                │
└─────────────────────────────────────────────────────┘
```

### Flujo offline

Cuando no hay conexión a internet, la PWA opera sobre IndexedDB de forma local. Al restaurarse la conexión, el Service Worker detecta el cambio y sincroniza automáticamente los datos pendientes con el backend.

---

## Módulos

Los módulos se desarrollan en el siguiente orden:

| # | Módulo | Estado | Descripción |
|---|--------|--------|-------------|
| 1 | Login / Registro | ✅ En desarrollo | Autenticación de empresa y usuario |
| 2 | Dashboard | 🔜 Pendiente | KPIs principales de la empresa |
| 3 | Facturación electrónica | 🔜 Pendiente | Emisión de facturas bajo estándar DIAN |
| 4 | Contactos | 🔜 Pendiente | Gestión de clientes y proveedores |
| 5 | Artículos | 🔜 Pendiente | Catálogo de productos y servicios |
| 6 | Gastos | 🔜 Pendiente | Registro y categorización de gastos |
| 7 | Reportes | 🔜 Pendiente | Informes financieros y exportación |
| 8 | Configuración | 🔜 Pendiente | Datos de empresa, usuarios y preferencias |

---

## Estructura del proyecto

```
bill_zen/
│
├── public/                  # Sitio público (GitHub Pages)
│   ├── index.html
│   ├── css/
│   └── js/
│
├── intranet/                # Aplicación PWA
│   ├── index.html           # Punto de entrada
│   ├── manifest.json        # Configuración PWA
│   ├── sw.js                # Service Worker
│   │
│   ├── modules/             # Un directorio por módulo
│   │   ├── login/
│   │   │   ├── login.html
│   │   │   ├── login.css
│   │   │   └── login.js
│   │   ├── dashboard/
│   │   ├── facturacion/
│   │   ├── contactos/
│   │   ├── articulos/
│   │   ├── gastos/
│   │   ├── reportes/
│   │   └── configuracion/
│   │
│   ├── shared/              # Recursos compartidos
│   │   ├── css/
│   │   │   └── variables.css    # Tokens de diseño globales
│   │   ├── js/
│   │   │   ├── api.js           # Cliente HTTP hacia el backend
│   │   │   ├── auth.js          # Manejo de JWT
│   │   │   ├── db.js            # Wrapper de IndexedDB
│   │   │   └── router.js        # Enrutador SPA
│   │   └── icons/               # Iconos SVG
│   │
│   └── assets/
│       └── fonts/
│
└── backend/                 # FastAPI (repositorio del backend — Camilo)
    ├── main.py
    ├── routers/
    ├── models/
    ├── schemas/
    └── database.py
```

---

## Cómo correr el proyecto

### Requisitos previos

- Git
- Python 3.11+
- pip
- Navegador moderno (Chrome, Firefox, Edge)
- Acceso a la base de datos MySQL en Azure (credenciales proporcionadas por el equipo)

### Frontend (sitio público e intranet)

El frontend es HTML/CSS/JS puro — no requiere build. Puedes abrirlo directamente en el navegador o usar un servidor local:

```bash
# Opción 1 — Extensión Live Server en VS Code / Antigravity
# Clic derecho sobre index.html → "Open with Live Server"

# Opción 2 — Python simple server
cd intranet/
python -m http.server 3000
# Abrir http://localhost:3000
```

### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/bill-zen-desarrollo/bill_zen.git
cd bill_zen/backend

# 2. Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de Azure MySQL

# 5. Correr el servidor
uvicorn main:app --reload --port 8000
```

La API estará disponible en `http://localhost:8000`.
Documentación interactiva (Swagger): `http://localhost:8000/docs`

### Variables de entorno requeridas

```env
DB_HOST=<host Azure MySQL>
DB_PORT=3306
DB_NAME=billzen
DB_USER=<usuario>
DB_PASSWORD=<contraseña>
JWT_SECRET=<clave secreta>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=60
```

> Las credenciales reales se comparten de forma segura entre los miembros del equipo. Nunca subir el archivo `.env` al repositorio.

---

## Identidad visual

### Paleta de colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--accent` | `#0a6f52` | Color principal, botones, enlaces |
| `--accent-dark` | `#075c43` | Hover de elementos accent |
| `--accent-light` | `#e6f4f0` | Fondos secundarios, badges |
| `--bg` | `#f5f3ef` | Fondo general de la aplicación |
| `--dark` | `#0f1117` | Texto principal |
| `--surface` | `#ffffff` | Tarjetas y paneles |
| `--muted` | `#6b6b6b` | Texto secundario |
| `--border` | `#ddd9d1` | Bordes y separadores |

### Tipografía

| Familia | Uso |
|---------|-----|
| Fraunces (italic) | Títulos, marca, display |
| Sora | Cuerpo de texto, UI general |
| DM Mono | Códigos, NITs, valores numéricos, badges técnicos |

### Reglas de diseño

- **Sin emojis** — se usan exclusivamente iconos SVG inline.
- Estilo fintech: profesional, limpio, sin efectos decorativos excesivos.
- Todos los colores se definen como variables CSS en `shared/css/variables.css`.
- Los iconos SVG se ubican en `shared/icons/` y se referencian por nombre.

---

## Convenciones de código

### General

- Todo el código y comentarios se escriben **en español**.
- Indentación: **2 espacios** (HTML, CSS, JS).
- Comillas: **simples** en JavaScript.
- Sin punto y coma opcional en JS — se usa siempre.

### HTML

- Estructura semántica: usar `<main>`, `<section>`, `<nav>`, `<article>` según corresponda.
- Los atributos `id` usan `kebab-case` (ej: `id="btn-login"`).
- Los atributos `class` usan `kebab-case` (ej: `class="form-group"`).

### CSS

- Variables globales en `shared/css/variables.css`.
- Cada módulo tiene su propio archivo CSS (ej: `login/login.css`).
- No usar `!important` salvo casos excepcionales justificados.
- Orden de propiedades: posición → display → box model → tipografía → visual → animación.

### JavaScript

- Variables y funciones en `camelCase` (ej: `handleLogin`, `formatNit`).
- Constantes globales en `UPPER_SNAKE_CASE`.
- Una función — una responsabilidad. Funciones cortas y descriptivas.
- Toda llamada al backend pasa por `shared/js/api.js`. No hacer `fetch` directo en los módulos.
- Manejo de errores con `try/catch` en todas las llamadas asíncronas.

### Git

- Ramas: `main` (producción), `develop` (desarrollo activo).
- Ramas de feature: `feature/nombre-modulo` (ej: `feature/dashboard`).
- Commits en español, en imperativo y descriptivos:
  ```
  ✅ Agrega validación de NIT en formulario de registro
  ✅ Corrige error de sincronización offline en módulo de gastos
  ❌ fix
  ❌ cambios varios
  ```
- Nunca hacer push directo a `main`. Siempre mediante Pull Request revisado.

---

## Cómo contribuir

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/bill-zen-desarrollo/bill_zen.git
   ```

2. **Crear una rama para tu módulo o corrección**
   ```bash
   git checkout -b feature/nombre-del-modulo
   ```

3. **Desarrollar y hacer commits descriptivos**
   ```bash
   git add .
   git commit -m "Agrega estructura base del módulo de contactos"
   ```

4. **Subir la rama**
   ```bash
   git push origin feature/nombre-del-modulo
   ```

5. **Abrir un Pull Request** hacia `develop` en GitHub con una descripción clara de los cambios.

6. **Revisión** — el otro miembro del equipo revisa y aprueba antes de hacer merge.

> Cada módulo nuevo debe incluir su HTML, CSS y JS dentro de su carpeta en `intranet/modules/`.

---

## Equipo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Juan Camilo Rojas | Frontend Developer | [@JuanCaRojas-18](https://github.com/JuanCaRojas-18) |
| Camilo Alarcón | Backend Developer | — |

---

*Billzen — Facturación electrónica para MiPyMEs colombianas.*
