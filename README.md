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
- **Modular**: Último para proyectos escalables con múltiples paquetes.

## 📍 Tech Stack

- **Herramientas principales**:
  - _pnpm_: Gestor de paquetes rápido.
  - _Turbo_: Gestor de monorepos optimizado.
  - _TypeScript_: Lenguaje de desarrollo.
- **Dependencias clave**:
  ```bash
  chalk, inquirer, ora, fs-extra, execa
  ```

## 📡 Estructura del proyecto

```
moonrepo-cli/
├── src/               # Código fuente (TypeScript)
├── package.json       # Configuración y dependencias
├── tsconfig.json      # Configuración de TypeScript
├── bin/               # Archivo de ejecución final
└── public/            # Recursos como la imagen del banner
```

> ⚠️ **Nota**: Este herramienta aun esta en desarrollo, algunos comando podrian no funcionar.

## 📖 Documentación adicional

- Guía oficial: [README.md](/README.md) (aún enhme)
- Repositorio: [github.com/SebasSoftware/moonrepo-cli](https://github.com/SebasSoftware/moonrepo-cli)
- Licencia: [ISC](https://opensource.org/licenses/ISC)

¿Quieres que agregue un ejemplo práctico de uso o detalles sobre cómo contribuir? 🔪
