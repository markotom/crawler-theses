Crawler Theses
==============

Requerimientos:

* Node.js >= 6
* MongoDB

![Advertencia](https://placeholdit.imgix.net/~text?txtsize=20&bg=ff0000&txtclr=ffffff&txt=EL+MAL+USO+DE+ESTE+DESARROLLO+ES+RESPONSABILIDAD+DE+QUIEN+LO+REPRODUCE%2C+INSTALA+Y+EJECUTA.&w=310&h=110&txttrack=2&fm=png)

## Instalación

Una vez instalado [node.js](https://nodejs.org/en/), desde la terminal o consola instalamos los componentes necesarios:

```
$ npm install
```

## Configuración

Crear un archivo de configuración del entorno requerido basado en [config/default.js](./config/default.js) (v. g. config/development.js, config/production.js). Añadir las opciones requeridas para la base de datos y los criterios de búsqueda.

## Uso

En la terminal, ejecuta el siguiente *script*:

```
$ npm run crawl
```

Luego, empezará el rastreo por paquetes de datos:

![Sample](https://raw.githubusercontent.com/markotom/crawler-theses/master/sample.png)

## Licencia

MIT
