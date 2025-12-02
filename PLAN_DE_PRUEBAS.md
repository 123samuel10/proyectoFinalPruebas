# Plan de Pruebas - Sistema de Gestión de Inventario

## Información General
- **Proyecto:** Sistema de Gestión de Inventario
- **Versión:** 1.0.0
- **Fecha:** Diciembre 2025
- **Responsable:** Samuel Salcedo

## Objetivo
Validar el correcto funcionamiento del sistema de gestión de inventario mediante pruebas unitarias, de integración y end-to-end, asegurando que todos los componentes funcionen correctamente tanto de forma individual como integrada.

## Alcance
- Pruebas unitarias de servicios
- Pruebas de integración de endpoints de la API
- Pruebas E2E del flujo completo de usuario
- Análisis estático de código

---

## 1. Pruebas Unitarias

### 1.1 CategoryService

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| UT-001 | Obtener todas las categorías | Unitaria | Verificar que getAllCategories retorna todas las categorías ordenadas alfabéticamente | Mock de Category.findAll | 1. Llamar a getAllCategories()<br>2. Verificar resultado | Retorna array de categorías ordenado por nombre ASC | ✅ Pasó |
| UT-002 | Error al obtener categorías | Unitaria | Verificar manejo de errores cuando la BD falla | Mock que lance error | 1. Simular error de BD<br>2. Llamar a getAllCategories() | Lanza error con mensaje descriptivo | ✅ Pasó |
| UT-003 | Obtener categoría por ID | Unitaria | Verificar que getCategoryById retorna la categoría correcta | Mock de Category.findByPk | 1. Llamar a getCategoryById(1)<br>2. Verificar resultado | Retorna la categoría con ID especificado | ✅ Pasó |
| UT-004 | Categoría no encontrada | Unitaria | Verificar error cuando la categoría no existe | Mock que retorne null | 1. Llamar a getCategoryById(999) | Lanza error "Category not found" | ✅ Pasó |
| UT-005 | Crear categoría | Unitaria | Verificar creación exitosa de categoría | Mock de Category.create | 1. Llamar a createCategory({name: 'Test'})<br>2. Verificar resultado | Retorna nueva categoría creada | ✅ Pasó |
| UT-006 | Crear categoría duplicada | Unitaria | Verificar error al crear categoría con nombre existente | Mock con SequelizeUniqueConstraintError | 1. Intentar crear categoría duplicada | Lanza error "Category name already exists" | ✅ Pasó |
| UT-007 | Actualizar categoría | Unitaria | Verificar actualización exitosa de categoría | Mock de categoría con método update | 1. Llamar a updateCategory(1, {name: 'Updated'})<br>2. Verificar resultado | Retorna categoría actualizada | ✅ Pasó |
| UT-008 | Actualizar a nombre duplicado | Unitaria | Verificar error al actualizar con nombre existente | Mock con error de constraint | 1. Intentar actualizar a nombre existente | Lanza error "Category name already exists" | ✅ Pasó |
| UT-009 | Eliminar categoría | Unitaria | Verificar eliminación exitosa de categoría | Mock de categoría con método destroy | 1. Llamar a deleteCategory(1)<br>2. Verificar resultado | Retorna mensaje de éxito | ✅ Pasó |

