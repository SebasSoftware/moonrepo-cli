![Moonrepo Banner](public/moonrepo-banner.png)

# Moonrepo CLI

## ⎉️ ¿Qué es Moonrepo?

Moonrepo es una herramienta de línea de comandos (CLI) para **soplar proyectos de monorepo con pnpm + Turbo**. Permite configurar rapidamente proyectos de TypeScript/Node.js con herramientas modernas, ideal para equipos que usan Git y flujos de trabajo de desarrollo módulos.

## 🔧 ¿Cómo se usa?

### Instalación

1. **Clona el proyecto**:
   ```bash
   git clone https://github.com/SebasSoftware/moonrepo-cli.git
   cd moonrepo-cli
   ```
2. **Instala dependencias**:
   ```bash
   pnpm install
   ```
3. **Ejecuta la CLI por primera vez**:
   ```bash
   node src/index.ts
   ```

## 🏧 Características principales

- **Soplar monorepos**: Crea estructuras básicas para proyectos con pnpm/Turbo.
- **TypeScript-first**: Diseñado para proyectos con TS (versión 5.6.3 por defecto).
- **Interfaz CLI** en `bin/moonrepo` para ejecutar comandos específicos.
- **Modular**: Ideal para proyectos escalables con múltiples paquetes.

## 📍 Tech Stack

- **Herramientas principales**:
  - _pnpm_: Gestor de paquetes rápido.
  - _Turbo_: Gestor de monorepos optimizado.
  - _TypeScript_: Lenguaje de desarrollo.
- **Dependencias clave**:
  ```bash
  tsx, chalk, inquirer, ora, fs-extra, execa, handlebars
  ```
- **Dev dependencies**:
  ```bash
  tsup, tsx, typescript, @types/node, @types/fs-extra, @types/express
  ```

## 📡 Estructura del proyecto

```
moonrepo-cli/
├── src/               # Código fuente (TypeScript)
├── package.json       # Configuración y dependencias
├── tsconfig.json      # Configuración de TypeScript
├── bin/               # Archivo de ejecución final (enlace a dist/index.js)
├── public/            # Recursos como la imagen del banner
├── dist/              # Código compilado (generado por tsup)
└── README.md
```

> ⚠️ **Nota**: Este herramienta aun esta en desarrollo, algunos comando podrian no funcionar.

## 🏗️ Arquitectura

Moonrepo CLI sigue una arquitectura modular basada en TypeScript:

- **Capa de comandos** (`src/commands/`): Implementa los subcomandos de la CLI (actualmente `init`).
- **Capa de servicios** (`src/services/`): Lógica de negocio para scaffolding (creación de plantillas, manejo de archivos).
- **Capa de utils** (`src/utils/`): Utilidades reutilizables (manejo de archivos, prompts, spinner).
- **Entry point** (`src/index.ts`): Punto de entrada que parsea argumentos y despacha comandos.
- **Build**: Usa `tsup` para compilar TypeScript a ESModule y generar el ejecutable en `dist/index.js`.
- **Binario**: El campo `bin` en `package.json` apunta a `./dist/index.js`, accesible globalmente como `moonrepo` después de `pnpm link --global` o mediante `pnpm run dev`.

## 📖 Documentación adicional

- Guía oficial: [README.md](/README.md) (actualizaciones en progreso)
- Detalles técnicos: [AGENT.md](./AGENT.md)
- Repositorio: [github.com/SebasSoftware/moonrepo-cli](https://github.com/SebasSoftware/moonrepo-cli)
- Licencia: [ISC](https://opensource.org/licenses/ISC)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`).
3. Realiza tus cambios y asegúrate de pasar los lint y tests.
4. Haz commit de tus cambios (`git commit -m 'Add amazing feature'`).
5. Push a la rama (`git push origin feature/amazing-feature`).
6. Abre un Pull Request.

## 📞 Contacto

- Autor: [SebasSoftware](https://github.com/SebasSoftware)
- Repositorio: [github.com/SebasSoftware/moonrepo-cli](https://github.com/SebasSoftware/moonrepo-cli)

¿Quieres que agregue un ejemplo práctico de uso o detalles sobre cómo contribuir? 🔪