# Manual del Freedom POS para Principiantes

Este manual simple le guiará a través de todo el proceso de descarga, instalación, ejecución y generación de las versiones web y desktop de Freedom POS.

## Índice

1. [Requisitos Básicos](#requisitos-básicos)
2. [Descargando el Freedom POS](#descargando-el-freedom-pos)
3. [Instalación](#instalación)
4. [Ejecutando la Versión Web](#ejecutando-la-versión-web)
5. [Ejecutando la Versión Desktop](#ejecutando-la-versión-desktop)
6. [Generando la Versión Web Localmente](#generando-la-versión-web-localmente)
7. [Generando las Versiones Desktop](#generando-las-versiones-desktop)
8. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Requisitos Básicos

Para trabajar con Freedom POS, necesitará:

- Un ordenador con Windows 10/11, macOS o Linux
- Acceso a internet
- Aproximadamente 4GB de espacio libre en disco
- Al menos 4GB de RAM (8GB recomendado)

## Descargando el Freedom POS

### Para usuarios comunes (manera más simple)

Si solo desea usar Freedom POS sin modificarlo:

1. Visite la página de releases: [https://github.com/Takk8IS/FreedomPOS/releases](https://github.com/Takk8IS/FreedomPOS/releases)
2. Descargue la versión más reciente para su sistema operativo:
    - Para Windows: archivo `.msi`
    - Para macOS: archivo `.dmg`
    - Para Linux: archivo `.AppImage` o `.deb`

### Para desarrolladores y usuarios avanzados

Si desea modificar, ejecutar o compilar Freedom POS a partir del código fuente:

1. Instale Git:

    - **Windows**: Descargue e instale desde el [sitio oficial de Git](https://git-scm.com/download/win)
    - **macOS**: Abra el Terminal y escriba `xcode-select --install`
    - **Linux**: Use `sudo apt install git` (Ubuntu/Debian) o comando equivalente para su distribución

2. Abra el terminal (o prompt de comando en Windows)

3. Clone el repositorio con el comando:

    ```
    git clone https://github.com/Takk8IS/FreedomPOS.git
    ```

4. Entre en la carpeta del proyecto:
    ```
    cd FreedomPOS
    ```

## Instalación

Si ha descargado una versión precompilada (archivo .msi, .dmg o .AppImage), simplemente ejecute el instalador y siga las instrucciones en pantalla.

Para trabajar con el código fuente, siga estos pasos:

### 1. Instale Node.js

Node.js es necesario para ejecutar y compilar el proyecto.

- **Windows/macOS**:

    1. Acceda a [https://nodejs.org/](https://nodejs.org/)
    2. Descargue la versión LTS (recomendada)
    3. Ejecute el instalador y siga las instrucciones

- **Linux**:
    ```
    sudo apt update
    sudo apt install nodejs npm
    ```

### 2. Instale Rust (necesario para la versión desktop)

- **Windows**:

    1. Descargue y ejecute el [instalador de Rust](https://www.rust-lang.org/tools/install)
    2. Siga las instrucciones en pantalla

- **macOS/Linux**:
    1. Abra el terminal y ejecute:
        ```
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        ```
    2. Siga las instrucciones y seleccione la instalación estándar
    3. Después de la instalación, cierre y vuelva a abrir el terminal

### 3. Instale dependencias adicionales para compilación

- **Windows**:

    1. Instale las [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
    2. Durante la instalación, seleccione "Desarrollo para Desktop con C++"

- **macOS**:

    ```
    xcode-select --install
    ```

- **Linux** (Ubuntu/Debian):
    ```
    sudo apt update
    sudo apt install libwebkit2gtk-4.0-dev build-essential libssl-dev libgtk-3-dev libappindicator3-dev librsvg2-dev
    ```

### 4. Instale las dependencias del proyecto

En el terminal, dentro de la carpeta del proyecto, ejecute:

```
npm install
```

Espere a que se complete la instalación (puede llevar algunos minutos).

## Ejecutando la Versión Web

Para ejecutar la versión web localmente:

1. En el terminal, en la carpeta del proyecto, ejecute:

    ```
    npm run dev
    ```

2. Espere hasta ver un mensaje informando que el servidor está listo.

3. Abra su navegador y acceda a:

    ```
    http://localhost:3000
    ```

4. Para detener el servidor, vuelva al terminal y presione `Ctrl+C`

## Ejecutando la Versión Desktop

Para ejecutar la versión desktop durante el desarrollo:

1. En el terminal, en la carpeta del proyecto, ejecute:

    ```
    npm run tauri dev
    ```

2. Espere a la compilación (puede tardar algunos minutos la primera vez).

3. La aplicación desktop se iniciará automáticamente.

4. Para finalizar, cierre la ventana de la aplicación y presione `Ctrl+C` en el terminal.

## Generando la Versión Web Localmente

Para crear una versión publicable del sitio:

1. En el terminal, en la carpeta del proyecto, ejecute:

    ```
    npm run build
    ```

2. Espere a que se complete el proceso de build.

3. Los archivos de la versión web estarán en la carpeta `out`.

4. Para probar localmente, puede usar:

    ```
    npx serve out
    ```

5. Para publicar, simplemente copie el contenido de la carpeta `out` a su servidor web.

## Generando las Versiones Desktop

### Generando para su sistema actual

Para generar una versión desktop para el sistema operativo que está usando:

1. En el terminal, en la carpeta del proyecto, ejecute:

    ```
    npm run tauri build
    ```

2. Espere a que se complete el proceso de build (puede llevar varios minutos).

3. Los archivos de instalación se generarán en la carpeta:

    ```
    src-tauri/target/release/bundle/
    ```

4. Encontrará el instalador apropiado para su sistema:
    - Windows: archivo `.msi`
    - macOS: archivo `.dmg` y carpeta `.app`
    - Linux: archivos `.AppImage`, `.deb` y otros dependiendo de la distribución

### Generando para otros sistemas operativos

En general, **no es posible** compilar directamente un instalador para un sistema operativo diferente del que está usando. Por ejemplo, no puede generar un instalador de macOS desde Windows.

Para generar instaladores para todos los sistemas, tiene las siguientes opciones:

#### Opción 1: Usar GitHub Actions (Recomendado)

Freedom POS ya tiene configuraciones para compilación automática. Para usar:

1. Haga un fork del repositorio a su cuenta de GitHub
2. Haga los cambios deseados en el código
3. Cree una nueva etiqueta de versión:
    ```
    git tag v1.0.x
    git push origin v1.0.x
    ```
4. GitHub Actions automáticamente compilará versiones para Windows, macOS y Linux
5. Podrá descargar los instaladores de la sección "Releases" de su repositorio

#### Opción 2: Usar máquinas virtuales o contenedores

Puede configurar máquinas virtuales con los diferentes sistemas operativos y hacer la compilación en cada uno de ellos.

## Solución de Problemas Comunes

### Error "Comando no encontrado"

- Verifique que Node.js esté instalado correctamente
- Cierre y vuelva a abrir el terminal
- Verifique que está en la carpeta correcta del proyecto

### Errores durante npm install

- Verifique su conexión a internet
- Intente ejecutar `npm cache clean --force` y luego intente nuevamente
- Si está en una red corporativa, verifique la configuración del proxy

### Errores en la compilación de la versión desktop

- Verifique que Rust esté instalado correctamente
- Ejecute `rustup update` para actualizar Rust
- Verifique que todas las dependencias del sistema estén instaladas
- Verifique el espacio disponible en el disco

### La aplicación web no se abre

- Verifique que el servidor esté funcionando (debe mostrar mensajes en el terminal)
- Intente acceder usando otro navegador
- Verifique que el puerto 3000 no esté bloqueado por el firewall

### La ventana de la aplicación desktop aparece en blanco

- Verifique los logs en el terminal para identificar errores
- Intente reinstalar las dependencias con `npm install`
- Verifique que su sistema cumple con los requisitos mínimos

### Dónde obtener ayuda adicional

- Verifique la [documentación oficial](https://github.com/Takk8IS/FreedomPOS/docs/)
- Visite la [sección de issues](https://github.com/Takk8IS/FreedomPOS/issues) para problemas conocidos
- Cree un nuevo issue detallando su problema si no encuentra solución

---

Este manual fue creado para ayudar a principiantes a trabajar con Freedom POS. Para información más detallada, consulte la documentación completa en el repositorio.

## Licence

Copyright (c)
License: Attribution 4.0 International (CC BY 4.0)
Author: David C Cavalcante

## Donations

If this project has been helpful, consider making a donation:

**USDT (TRC-20)**: `TP6zpvjt2ZNGfWKPevfp65ZrcbKMWSQXDi`

Your support helps us continue to develop innovative tools.

## Support

To contribute to public and social projects focused on research and artificial intelligence, feel free to support with any amount you prefer.

## About the Author

David C Cavalcante

- Philosopher & Writer, Artificial Intelligence Consultant Tech Lead, Researcher & Author, Strategic Marketing & Design Specialist, Developer & Software Engineer

- **LinkedIn**: [linkedin.com/in/hellodav](https://linkedin.com/in/hellodav/)
- **Medium**: [medium.com/@davcavalcante](https://medium.com/@davcavalcante/)

Takk™ Innovate Studio

- Positive results, rapid innovation
- Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team

- **GitHub**: [github.com/takk8is](https://github.com/takk8is)
- **X**: [x.com/takk8is](https://x.com/takk8is/)
- **Medium**: [takk8is.medium.com](https://takk8is.medium.com/)
- **URL**: [takk.ag](https://takk.ag/)