### 1.2 ProductService

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| UT-010 | Obtener todos los productos | Unitaria | Verificar que getAllProducts retorna productos con categorías | Mock de Product.findAll | 1. Llamar a getAllProducts()<br>2. Verificar resultado | Retorna array de productos con categorías incluidas | ✅ Pasó |
| UT-011 | Error al obtener productos | Unitaria | Verificar manejo de errores en consulta | Mock que lance error | 1. Simular error de BD<br>2. Llamar a getAllProducts() | Lanza error con mensaje descriptivo | ✅ Pasó |
| UT-012 | Obtener producto por ID | Unitaria | Verificar que getProductById retorna producto correcto | Mock de Product.findByPk | 1. Llamar a getProductById(1)<br>2. Verificar resultado | Retorna producto con categoría incluida | ✅ Pasó |
| UT-013 | Producto no encontrado | Unitaria | Verificar error cuando producto no existe | Mock que retorne null | 1. Llamar a getProductById(999) | Lanza error "Product not found" | ✅ Pasó |
| UT-014 | Crear producto | Unitaria | Verificar creación exitosa de producto | Mocks de Category y Product | 1. Verificar categoría existe<br>2. Crear producto<br>3. Verificar resultado | Retorna nuevo producto con categoría | ✅ Pasó |
| UT-015 | Crear producto sin categoría | Unitaria | Verificar error cuando categoría no existe | Mock de Category retorna null | 1. Intentar crear producto con category_id inválido | Lanza error "Category not found" | ✅ Pasó |
| UT-016 | Actualizar producto | Unitaria | Verificar actualización exitosa | Mock de producto con update | 1. Llamar a updateProduct(1, {price: 900})<br>2. Verificar resultado | Retorna producto actualizado | ✅ Pasó |
| UT-017 | Actualizar categoría de producto | Unitaria | Verificar validación de categoría al actualizar | Mocks de Product y Category | 1. Actualizar con nueva categoría<br>2. Verificar validación | Valida que nueva categoría existe y actualiza | ✅ Pasó |
| UT-018 | Eliminar producto | Unitaria | Verificar eliminación exitosa | Mock de producto con destroy | 1. Llamar a deleteProduct(1)<br>2. Verificar resultado | Retorna mensaje de éxito | ✅ Pasó |
| UT-019 | Obtener productos por categoría | Unitaria | Verificar filtrado por categoría | Mocks de Category y Product | 1. Llamar a getProductsByCategory(1)<br>2. Verificar resultado | Retorna solo productos de esa categoría | ✅ Pasó |

---

## 2. Pruebas de Integración

### 2.1 Categories API

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| IT-001 | POST /api/categories - Crear categoría | Integración | Verificar creación de categoría en BD | BD limpia | 1. POST /api/categories {name: 'Electronics'}<br>2. Verificar respuesta | Status 201, categoría con ID asignado | ✅ Pasó |
| IT-002 | POST /api/categories - Datos inválidos | Integración | Verificar validación de datos | BD limpia | 1. POST /api/categories sin name | Status 400, mensaje de error | ✅ Pasó |
| IT-003 | POST /api/categories - Nombre duplicado | Integración | Verificar constraint de unicidad | Categoría existente | 1. Crear categoría<br>2. Intentar crear duplicada | Status 400, error de duplicado | ✅ Pasó |
| IT-004 | GET /api/categories - Lista vacía | Integración | Verificar respuesta con BD vacía | BD limpia | 1. GET /api/categories | Status 200, array vacío | ✅ Pasó |
| IT-005 | GET /api/categories - Múltiples categorías | Integración | Verificar listado y ordenamiento | 3 categorías creadas | 1. Crear categorías<br>2. GET /api/categories | Status 200, array ordenado alfabéticamente | ✅ Pasó |
| IT-006 | GET /api/categories/:id - Obtener existente | Integración | Verificar obtención por ID | Categoría creada | 1. Crear categoría<br>2. GET /api/categories/{id} | Status 200, datos de la categoría | ✅ Pasó |
| IT-007 | GET /api/categories/:id - No encontrada | Integración | Verificar respuesta con ID inválido | BD limpia | 1. GET /api/categories/999 | Status 404, error not found | ✅ Pasó |
| IT-008 | PUT /api/categories/:id - Actualizar | Integración | Verificar actualización en BD | Categoría creada | 1. Crear categoría<br>2. PUT /api/categories/{id} {name: 'Updated'} | Status 200, datos actualizados | ✅ Pasó |
| IT-009 | PUT /api/categories/:id - ID inválido | Integración | Verificar error con ID no existente | BD limpia | 1. PUT /api/categories/999 {name: 'Test'} | Status 404, error not found | ✅ Pasó |
| IT-010 | PUT /api/categories/:id - Nombre duplicado | Integración | Verificar constraint en actualización | 2 categorías existentes | 1. Actualizar cat2 con nombre de cat1 | Status 400, error de duplicado | ✅ Pasó |
| IT-011 | DELETE /api/categories/:id - Eliminar | Integración | Verificar eliminación de BD | Categoría creada | 1. Crear categoría<br>2. DELETE /api/categories/{id}<br>3. Verificar eliminación | Status 200, GET posterior retorna 404 | ✅ Pasó |
| IT-012 | DELETE /api/categories/:id - ID inválido | Integración | Verificar error al eliminar inexistente | BD limpia | 1. DELETE /api/categories/999 | Status 404, error not found | ✅ Pasó |

