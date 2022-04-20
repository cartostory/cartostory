# Troubleshooting

## npm dependency is not found

See https://github.com/docker/compose/issues/4337. The problem is anonymous volumes are not being removed during the build. To use the newly added dependency, run this sequence of commands:

```
docker-compose -f docker-compose.yml -f ... rm service1
docker-compose -f docker-compose.yml -f ... build service1
docker-compose -f docker-compose.yml -f ... up service1
```
