# BeatwormRebuilt

### Getting Started

```bash
# Start dev services and rebuild docker images
docker-compose up --build

# Or quick-start
docker-compose up
```
View the UI at http://127.0.0.1:8080/

API base route: http://127.0.0.1:8080/api/


If you want to jump into an interactive shell in the docker container:
```
# Server
docker exec -it beatwormremake_beatworm-server sh
# Client
docker exec -it beatwormremake_beatworm-ui_1 sh
```

### Kanban Board:
https://trello.com/invite/b/u77Qlcvx/8ee3056e76d405e85f4f0cb0fac035d2/beatworm

