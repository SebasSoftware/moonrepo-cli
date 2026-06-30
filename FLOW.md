## Flujo de Moonrepo CLI

1. Escribo el comando "pnpm create moonrepo" (para desarrollo solo prueba con 'node src/index.ts')
2. Inicia una interfaz que pone en letras grandes y de color rojo la palabra "MONOREPO" al estilo Claude Code
3. Me pregunta que nombre quiero para el proyecto
4. Me pregunta que tecnologia quiero usar para el fronted (Vite o NextJS)
5. Me pregunta que tecnologia quiero usar para el backend (NestJS o Express)
6. En base a lo que le usuario eligo crearemos la siguiente estructura de carpetas:

```
apps/
├── backend/
│ ├─ NestJS / Express
├── fronted/
│ ├─ ViteJS / NextJS
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
└─ turbo.json
```

7. NO HACER PNPM INSTALL AUTOMATICAMENTE. Dejar axl usuario el clasico mensaje que le indica al usuario hacer "cd nombre-del-proyecto" y luego "pnpm install"
