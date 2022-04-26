#SHELL := /bin/bash

# POSTGRES
PGDATA ?= /var/lib/postgresql/cartostory
POSTGRES_DB ?= cartostory
POSTGRES_USER ?= cartostory
POSTGRES_PASS ?= cartostory
ALLOW_IP_RANGE ?= 0.0.0.0/0
POSTGRES_MULTIPLE_EXTENSIONS ?= postgis

# NODE
NODE_ENV ?= development
NODE_JWT_SECRET ?= secret

# DOCKER
DOCKER_COMPOSE_CI = -f docker-compose.yml -f docker-compose.ci.yml -p cartostory-ci
DOCKER_COMPOSE_DEV = -f docker-compose.yml -f docker-compose.dev.yml -p cartostory-dev
DOCKER_COMPOSE_PROD = -f docker-compose.yml -f docker-compose.prod.yml -p cartostory-prod
DOCKER_COMPOSE_TEST = -f docker-compose.yml -f docker-compose.test.yml -p cartostory-test

.EXPORT_ALL_VARIABLES:
	PGDATA = $${PGDATA}
	POSTGRES_DB = $${POSTGRES_DB}
	POSTGRES_USER = $${POSTGRES_USER}
	POSTGRES_PASS = $${POSTGRES_PASS}
	ALLOW_IP_RANGE = $${ALLOW_IP_RANGE}
	POSTGRES_MULTIPLE_EXTENSIONS = $${POSTGRES_MULTIPLE_EXTENSIONS}
	NODE_ENV = $${NODE_ENV}
	NODE_JWT_SECRET = $${NODE_JWT_SECRET}

run-dev:
	cd ./docker && docker-compose $${DOCKER_COMPOSE_DEV} up

run-prod:
	cd ./docker && docker-compose $${DOCKER_COMPOSE_PROD} up

run-test:
	@cd ./docker; \
	docker-compose $${DOCKER_COMPOSE_TEST} up --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker-compose $${DOCKER_COMPOSE_TEST} kill database; \
	exit $$EXIT_CODE

run-ci:
	@cd ./docker; \
	docker-compose $${DOCKER_COMPOSE_CI} up --build --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker-compose $${DOCKER_COMPOSE_CI} kill database; \
	exit $$EXIT_CODE

stop-dev:
	cd ./docker && docker-compose $${DOCKER_COMPOSE_DEV} stop

stop-ci:
	cd ./docker && docker-compose $${DOCKER_COMPOSE_CI} stop

rebuild:
	cd ./docker && docker-compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} rm --force --stop -v $(SERVICE) && docker-compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} build $(SERVICE) && docker-compose $${DOCKER_COMPOSE_$(ENVIRONMENT)} up $(SERVICE)
