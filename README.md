<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

1. Clonar repositorio
2. Instalar dependencias
```
yarn install
```
3. Renombrar `.env.template` a `.env` y configurar sus variables 
4. Ejecutar migración de prisma
```
yarn prisma migrate dev
```
5. levantar aplicación
```
yarn run start:dev
```
