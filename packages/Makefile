#SHELL := /bin/bash

# DOCKER
DOCKER_COMPOSE_CI = -f docker-compose.yml -f docker-compose.ci.yml -p cartostory-ci
DOCKER_COMPOSE_DEV = -f docker-compose.yml -f docker-compose.dev.yml -p cartostory-dev
DOCKER_COMPOSE_PROD = -f docker-compose.yml -f docker-compose.prod.yml -p cartostory-prod
DOCKER_COMPOSE_TEST = -f docker-compose.yml -f docker-compose.test.yml -p cartostory-test

.EXPORT_ALL_VARIABLES:

run-dev: ## runs dev stack
	cd ./docker && docker-compose $${DOCKER_COMPOSE_DEV} up

run-prod: ## runs prod stack
	cd ./docker && docker compose $${DOCKER_COMPOSE_PROD} up

run-test: ## runs backend tests
	@cd ./docker; \
	docker compose $${DOCKER_COMPOSE_TEST} up --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker compose $${DOCKER_COMPOSE_TEST} kill database; \
	exit $$EXIT_CODE

run-ci: ## runs CI tests
	@cd ./docker; \
	docker compose $${DOCKER_COMPOSE_CI} up --build --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker compose $${DOCKER_COMPOSE_CI} kill database; \
	exit $$EXIT_CODE

stop-dev: ## stops dev stack
	cd ./docker && docker-compose $${DOCKER_COMPOSE_DEV} stop

stop-ci: ## stops CI stack
	cd ./docker && docker compose $${DOCKER_COMPOSE_CI} stop

rebuild: ## rebuilds services (useful when dependecies change), e.g. ENVIRONMENT=DEV SERVICE=frontend make rebuild
	cd ./docker && docker compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} rm --force --stop -v $(SERVICE) && docker compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} build $(SERVICE) && docker compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} up -d $(SERVICE)

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
