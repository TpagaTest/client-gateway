## Migrations: 
Inside transaction MS and auth MS run:

```
  docker exec -it auth-ms sh
  npm run typeorm -- migration:run -d ./data-source.ts
```
```
  docker exec -it transactions-ms sh
  npm run typeorm -- migration:run -d ./data-source.ts
```
## Create DB volume
```docker volume create postgresql-volume```

## Build MS
```docker-compose up --build```



