# Sistema de Gestión de Inventario

Sistema completo de gestión de inventario de productos con API REST, interfaz web, base de datos MySQL y pruebas automatizadas completas (unitarias, de integración y E2E).

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [API Endpoints](#api-endpoints)
- [Pipeline CI/CD](#pipeline-cicd)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Decisiones Técnicas](#decisiones-técnicas)

---

## Descripción

Este proyecto es un sistema completo de gestión de inventario que permite administrar productos y categorías. Incluye una API REST con arquitectura por capas, una interfaz web responsive, integración con base de datos MySQL y un conjunto completo de pruebas automatizadas.

El proyecto fue desarrollado como parte de la asignatura Pruebas de Software y demuestra la implementación de:
- Arquitectura por capas (modelos, servicios, controladores)
- Operaciones CRUD completas
- Validación de datos
- Pruebas automatizadas (unitarias, integración, E2E)
- Análisis estático de código
- Pipeline de integración continua

---

## Características

### Funcionalidades Principales

#### Gestión de Categorías
- ✅ Crear categorías
- ✅ Listar todas las categorías
- ✅ Obtener categoría por ID
- ✅ Actualizar categorías
- ✅ Eliminar categorías
- ✅ Validación de nombres únicos

#### Gestión de Productos
- ✅ Crear productos con toda su información
- ✅ Listar todos los productos
- ✅ Obtener producto por ID
- ✅ Actualizar productos
- ✅ Eliminar productos
- ✅ Filtrar productos por categoría
- ✅ Validación de datos (precios, stock, categorías)

#### Interfaz Web
- ✅ Interfaz intuitiva con pestañas
- ✅ Formularios de creación
- ✅ Listado con información completa
- ✅ Edición mediante modales
- ✅ Confirmación de eliminaciones
- ✅ Filtrado por categorías
- ✅ Mensajes de notificación (toast)

#### Calidad y Testing
- ✅ 19 pruebas unitarias
- ✅ 18 pruebas de integración
- ✅ 5 pruebas E2E
- ✅ Análisis estático con ESLint
- ✅ Cobertura de código 100% en servicios
- ✅ Pipeline CI/CD con GitHub Actions

---

## Arquitectura

El proyecto sigue una **arquitectura por capas** que separa las responsabilidades:

```
┌─────────────────────────────────────┐
│     Interfaz Web (public/)          │
│   HTML + CSS + JavaScript           │
└────────────┬────────────────────────┘
             │ HTTP Requests
             ▼
┌─────────────────────────────────────┐
│     Controladores (controllers/)    │
│   - Manejo de requests/responses    │
│   - Validación de entrada           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Servicios (services/)           │
│   - Lógica de negocio               │
│   - Validaciones complejas          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Modelos (models/)               │
│   - Definición de esquemas          │
│   - Relaciones entre entidades      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Base de Datos (MySQL)           │
│   - categories                      │
│   - products                        │
└─────────────────────────────────────┘
```

### Capas del Sistema

1. **Capa de Presentación (Frontend)**
   - Archivos HTML, CSS y JavaScript en `public/`
   - Comunicación con API mediante Fetch API
   - Manejo de estado local

2. **Capa de Controladores**
   - Punto de entrada de las peticiones HTTP
   - Validación de datos de entrada
   - Formateo de respuestas

3. **Capa de Servicios**
   - Lógica de negocio
   - Interacción con modelos
   - Manejo de errores

4. **Capa de Modelos**
   - Definición de esquemas con Sequelize
   - Relaciones entre entidades
   - Validaciones a nivel de BD

5. **Capa de Datos**
   - MySQL como motor de base de datos
   - Gestión de conexiones mediante Sequelize

---

## Tecnologías

### Backend
- **Node.js** v18+ - Runtime de JavaScript
- **Express** v4.18 - Framework web
- **Sequelize** v6.35 - ORM para MySQL
- **MySQL2** v3.6 - Driver de MySQL
- **dotenv** v16.3 - Gestión de variables de entorno
- **cors** v2.8 - Manejo de CORS

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript (Vanilla)** - Lógica de cliente

### Testing
- **Jest** v29.7 - Framework de pruebas unitarias e integración
- **Supertest** v6.3 - Testing de endpoints HTTP
- **Playwright** v1.40 - Pruebas E2E
- **@playwright/test** v1.40 - Test runner de Playwright

### Herramientas de Desarrollo
- **ESLint** v8.55 - Análisis estático de código
- **Nodemon** v3.0 - Hot reload en desarrollo

### CI/CD
- **GitHub Actions** - Pipeline de integración continua

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **npm** v9 o superior (viene con Node.js)
- **MySQL** v8.0 o superior ([Descargar](https://dev.mysql.com/downloads/))
- **Git** ([Descargar](https://git-scm.com/))

Verifica las instalaciones:

```bash
node --version  # Debe ser v18 o superior
npm --version   # Debe ser v9 o superior
mysql --version # Debe ser v8.0 o superior
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/inventario-pruebas.git
cd inventario-pruebas
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias definidas en `package.json`.

### 3. Instalar navegadores para Playwright (opcional, solo para E2E)

```bash
npx playwright install chromium
```

---

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=inventario_db
DB_USER=root
DB_PASSWORD=tu_password_mysql

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 2. Configuración de MySQL

Asegúrate de que MySQL esté corriendo y crea la base de datos:

```bash
mysql -u root -p
```

Dentro de MySQL:

```sql
CREATE DATABASE inventario_db;
EXIT;
```

**Nota:** No necesitas crear las tablas manualmente. Sequelize las creará automáticamente al iniciar la aplicación.

---

## Base de Datos

### Esquema de Base de Datos

El sistema utiliza dos tablas principales:

#### Tabla `categories`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | Identificador único |
| name | VARCHAR(100) UNIQUE NOT NULL | Nombre de la categoría |
| createdAt | DATETIME | Fecha de creación |
| updatedAt | DATETIME | Fecha de actualización |

#### Tabla `products`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | Identificador único |
| name | VARCHAR(200) NOT NULL | Nombre del producto |
| description | TEXT | Descripción del producto |
| price | DECIMAL(10,2) NOT NULL | Precio (debe ser >= 0) |
| stock | INT NOT NULL | Cantidad en stock (debe ser >= 0) |
| category_id | INT (FK) NOT NULL | Referencia a categories(id) |
| createdAt | DATETIME | Fecha de creación |
| updatedAt | DATETIME | Fecha de actualización |

### Relaciones

- Un producto pertenece a una categoría (many-to-one)
- Una categoría puede tener muchos productos (one-to-many)

### Sincronización Automática

Al iniciar la aplicación, Sequelize sincroniza automáticamente los modelos con la base de datos:

```javascript
await sequelize.sync(); // Crea las tablas si no existen
```

---

## Ejecución

### Modo Desarrollo

Inicia el servidor con hot reload (se reinicia automáticamente al hacer cambios):

```bash
npm run dev
```

### Modo Producción

Inicia el servidor normalmente:

```bash
npm start
```

### Acceder a la Aplicación

Una vez iniciado el servidor:

- **Interfaz Web:** http://localhost:3000
- **API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/api/health

Deberías ver en la consola:

```
✓ Database connection established successfully
✓ Database synchronized successfully

🚀 Server running on port 3000
📡 API available at http://localhost:3000/api
🌐 Web interface at http://localhost:3000
```

---

## Pruebas

El proyecto incluye un conjunto completo de pruebas automatizadas.

### Ejecutar Todas las Pruebas

```bash
npm test
```

Este comando ejecuta todas las pruebas y genera un reporte de cobertura en la carpeta `coverage/`.

### Pruebas Unitarias

Prueban la lógica de los servicios de forma aislada:

```bash
npm run test:unit
```

**Ubicación:** `src/tests/unit/`

**Cobertura:**
- CategoryService (9 pruebas)
- ProductService (10 pruebas)

### Pruebas de Integración

Prueban los endpoints de la API con la base de datos:

```bash
npm run test:integration
```

**Ubicación:** `src/tests/integration/`

**Cobertura:**
- Categories API (12 pruebas)
- Products API (18 pruebas)

**Nota:** Estas pruebas usan una base de datos de prueba que se limpia antes de cada test.

### Pruebas End-to-End (E2E)

Prueban el flujo completo desde la interfaz de usuario:

```bash
npm run test:e2e
```

**Ubicación:** `src/tests/e2e/`

**Cobertura:**
- Flujo completo de creación
- Edición de productos
- Eliminación de productos
- Filtrado por categorías
- Health check de API

**Requisitos:**
- El servidor debe estar corriendo o se iniciará automáticamente
- Playwright debe estar instalado con navegadores

### Análisis Estático de Código

Ejecuta ESLint para verificar el estilo y calidad del código:

```bash
npm run lint
```

Para corregir automáticamente problemas:

```bash
npm run lint:fix
```

### Reporte de Cobertura

Después de ejecutar las pruebas, puedes ver el reporte de cobertura:

```bash
npm test
# Luego abre: coverage/lcov-report/index.html
```

### Plan de Pruebas Detallado

Para ver todos los casos de prueba documentados, consulta:

📄 [PLAN_DE_PRUEBAS.md](PLAN_DE_PRUEBAS.md)

---

## API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Categories

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/categories` | Obtener todas las categorías | - |
| GET | `/categories/:id` | Obtener categoría por ID | - |
| POST | `/categories` | Crear nueva categoría | `{ "name": "string" }` |
| PUT | `/categories/:id` | Actualizar categoría | `{ "name": "string" }` |
| DELETE | `/categories/:id` | Eliminar categoría | - |

### Products

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/products` | Obtener todos los productos | - |
| GET | `/products/:id` | Obtener producto por ID | - |
| GET | `/products/category/:categoryId` | Obtener productos por categoría | - |
| POST | `/products` | Crear nuevo producto | Ver abajo ⬇️ |
| PUT | `/products/:id` | Actualizar producto | Ver abajo ⬇️ |
| DELETE | `/products/:id` | Eliminar producto | - |

### Body para POST/PUT Products

```json
{
  "name": "Laptop Gaming",
  "description": "High-performance gaming laptop",
  "price": 1200.00,
  "stock": 15,
  "category_id": 1
}
```

### Respuestas

#### Respuesta Exitosa

```json
{
  "success": true,
  "data": { ... }
}
```

#### Respuesta de Error

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Ejemplos de Uso

#### Crear una Categoría

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics"}'
```

#### Obtener Todos los Productos

```bash
curl http://localhost:3000/api/products
```

#### Crear un Producto

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 1200,
    "stock": 10,
    "category_id": 1
  }'
```

---

## Pipeline CI/CD

El proyecto incluye un pipeline de GitHub Actions que se ejecuta automáticamente en cada push o pull request.

### Archivo de Configuración

📄 `.github/workflows/ci.yml`

### Etapas del Pipeline

1. **Checkout** - Descarga el código
2. **Setup Node.js** - Configura Node.js v18
3. **Install Dependencies** - Instala paquetes npm
4. **Setup MySQL** - Inicia servicio MySQL
5. **Lint** - Ejecuta análisis estático (ESLint)
6. **Unit Tests** - Ejecuta pruebas unitarias
7. **Integration Tests** - Ejecuta pruebas de integración
8. **E2E Tests** - Ejecuta pruebas end-to-end
9. **Success** - Si todo pasa, imprime "OK"

### Ver Estado del Pipeline

El badge del pipeline aparecerá en el repositorio de GitHub y mostrará:
- ✅ Passing - Todas las pruebas pasaron
- ❌ Failing - Alguna prueba falló

### Ejecución Local Simulando CI

Puedes simular el pipeline localmente:

```bash
# 1. Lint
npm run lint

# 2. Unit Tests
npm run test:unit

# 3. Integration Tests
npm run test:integration

# 4. E2E Tests
npm run test:e2e

# Si todos pasan:
echo "OK"
```

---

## Estructura del Proyecto

```
inventario-pruebas/
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline de GitHub Actions
│
├── config/
│   └── database.js                # Configuración de Sequelize
│
├── public/                        # Frontend (interfaz web)
│   ├── index.html                 # Página principal
│   ├── styles.css                 # Estilos
│   └── app.js                     # Lógica del cliente
│
├── src/
│   ├── controllers/               # Controladores de la API
│   │   ├── categoryController.js
│   │   └── productController.js
│   │
│   ├── models/                    # Modelos de Sequelize
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── index.js
│   │
│   ├── routes/                    # Rutas de Express
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── index.js
│   │
│   ├── services/                  # Lógica de negocio
│   │   ├── categoryService.js
│   │   └── productService.js
│   │
│   ├── tests/                     # Pruebas automatizadas
│   │   ├── unit/                  # Pruebas unitarias
│   │   │   ├── categoryService.test.js
│   │   │   └── productService.test.js
│   │   │
│   │   ├── integration/           # Pruebas de integración
│   │   │   ├── categories.test.js
│   │   │   └── products.test.js
│   │   │
│   │   └── e2e/                   # Pruebas E2E
│   │       └── inventory.spec.js
│   │
│   └── index.js                   # Punto de entrada de la API
│
├── .env.example                   # Ejemplo de variables de entorno
├── .eslintrc.js                   # Configuración de ESLint
├── .gitignore                     # Archivos ignorados por Git
├── jest.config.js                 # Configuración de Jest
├── package.json                   # Dependencias y scripts
├── playwright.config.js           # Configuración de Playwright
├── PLAN_DE_PRUEBAS.md            # Documento del plan de pruebas
└── README.md                      # Este archivo
```

---

## Decisiones Técnicas

### 1. Arquitectura por Capas

**Decisión:** Implementar una arquitectura por capas separando controladores, servicios y modelos.

**Razones:**
- ✅ Separación de responsabilidades
- ✅ Código más mantenible y testeable
- ✅ Facilita el escalado del proyecto
- ✅ Permite reutilización de lógica de negocio

### 2. Sequelize como ORM

**Decisión:** Usar Sequelize en lugar de queries SQL directas.

**Razones:**
- ✅ Abstracción de la base de datos
- ✅ Migraciones y sincronización automática
- ✅ Validaciones a nivel de modelo
- ✅ Relaciones más fáciles de manejar
- ✅ Prevención de SQL injection

### 3. Frontend con Vanilla JavaScript

**Decisión:** No usar frameworks como React o Vue.

**Razones:**
- ✅ Simplicidad para el alcance del proyecto
- ✅ Sin dependencias adicionales
- ✅ Carga más rápida
- ✅ Enfoque en la funcionalidad sobre el diseño

### 4. Jest para Pruebas Unitarias e Integración

**Decisión:** Usar Jest como framework principal de testing.

**Razones:**
- ✅ Todo en uno (assertions, mocking, coverage)
- ✅ Excelente rendimiento
- ✅ Ampliamente adoptado
- ✅ Fácil de configurar

### 5. Playwright para E2E

**Decisión:** Usar Playwright en lugar de Selenium o Cypress.

**Razones:**
- ✅ Más rápido que Selenium
- ✅ API moderna y sencilla
- ✅ Multi-navegador
- ✅ Mejor manejo de acciones asíncronas
- ✅ Excelente documentación

### 6. ESLint para Análisis Estático

**Decisión:** Implementar ESLint con reglas estándar.

**Razones:**
- ✅ Detecta errores antes de ejecutar
- ✅ Mantiene estilo consistente
- ✅ Mejora calidad del código
- ✅ Facilita colaboración

### 7. GitHub Actions para CI/CD

**Decisión:** Usar GitHub Actions en lugar de Jenkins o Travis.

**Razones:**
- ✅ Integración nativa con GitHub
- ✅ Gratuito para proyectos públicos
- ✅ Fácil configuración con YAML
- ✅ Amplio ecosistema de actions

### 8. Variables de Entorno

**Decisión:** Usar dotenv para gestión de configuración.

**Razones:**
- ✅ No exponer credenciales en el código
- ✅ Fácil cambio entre entornos
- ✅ Estándar de la industria
- ✅ Compatible con Docker

### 9. Express como Framework

**Decisión:** Usar Express en lugar de Fastify o Koa.

**Razones:**
- ✅ Framework más maduro y estable
- ✅ Gran comunidad y documentación
- ✅ Middleware rico y probado
- ✅ Fácil de aprender

### 10. Estructura de Pruebas

**Decisión:** Separar pruebas en unit, integration y e2e.

**Razones:**
- ✅ Claridad en el tipo de prueba
- ✅ Facilita ejecución selectiva
- ✅ Mejor organización
- ✅ Alineado con estándares

---

## Solución de Problemas

### Error de Conexión a MySQL

**Problema:** `Unable to connect to database`

**Soluciones:**
1. Verifica que MySQL esté corriendo: `sudo service mysql status`
2. Confirma las credenciales en `.env`
3. Verifica que la base de datos exista
4. Revisa el puerto (por defecto 3306)

### Puerto 3000 en Uso

**Problema:** `Port 3000 is already in use`

**Soluciones:**
1. Cambia el puerto en `.env`: `PORT=3001`
2. O mata el proceso: `lsof -ti:3000 | xargs kill`

### Pruebas E2E Fallan

**Problema:** Playwright tests timeout

**Soluciones:**
1. Asegúrate de que el servidor esté corriendo
2. Verifica que Playwright esté instalado: `npx playwright install`
3. Aumenta el timeout en `playwright.config.js`

### ESLint Muestra Muchos Errores

**Solución:**
```bash
npm run lint:fix
```

---

## Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

**Importante:** Asegúrate de que todas las pruebas pasen antes de hacer un PR.

---

## Licencia

ISC

---

## Autor

Proyecto desarrollado para la asignatura **Pruebas de Software**
Programa de Ingeniería de Software
Profesor: Jose Alfredo Ramírez Espinosa

---

## Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de Jest](https://jestjs.io/)
- [Documentación de Playwright](https://playwright.dev/)
- [Guía de ESLint](https://eslint.org/docs/user-guide/)
- [Plan de Pruebas Completo](PLAN_DE_PRUEBAS.md)

---

**¿Preguntas o problemas?** Abre un issue en el repositorio.
