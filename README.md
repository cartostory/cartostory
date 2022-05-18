# Swagger

http://localhost:8080/backend/openapi/static/index.html

# Makefile

Run `make help` to see what tasks are available.

## Rebuild a service

Run `ENVIRONMENT=CI|DEV|PROD|TEST SERVICE=backend|database|frontend|mailer make rebuild`. See docker-compose yaml files to find what services are available on different environments.

# Troubleshooting

## npm dependency is not found

See https://github.com/docker/compose/issues/4337. The problem is anonymous volumes are not being removed during the build. To use the newly added dependency, run this command:

```
ENVIRONMENT=DEV SERVICE=frontend make rebuild
```

## Sources

- https://feathericons.com/
- https://remixicon.com/
