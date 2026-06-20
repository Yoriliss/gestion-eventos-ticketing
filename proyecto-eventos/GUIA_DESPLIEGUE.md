# Guia de Despliegue (gratuita)

Esta guia te permite obtener el "enlace de aplicacion desplegada" que pide la entrega, usando servicios gratuitos.

## Opcion recomendada: Render (backend + base de datos) + Vercel (frontend)

### 1. Sube el codigo a GitHub
```bash
cd proyecto-eventos
git init
git add .
git commit -m "Proyecto integrador: sistema de gestion de eventos con ticketing"
```
Crea un repositorio nuevo en https://github.com/new y luego:
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### 2. Crea la base de datos en Render
1. Entra a https://render.com y crea una cuenta (puedes usar tu cuenta de GitHub).
2. Click en "New +" -> "PostgreSQL".
3. Dale un nombre (ej. `eventos-db`), region cercana, plan Free.
4. Una vez creada, copia los datos de conexion: Hostname, Port, Database, User, Password.

### 3. Despliega el backend en Render
1. Click en "New +" -> "Web Service".
2. Conecta tu repositorio de GitHub.
3. Configura:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
4. En la seccion "Environment", agrega las variables (usa los datos de la base de datos del paso 2):
   - `DB_HOST`
   - `DB_PORT` = 5432
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `JWT_SECRET` = (genera una clave larga y aleatoria)
   - `CORS_ORIGINS` = (la URL de tu frontend en Vercel, la agregas despues del paso 4)
5. Click en "Create Web Service". Render te dara una URL como `https://eventos-backend.onrender.com`.

### 4. Despliega el frontend en Vercel
1. Entra a https://vercel.com y crea una cuenta con GitHub.
2. Click en "Add New" -> "Project" y selecciona tu repositorio.
3. Configura:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
4. En "Environment Variables" agrega:
   - `REACT_APP_API_URL` = `https://eventos-backend.onrender.com/api` (la URL del paso 3)
5. Click en "Deploy". Vercel te dara una URL como `https://eventos-frontend.vercel.app`.

### 5. Conecta CORS
Vuelve a Render, en las variables de entorno del backend, actualiza `CORS_ORIGINS` con la URL de Vercel del paso 4, y haz "Manual Deploy" para que tome el cambio.

### 6. Prueba la app
Abre la URL de Vercel, registra un usuario, inicia sesion, y prueba comprar un ticket de un evento (puedes crear eventos de prueba directamente en la base de datos o agregando temporalmente un usuario admin).

> **Nota:** el plan gratuito de Render "duerme" el backend tras 15 minutos sin uso; la primera peticion despues de eso puede tardar unos segundos en responder. Es normal y no afecta la calificacion.

## Alternativa rapida (solo para demo, sin persistencia real)

Si el tiempo es muy limitado, tambien puedes usar Railway (https://railway.app) que permite desplegar backend + PostgreSQL + frontend desde el mismo repositorio en pocos clics, con un flujo muy similar al de Render.
