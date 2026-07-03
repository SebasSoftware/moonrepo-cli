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
   pnpm run dev  # Inicia el modo de desarrollo
   ```

## 🏧 Características principales

- **Soplar monorepos**: Crea estructuras básicas para proyectos con pnpm/Turbo.
- **TypeScript-first**: Diseñado para proyectos con TS (versión 5.6.3 por defecto).
- **Interfaz CLI** en `bin/moonrepo` para ejecutar comandos específicos.
- **Modular**: Último para proyectos escalables con múltiples paquetes.

## 📍 Tech Stack

- **Herramientas principales**:
  - _pnpm_: Gestor de paquetes rápido.
  - _Turbo_: Gestor de monorepos optimizado.
  - _TypeScript 5.6.3_: Lenguaje de desarrollo.
- **Dependencias clave**:
  ```bash
  tsx, chalk, inquirer, ora, fs-extra, execa
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

## ⮘ Comandos comunes

| Comando          | Descripción                      |
| ---------------- | -------------------------------- |
| `pnpm run dev`   | Inicia el entorno de desarrollo  |
| `pnpm run build` | Compila TypeScript a JavaScript  |
| `moonrepo init`  | template personalizado (agregar) |

> ⚠️ **Nota**: Algunos comandos están en desarrollo. Consulta `AGENT.md` para detalles técnicos.

## 📖 Documentación adicional

- Guía oficial: [README.md](/README.md) (aún enhme)
- Repositorio: [github.com/SebasSoftware/moonrepo-cli](https://github.com/SebasSoftware/moonrepo-cli)
- Licencia: [ISC](https://opensource.org/licenses/ISC)

¿Quieres que agregue un ejemplo práctico de uso o detalles sobre cómo contribuir? 🔪