### 2.2 Products API

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| IT-013 | POST /api/products - Crear producto | Integración | Verificar creación de producto en BD | Categoría existente | 1. POST /api/products con datos completos<br>2. Verificar respuesta | Status 201, producto con categoría incluida | ✅ Pasó |
| IT-014 | POST /api/products - Datos incompletos | Integración | Verificar validación de campos requeridos | Categoría existente | 1. POST /api/products sin campos requeridos | Status 400, mensaje de error | ✅ Pasó |
| IT-015 | POST /api/products - Categoría inválida | Integración | Verificar validación de FK | BD limpia | 1. POST /api/products con category_id=999 | Status 400, error "Category not found" | ✅ Pasó |
| IT-016 | POST /api/products - Precio negativo | Integración | Verificar validación de precio | Categoría existente | 1. POST /api/products con price=-100 | Status 400, error de validación | ✅ Pasó |
| IT-017 | POST /api/products - Stock negativo | Integración | Verificar validación de stock | Categoría existente | 1. POST /api/products con stock=-5 | Status 400, error de validación | ✅ Pasó |
| IT-018 | GET /api/products - Lista vacía | Integración | Verificar respuesta con BD vacía | BD limpia | 1. GET /api/products | Status 200, array vacío | ✅ Pasó |
| IT-019 | GET /api/products - Múltiples productos | Integración | Verificar listado con categorías | 2 productos creados | 1. Crear productos<br>2. GET /api/products | Status 200, productos con categorías | ✅ Pasó |
| IT-020 | GET /api/products/:id - Obtener existente | Integración | Verificar obtención por ID | Producto creado | 1. Crear producto<br>2. GET /api/products/{id} | Status 200, datos del producto | ✅ Pasó |
| IT-021 | GET /api/products/:id - No encontrado | Integración | Verificar respuesta con ID inválido | BD limpia | 1. GET /api/products/999 | Status 404, error not found | ✅ Pasó |
| IT-022 | PUT /api/products/:id - Actualizar | Integración | Verificar actualización en BD | Producto creado | 1. Crear producto<br>2. PUT /api/products/{id} con cambios | Status 200, datos actualizados | ✅ Pasó |
| IT-023 | PUT /api/products/:id - Cambiar categoría | Integración | Verificar actualización de categoría | Producto y 2 categorías | 1. Crear producto en cat1<br>2. PUT con category_id=cat2 | Status 200, producto con nueva categoría | ✅ Pasó |
| IT-024 | PUT /api/products/:id - ID inválido | Integración | Verificar error con ID no existente | BD limpia | 1. PUT /api/products/999 | Status 404, error not found | ✅ Pasó |
| IT-025 | PUT /api/products/:id - Categoría inválida | Integración | Verificar validación de FK en update | Producto existente | 1. PUT /api/products/{id} con category_id=999 | Status 400, error "Category not found" | ✅ Pasó |
| IT-026 | DELETE /api/products/:id - Eliminar | Integración | Verificar eliminación de BD | Producto creado | 1. Crear producto<br>2. DELETE /api/products/{id}<br>3. Verificar eliminación | Status 200, GET posterior retorna 404 | ✅ Pasó |
| IT-027 | DELETE /api/products/:id - ID inválido | Integración | Verificar error al eliminar inexistente | BD limpia | 1. DELETE /api/products/999 | Status 404, error not found | ✅ Pasó |
| IT-028 | GET /api/products/category/:id - Filtrar | Integración | Verificar filtrado por categoría | 2 categorías con productos | 1. Crear productos en diferentes cats<br>2. GET /api/products/category/{id} | Status 200, solo productos de esa categoría | ✅ Pasó |
| IT-029 | GET /api/products/category/:id - Cat inválida | Integración | Verificar error con categoría inexistente | BD limpia | 1. GET /api/products/category/999 | Status 404, error not found | ✅ Pasó |
| IT-030 | GET /api/products/category/:id - Sin productos | Integración | Verificar respuesta con categoría vacía | Categoría sin productos | 1. Crear categoría<br>2. GET /api/products/category/{id} | Status 200, array vacío | ✅ Pasó |

---

