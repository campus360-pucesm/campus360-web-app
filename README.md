# Campus360 Web App

Interfaz de usuario unificada para el ecosistema Campus360. Desarrollada con React y Vite.

## Instalación y Ejecución

Asegúrate de tener instaladas las dependencias. Si clonaste este repositorio por primera vez, ejecuta:

```bash
npm install
```

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Arquitectura

La aplicación se comunica exclusivamente con el **API Gateway** (`http://localhost:8000`), el cual redirige las peticiones a los microservicios correspondientes.
