# Troubleshooting

## npm dependency is not found

See https://github.com/docker/compose/issues/4337. The problem is anonymous volumes are not being removed during the build. To use the newly added dependency, run this sequence of commands:

```
docker-compose -f docker-compose.yml rm service1
docker-compose -f docker-compose.yml build service1
docker-compose -f docker-compose.yml up service1
```
