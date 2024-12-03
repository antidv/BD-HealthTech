## Requisitos para levantar localmente el proyecto en su estado actual

### Prerrequisitos

Asegúrate de tener instalados estos elementos:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/downloads)

### Cómo levantar el proyecto localmente

1. Descarga los módulos necesarios de node para el backend con el siguiente comando:

   ```bash
   npm ci
   ```

1. Dirígete a la carpeta client, en la misma terminal, ejecutando el comando:

   ```bash
   cd client
   ```

   En la carpeta client, ejecuta el siguiente comando en la terminal:

   ```bash
   npm ci
   ```

1. Luego, dirígete a la carpeta principal del código fuente. Puedes hacerlo ejecutando en la misma terminal abierta, el siguiente comando:

   ```bash
   cd ..
   ```

   En la carpeta principal del código fuente, ejecuta en la terminal el siguiente comando:

   ```bash
   npm run dev
   ```

   Con ello, se ejecutará el servidor local para el backend. Recuerda tener configurado el archivo _.env_

   Si quieres ejecutar el servidor y que este se actualice automaticamente con cada cambio realizado, ejecuta el siguiente comando en lugar del anterior:

   ```bash
   npm run dev
   ```

1. En la carpeta client, a la que puedes desplazarte otra vez, con el comando:

   ```bash
   cd client
   ```

   Ejecuta el siguiente comando en la terminal:

   ```bash
   npm run dev
   ```

   Con ello, se ejecutará el servidor local para el frontend.

1. Dirígete al al servidor local ingresando el siguiente link en tu navegador: http://localhost:5173/

# Cuentas

1. Admin:
- Correo: admin@correo.com
- Contraseña: admin123

1. Medico:
- Correo: medico1@correo.com
- Contraseña: medico123

1. Paciente:
- Correo: paciente1@correo.com
- Contraseña: paciente123