## 3. Pruebas End-to-End (E2E)

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| E2E-001 | Flujo completo: Crear categoría, producto y visualizar | E2E | Verificar flujo completo desde UI | Aplicación corriendo | 1. Navegar a app<br>2. Ir a tab Categorías<br>3. Crear categoría "Electronics Test"<br>4. Ir a tab Productos<br>5. Crear producto "Gaming Laptop"<br>6. Ir a tab Listar<br>7. Verificar producto visible | Categoría creada, producto creado con todos los datos correctos, visible en listado | ✅ Pasó |
| E2E-002 | Editar y actualizar producto | E2E | Verificar edición de producto desde UI | App corriendo, datos de prueba | 1. Crear categoría y producto<br>2. Ir a Listar<br>3. Click en Editar<br>4. Modificar datos en modal<br>5. Guardar<br>6. Verificar cambios | Modal se abre, datos se actualizan, cambios visibles en listado | ✅ Pasó |
| E2E-003 | Eliminar producto | E2E | Verificar eliminación de producto desde UI | App corriendo, datos de prueba | 1. Crear categoría y producto<br>2. Ir a Listar<br>3. Click en Eliminar<br>4. Confirmar diálogo<br>5. Verificar eliminación | Diálogo de confirmación aparece, producto eliminado del listado | ✅ Pasó |
| E2E-004 | Filtrar productos por categoría | E2E | Verificar funcionalidad de filtro | App corriendo, múltiples datos | 1. Crear 2 categorías<br>2. Crear productos en cada una<br>3. Ir a Listar<br>4. Aplicar filtro por cada categoría<br>5. Verificar resultados | Solo productos de categoría seleccionada se muestran | ✅ Pasó |
| E2E-005 | API Health Check | E2E | Verificar endpoint de salud | App corriendo | 1. Hacer request a /api/health<br>2. Verificar respuesta | Status 200, JSON con success: true | ✅ Pasó |

---

## 4. Análisis Estático de Código

| ID | Caso de Prueba | Tipo | Descripción | Prerrequisitos | Pasos | Resultado Esperado | Resultado Obtenido |
|----|----------------|------|-------------|----------------|-------|-------------------|-------------------|
| SA-001 | ESLint - Análisis de código | Estático | Verificar que el código cumple con estándares | ESLint configurado | 1. Ejecutar npm run lint<br>2. Revisar reporte | Sin errores de linting, código cumple estándares | ✅ Pasó |

---

## 5. Resumen de Resultados

### Estadísticas de Pruebas

| Tipo de Prueba | Total | Pasaron | Fallaron | % Éxito |
|----------------|-------|---------|----------|---------|
| Unitarias | 19 | 19 | 0 | 100% |
| Integración | 18 | 18 | 0 | 100% |
| E2E | 5 | 5 | 0 | 100% |
| Análisis Estático | 1 | 1 | 0 | 100% |
| **TOTAL** | **43** | **43** | **0** | **100%** |

### Cobertura de Código

- **Servicios:** 100% de cobertura
- **Controladores:** Cubiertos por pruebas de integración
- **Modelos:** Cubiertos por pruebas de integración
- **Rutas:** Cubiertos por pruebas de integración

---

## 6. Herramientas Utilizadas

- **Framework de Pruebas Unitarias/Integración:** Jest
- **Framework de Pruebas E2E:** Playwright
- **HTTP Testing:** Supertest
- **Análisis Estático:** ESLint
- **Base de Datos para Tests:** MySQL (misma que producción)
- **CI/CD:** GitHub Actions

---

## 7. Ejecución de Pruebas

### Comandos

```bash
# Todas las pruebas
npm test

# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration

# Pruebas E2E
npm run test:e2e

# Análisis estático
npm run lint
```

### Pipeline CI/CD

El pipeline de GitHub Actions ejecuta automáticamente:
1. Instalación de dependencias
2. Análisis estático (ESLint)
3. Pruebas unitarias
4. Pruebas de integración
5. Pruebas E2E
6. Si todas pasan, imprime "OK"

---

## 8. Conclusiones

- ✅ Todas las pruebas automatizadas pasan exitosamente
- ✅ Cobertura de código completa en componentes críticos
- ✅ Análisis estático sin errores
- ✅ Pipeline CI/CD configurado y funcionando
- ✅ Sistema listo para producción

El sistema de gestión de inventario ha sido completamente validado y cumple con todos los requisitos funcionales y de calidad establecidos.

---

**Fecha de última actualización:** Diciembre 2025
**Estado:** ✅ Aprobado
