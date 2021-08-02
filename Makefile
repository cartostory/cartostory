#SHELL := /bin/bash

run-dev:
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

run-prod:
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

run-test:
	@cd ./docker; \
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --exit-code-from backend --renew-anon-volumes backend; \
	EXIT_CODE=$$?; \
	docker-compose kill database; \
	exit $$EXIT_CODE

stop:
	cd ./docker && docker-compose stop
