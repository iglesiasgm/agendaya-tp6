# AgendaYA · TP6 — Testing Automatizado

Frontend mínimo del módulo **M05 — Gestión de Agenda (Admin)** desarrollado para el **Trabajo Práctico N.º 6 de Ingeniería y Calidad de Software**.

El objetivo del proyecto no es construir AgendaYA completo, sino implementar flujos reales y testeables para trabajar con **testing E2E mediante Cypress** y **testing unitario mediante Vitest**.

---

## ✨ Funcionalidades implementadas

Actualmente el frontend permite:

- Consultar las reservas correspondientes a una fecha.
- Validar que se haya seleccionado una fecha antes de buscar.
- Visualizar las reservas ordenadas por horario.
- Abrir el detalle de una reserva.
- Visualizar información del evento y del cliente.
- Cancelar una reserva mediante un modal de confirmación.
- Impedir la cancelación de reservas completadas o ya canceladas.
- Mostrar un mensaje de confirmación luego de una cancelación exitosa.

Los datos son **mock** y se mantienen en memoria. No se utiliza backend real.

---

## 🧰 Stack

- **React**
- **TypeScript**
- **Vite**
- **Cypress** — tests End-to-End
- **Vitest** — tests unitarios
- **ESLint**
- **Git**

---

## 📁 Estructura principal

```text
src/
├── components/
│   ├── CancelReservationModal.tsx
│   ├── ReservationCard.tsx
│   ├── ReservationDetails.tsx
│   └── ReservationList.tsx
├── data/
│   └── reservations.ts
├── domain/
│   ├── reservation.ts
│   └── reservation.test.ts
├── types/
│   └── reservation.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx

cypress/
├── e2e/
│   ├── app.cy.js
│   ├── daily-reservations.cy.js
│   └── cancel-reservation.cy.js
└── support/
    └── e2e.ts
```

### ¿Qué va en cada carpeta?

- `components/`: componentes visuales de React.
- `data/`: datos simulados utilizados por el frontend.
- `domain/`: lógica de negocio independiente de React.
- `types/`: tipos e interfaces de TypeScript.
- `cypress/e2e/`: pruebas que recorren la aplicación como lo haría un usuario.

La lógica de negocio se mantiene separada de la interfaz para facilitar los tests unitarios y evitar duplicar reglas en los componentes.

---

# 🚀 Setup del proyecto

## 1. Requisitos

Antes de empezar, verificar que estén instalados:

```bash
node --version
npm --version
git --version
```

Se recomienda utilizar una versión LTS reciente de Node.js.

---

## 2. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Luego entrar **a la carpeta que contiene `package.json`, `src/` y `vite.config.*`**:

```bash
cd NOMBRE_DEL_REPOSITORIO
```

> ⚠️ Todos los comandos de npm deben ejecutarse desde la raíz del proyecto.  
> No instalar Cypress ni otras dependencias en la carpeta padre del repositorio.

---

## 3. Instalar dependencias

Si el repositorio contiene `package-lock.json`, usar preferentemente:

```bash
npm ci
```

También puede utilizarse:

```bash
npm install
```

La primera instalación de Cypress puede tardar varios minutos porque descarga su binario.

Para verificar Cypress:

```bash
npx cypress verify
```

---

# 💻 Levantar el frontend

Ejecutar:

```bash
npm run dev
```

Vite mostrará una URL local, normalmente:

```text
http://localhost:5173
```

Mantener esta terminal abierta mientras se utiliza la aplicación o se ejecutan tests E2E.

---

# 🧪 Tests unitarios con Vitest

## Ejecutar todos una sola vez

```bash
npm run test:run
```

## Ejecutar en modo watch

```bash
npm run test
```

Vitest volverá a ejecutar los tests afectados cada vez que se guarde un cambio.

Para salir del modo watch:

```text
q
```

Los tests unitarios actuales se encuentran en:

```text
src/domain/reservation.test.ts
```

y verifican lógica como:

- filtrado de reservas por fecha;
- ordenamiento por horario;
- reglas de cancelación;
- actualización del estado de una reserva.

---

# 🌐 Tests E2E con Cypress

Para Cypress se necesitan **dos terminales**.

## Terminal 1 — frontend

```bash
npm run dev
```

## Terminal 2 — Cypress interactivo

```bash
npm run cy:open
```

Luego:

