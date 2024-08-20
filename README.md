<<<<<<< HEAD
## Fly tm web
=======
### Setup

https://ui.shadcn.com/docs/installation/next

```cmd
  npx shadcn-ui@latest init
```

https://ui.shadcn.com/themes
copiar theme blue code para global.css

- deletar imgs de public
- trocar favicon.ico
- criar pasta /modules
  . (dentro vão os arquivos referentes a cada módulo do sistema)
- componentes gerais vão dentro da pasta /components

adicionar elementos do shadcn

```cmd
  npm i @phosphor-icons/react axios date-fns
```

depois definir quais outras libs vamos usar

criar 'axios.ts' dentro de /lib

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

export default api;
```

> escrever-pastas-e/ arquivos-com-tracinho.tsx
>>>>>>> 40b1af4b7ec2047df1e3b3ac2c55608274bacd6e
