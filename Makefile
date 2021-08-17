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
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

run-prod:
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

run-test:
	@cd ./docker; \
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker-compose kill database; \
	exit $$EXIT_CODE

run-ci:
	@cd ./docker; \
	docker-compose -f docker-compose.yml -f docker-compose.ci.yml up --build --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker-compose kill database; \
	exit $$EXIT_CODE


stop:
	cd ./docker && docker-compose stop
