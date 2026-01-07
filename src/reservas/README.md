# 🎯 Módulo de Reservas - Campus360

Módulo completo para gestión de reservas de recursos universitarios.

## 📁 Estructura del Módulo (Clean Code Architecture)

```
src/
├── pages/
│   └── ReservationsPage.jsx       ← Dashboard principal del módulo
│
└── reservas/                       ← Todo el módulo contenido aquí
    ├── components/                 ← Componentes reutilizables
    │   └── ResourceCard.jsx
    ├── pages/                      ← Páginas internas del módulo
    │   ├── DisponibilidadPage.jsx
    │   └── MisReservasPage.jsx
    ├── styles/                     ← Estilos centralizados del módulo
    │   ├── ReservationsPage.css
    │   ├── DisponibilidadPage.css
    │   ├── MisReservasPage.css
    │   └── ResourceCard.css
    ├── hooks/                      ← Custom hooks (futuro)
    └── utils/                      ← Utilidades (futuro)
```

## 🎨 Principios de Clean Code Aplicados

### 1. Separación de Responsabilidades
- **Dashboard principal** en `src/pages/` → Visible para todo el equipo
- **Lógica del módulo** en `src/reservas/` → Contenido y organizado

### 2. Modularidad
- Cada módulo tiene su propia carpeta independiente
- Componentes reutilizables bien separados
- Estilos centralizados en `styles/` (no junto a cada componente)

### 3. Escalabilidad
- Otros desarrolladores crean sus módulos sin conflictos
- Fácil de mantener, extender y testear
- Estructura profesional y predecible

## 🚀 Rutas del Módulo

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/reservas` | ReservationsPage | Dashboard principal - Grid de recursos |
| `/reservas/disponibilidad/:tipo` | DisponibilidadPage | Ver recursos por tipo |
| `/reservas/mis-reservas` | MisReservasPage | Gestionar reservas |

## 🔌 Servicios API

El módulo consume un único servicio centralizado del backend:

### reservas.js (`src/api/services/reservas.js`)

Contiene **TODOS** los endpoints del módulo de reservas organizados en dos secciones:

#### Sección RECURSOS (elementos que se pueden reservar)
```javascript
getRecursos(tipo, estado, page, pageSize)    // Listar recursos
getTiposRecursos()                           // Obtener tipos disponibles
getDisponibilidadRecurso(recursoId, fecha)   // Ver disponibilidad
getRecursoById(recursoId)                    // Detalles de recurso
```

#### Sección RESERVAS (solicitudes de uso)
```javascript
getReservas(usuarioId, estado)              // Reservas del usuario
createReserva(data)                         // Crear nueva reserva
getReservaById(reservaId)                   // Detalles de reserva
cancelarReserva(reservaId, motivo)          // Cancelar reserva
confirmarReserva(reservaId)                 // Confirmar reserva
```

**Nota:** "Recursos" es un concepto INTERNO del módulo de reservas (salas, laboratorios, etc.), 
no un módulo separado. Todo está en `reservas.js` para mantener la coherencia.

## 📝 Notas para Otros Desarrolladores

### Para crear TU módulo:

1. **Crea tu carpeta**: `src/tu-modulo/`
2. **Dashboard principal**: `src/pages/TuModuloPage.jsx`
3. **Estructura interna**:
   ```
   src/tu-modulo/
   ├── components/
   ├── pages/
   ├── styles/
   ├── hooks/
   └── utils/
   ```
4. **Registra rutas** en `App.jsx`

### ⚠️ Reglas de Convivencia:
- **NO modificar** archivos dentro de `src/reservas/`
- **NO modificar** `src/pages/ReservationsPage.jsx`
- Cada módulo es responsable de su propia carpeta

## ✅ Checklist de Clean Code

- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ Nombres descriptivos y claros
- ✅ Componentes pequeños y enfocados
- ✅ Estilos centralizados
- ✅ Manejo de errores consistente
- ✅ Loading states
- ✅ Responsive design
- ✅ Documentación clara

---

**Desarrollado por:** Equipo Reservas  
**Última actualización:** Enero 2026
