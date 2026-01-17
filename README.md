ENTREGABLE – SISTEMA BANCARIO (FRONTEND + BACKEND)

IMPORTANTE
Este proyecto fue diseñado para funcionar de DOS MANERAS:
1) EJECUCIÓN LOCAL
2) EJECUCIÓN CON DOCKER

El sistema puede ejecutarse tanto de forma local como mediante Docker,
permitiendo flexibilidad para desarrollo y despliegue.
Ambas modalidades son totalmente funcionales.

--------------------------------------------------
TECNOLOGÍAS UTILIZADAS
--------------------------------------------------

BACKEND
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- PostgreSQL

FRONTEND
- React
- Vite
- JavaScript
- CSS

INFRAESTRUCTURA
- Docker
- Docker Compose
- Nginx (para frontend en Docker)

--------------------------------------------------
FORMA 1: EJECUCIÓN LOCAL (SIN DOCKER PARA FRONTEND Y BACKEND)
--------------------------------------------------

En esta modalidad el BACKEND y el FRONTEND se ejecutan de forma local.
La base de datos PostgreSQL se ejecuta utilizando Docker únicamente
como motor de base de datos.

PASO 1: LEVANTAR BASE DE DATOS

El sistema permite DOS FORMAS para levantar la base de datos,
dependiendo del entorno de ejecución deseado.

OPCIÓN A: BASE DE DATOS CON DOCKER (POSTGRESQL - RECOMENDADO)

Desde la raíz del proyecto ejecutar:

docker compose up -d db

Credenciales de la base de datos:
- Base de datos: banco
- Usuario: postgres
- Contraseña: postgres
- Puerto: 5432

Esta opción utiliza PostgreSQL ejecutándose en un contenedor Docker
y es la recomendada para mantener consistencia con el entorno de despliegue.

--------------------------------------------------

OPCIÓN B: BASE DE DATOS EN MEMORIA (H2 - MODO LOCAL)

Al ejecutar el backend con Maven, el sistema puede funcionar utilizando
una base de datos en memoria H2 para pruebas locales rápidas.

Para ejecutar el backend con Maven:

mvn spring-boot:run

En este modo no es necesario levantar PostgreSQL,
ya que la base de datos se crea automáticamente en memoria.

Esta opción está pensada únicamente para desarrollo local
y pruebas rápidas del sistema.

PASO 2: EJECUTAR BACKEND
Desde la carpeta api ejecutar:

mvn spring-boot:run

Backend disponible en:
http://localhost:8080

PASO 3: EJECUTAR FRONTEND
En la carpeta banco-front crear el archivo .env basado en .env.example
con el siguiente contenido:

VITE_API_URL=http://localhost:8080

Luego ejecutar:

npm install
npm run dev

Frontend disponible en:
http://localhost:5173

--------------------------------------------------
FORMA 2: EJECUCIÓN CON DOCKER (STACK COMPLETO)
--------------------------------------------------

En esta modalidad TODO el sistema (frontend, backend y base de datos)
se ejecuta mediante Docker Compose.

PASO ÚNICO:
Desde la raíz del proyecto ejecutar:

docker compose up -d

La aplicación quedará disponible en:
http://localhost

--------------------------------------------------
IMPORTACIÓN DE LA BASE DE DATOS
--------------------------------------------------

En la raíz del proyecto se incluyen los archivos:
- BaseDatos.sql
- BaseDatos_con_datos.sql

Para importar la base de datos desde el contenedor PostgreSQL ejecutar:

docker cp BaseDatos_con_datos.sql entregable_xavieraguilar-db-1:/tmp/BaseDatos_con_datos.sql
docker exec -it entregable_xavieraguilar-db-1 psql -U postgres -d banco -f /tmp/BaseDatos_con_datos.sql

--------------------------------------------------
CAPTURAS DE PANTALLA DEL SISTEMA
--------------------------------------------------

A continuación se presentan capturas de pantalla del funcionamiento
del sistema. Las imágenes se muestran directamente en este README.

GESTIÓN DE CLIENTES
<img width="1196" height="514" alt="Captura de pantalla 2026-01-17 041048" src="https://github.com/user-attachments/assets/c3cb6161-f976-4348-909e-b721daa4f174" />
<img width="1148" height="514" alt="Captura de pantalla 2026-01-17 041058" src="https://github.com/user-attachments/assets/ae5f49ff-19be-407f-a5a1-f5d03c568a07" />

Imagen de la pantalla donde se visualiza el listado, creación y edición
de clientes del sistema.

GESTIÓN DE CUENTAS
<img width="1241" height="434" alt="Captura de pantalla 2026-01-17 041107" src="https://github.com/user-attachments/assets/f87821f2-d0cf-4b55-a617-1bc003e43254" />
<img width="1133" height="347" alt="Captura de pantalla 2026-01-17 041114" src="https://github.com/user-attachments/assets/c2f0e101-30df-4d01-827c-9560ccfbe02f" />

Imagen de la pantalla de creación y listado de cuentas bancarias
asociadas a los clientes.

GESTIÓN DE MOVIMIENTOS
<img width="1226" height="458" alt="Captura de pantalla 2026-01-17 041128" src="https://github.com/user-attachments/assets/50c872ff-e3ba-422f-9abd-30416c5d04e8" />
<img width="1898" height="475" alt="Captura de pantalla 2026-01-17 041132" src="https://github.com/user-attachments/assets/d1d55683-64aa-425d-aaa7-e718eb6d854a" />

Imagen donde se muestran los movimientos de las cuentas,
incluyendo depósitos y retiros.

REPORTES
<img width="1672" height="978" alt="Captura de pantalla 2026-01-17 041202" src="https://github.com/user-attachments/assets/999770da-c2dc-4dc5-8281-e3b80344a50c" />

Imagen de la pantalla de generación de reportes por cliente
y rango de fechas.

REPORTES EN PDF
<img width="2092" height="1148" alt="Captura de pantalla 2026-01-17 041212" src="https://github.com/user-attachments/assets/58f80c0f-7b35-4d4c-94af-c8be33c20fca" />

Imagen donde se muestra la descarga y visualización
del estado de cuenta en formato PDF.

--------------------------------------------------
ESTRUCTURA DEL PROYECTO
--------------------------------------------------

Entregable_XavierAguilar
|
|-- api                Backend Spring Boot
|-- banco-front        Frontend React
|-- docker-compose.yml
|-- BaseDatos.sql
|-- BaseDatos_con_datos.sql
|-- README

--------------------------------------------------
FUNCIONALIDADES PRINCIPALES
--------------------------------------------------

- Gestión de clientes
- Gestión de cuentas bancarias
- Registro de movimientos
- Generación de reportes
- Exportación de reportes en PDF
- Ejecución en modo local y mediante Docker

--------------------------------------------------
AUTOR
--------------------------------------------------

Xavier Aguilar

