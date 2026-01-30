# IngeCiencia

Una plataforma web moderna para la divulgación científica y gestión de investigaciones, construida con Angular 18 y TypeScript.

## Descripción del Proyecto

**IngeCiencia** es una aplicación web integral que facilita:

- 📚 **Gestión de Artículos y Publicaciones**: Publicar, organizar y categorizar artículos científicos
- 🔐 **Autenticación y Autorización**: Sistema robusto de login, registro y recuperación de contraseña
- 👥 **Perfiles de Usuarios**: Gestión de perfiles de investigadores y profesionales
- ❓ **Preguntas y Respuestas**: Comunidad colaborativa para resolver dudas científicas
- 📖 **Recursos Educativos**: Biblioteca de recursos y materiales de aprendizaje
- 🔬 **Proyectos de Investigación**: Seguimiento y divulgación de proyectos en curso
- 💬 **Contacto**: Formularios de comunicación e integración
- 🤖 **Integración con IA**: Utiliza Google Generative AI para asistencia inteligente

## Tecnologías

- **Framework**: Angular 18.2.2
- **Lenguaje**: TypeScript 5.5
- **Estilos**: SCSS
- **Gestión de Estado**: RxJS
- **Testing**: Karma, Jasmine
- **Spinner**: ngx-spinner
- **IA**: Google Generative AI

## Estructura del Proyecto

```
src/
├── app/
│   ├── business/          # Módulos de negocio
│   │   ├── admin/         # Panel administrativo
│   │   ├── articulo/      # Gestión de artículos
│   │   ├── authentication/# Autenticación (login, registro, etc.)
│   │   ├── config/        # Configuración
│   │   ├── contacto/      # Formularios de contacto
│   │   ├── investigadores/# Gestión de investigadores
│   │   ├── landing-page/  # Página de inicio
│   │   ├── perfil/        # Perfiles de usuario
│   │   ├── preguntas/     # Sistema Q&A
│   │   ├── publicaciones/ # Gestión de publicaciones
│   │   └── recursos/      # Biblioteca de recursos
│   ├── core/              # Servicios centrales
│   │   ├── guards/        # Guards de rutas (auth, roles)
│   │   ├── interceptors/  # Interceptores HTTP
│   │   ├── models/        # Modelos de datos
│   │   └── services/      # Servicios compartidos
│   └── shared/            # Componentes compartidos
├── environments/          # Configuración por entorno
└── styles.scss           # Estilos globales
```

## Instalación y Configuración

### Requisitos Previos

- Node.js 18+ y npm/pnpm
- Angular CLI 18.2.2

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repositorio>
   cd webdivulgacion
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   - Editar `src/environments/environment.ts` y `environment.development.ts`
   - Agregar claves API necesarias (Google Generative AI, etc.)

## Scripts Disponibles

### Desarrollo

```bash
pnpm start
# o
npm start
```

Inicia un servidor de desarrollo en `http://localhost:4200/`. La aplicación se recargará automáticamente al modificar archivos.

### Build

```bash
pnpm build
# o
npm run build
```

Compila el proyecto para producción. Los artefactos se guardarán en `dist/inge-ciencia`.

### Watch Mode

```bash
pnpm run watch
# o
npm run watch
```

Compila el proyecto en modo observación con configuración de desarrollo.

### Testing

```bash
pnpm test
# o
npm test
```

Ejecuta las pruebas unitarias mediante Karma y Jasmine.

### CLI Angular

```bash
ng help
ng generate component nombre-componente
ng generate service nombre-servicio
```

## Características Principales

### Autenticación

- Login y registro de usuarios
- Recuperación de contraseña
- Verificación de email
- Auto-refresh de tokens
- Guards de rutas basados en roles

### Gestión de Contenido

- Publicación de artículos con categorías
- Administración de coautores
- Sistema de preguntas con respuestas
- Recursos educativos categorizados

### Investigadores

- Perfil público de investigadores
- Disciplinas y áreas de especialidad
- Filtrado avanzado de perfiles

### Panel Administrativo

- Gestión de usuarios y roles
- Control de contenido
- Configuración del sistema

## Configuración de Producción

El proyecto está dockerizado. Ver [Dockerfile](Dockerfile) para la configuración de contenedores.

Para deployment en producción:

1. Compilar con optimizaciones: `ng build --configuration production`
2. Seguir presupuestos de tamaño configurados en `angular.json`
3. Deployar con el servidor web configurado

## Contribución

1. Crear una rama feature: `git checkout -b feature/feature-name`
2. Commit los cambios: `git commit -m 'Add feature'`
3. Push a la rama: `git push origin feature/feature-name`
4. Abrir un Pull Request

## Testing

- **Unit Tests**: `pnpm test` - Ejecuta pruebas unitarias
- **Coverage**: Configurado en karma.conf.js
- **Jasmine**: Framework de testing utilizado

## Licencia

Proyecto interno. Derechos reservados.

## Contacto y Soporte

Para preguntas o soporte, utilizar el formulario de contacto dentro de la aplicación o contactar al equipo de desarrollo.