1. Elegir **E2E Testing**.
2. Seleccionar Chrome u otro navegador disponible.
3. Ejecutar el spec deseado.

Los principales specs son:

```text
cypress/e2e/daily-reservations.cy.js
cypress/e2e/cancel-reservation.cy.js
```

## Ejecutar Cypress en modo headless

Con Vite todavía ejecutándose:

```bash
npm run cy:run
```

---

# ✅ Scripts disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Levanta Vite en desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta Vitest en modo watch |
| `npm run test:run` | Ejecuta todos los tests unitarios una vez |
| `npm run cy:open` | Abre Cypress en modo interactivo |
| `npm run cy:run` | Ejecuta Cypress en modo headless |

---

# 🧭 Flujo recomendado para trabajar

Antes de empezar:

```bash
git pull
```

Crear una rama para el trabajo personal:

```bash
git switch -c nombre/tarea
```

Ejemplo:

```bash
git switch -c gabriel/unit-tests
```

Realizar los cambios y comprobar antes de commitear:

```bash
npm run test:run
npm run build
```

Si se modificó un flujo de interfaz, también ejecutar Cypress.

Luego:

```bash
git status
git add .
git commit -m "test: add reservation status unit tests"
git push -u origin nombre/tarea
```

---

# ⚠️ Reglas para no romper el proyecto

1. **No subir `node_modules/` al repositorio.**
2. **No ejecutar `npm init` dentro del proyecto.** El `package.json` ya existe.
3. **No instalar dependencias en la carpeta padre.** Siempre comprobar que la terminal esté ubicada en la raíz del proyecto.
4. **No cambiar ni borrar `data-cy` sin actualizar los tests E2E.**
5. **No duplicar reglas de negocio dentro de los componentes.** Si es una regla del sistema, debe vivir preferentemente en `src/domain/`.
6. Antes de hacer push, ejecutar como mínimo:

```bash
npm run test:run
npm run build
```

7. Hacer `git pull` antes de empezar a trabajar para reducir conflictos.
8. Evitar trabajar directamente sobre `main` si varias personas van a modificar código al mismo tiempo.

---

# 🏷️ Convención de commits

Usamos mensajes descriptivos siguiendo una convención simple:

```text
feat: nueva funcionalidad
test: agregar o modificar tests
fix: corrección de un bug
docs: documentación
refactor: reorganización sin cambiar comportamiento
chore: configuración o mantenimiento
```

Ejemplos:

```text
feat: implement reservation cancellation flow
test: add E2E tests for daily reservations
test: add unit tests for reservation domain
docs: add project setup instructions
```

---

# 🔎 Selectores de Cypress

Los elementos interactivos utilizan atributos `data-cy`.

Ejemplo:

```tsx
<button
  data-cy="cancel-reservation-button"
>
  Cancelar reserva
</button>
```

Y Cypress lo selecciona así:

```js
cy.get('[data-cy="cancel-reservation-button"]').click();
```

Los tests no deberían depender de clases CSS ni del texto visible para localizar controles.

---

# 🧠 Criterio de arquitectura

El proyecto diferencia dos niveles de testing:

### Cypress

Prueba flujos completos desde la perspectiva del usuario.

Ejemplo:

```text
Seleccionar fecha
→ buscar reservas
→ abrir detalle
→ cancelar
→ confirmar
→ comprobar el estado final
```

### Vitest

Prueba funciones aisladas de lógica de negocio.

Ejemplo:

```ts
canCancelReservation(reservation)
```

Esto permite detectar errores de lógica sin necesidad de levantar un navegador.

---

# 📝 TP6

El repositorio contiene la implementación utilizada como evidencia para:

- **Tarea A:** frontend mínimo funcional.
- **Tarea B:** tests E2E con Cypress.
- **Tarea C:** tests unitarios con asistencia de IA.

Los prompts utilizados con IA, las modificaciones realizadas sobre el código generado y la evaluación crítica correspondiente deben documentarse en el informe del TP.

---

## Estado actual

- ✅ Setup con Vite + React + TypeScript
- ✅ Cypress configurado
- ✅ Vitest configurado
- ✅ Consulta de reservas por fecha
- ✅ Detalle de reserva
- ✅ Cancelación con confirmación
- ✅ Validación de reserva no cancelable
- ✅ Tests E2E
- ✅ Primera suite de tests unitarios
