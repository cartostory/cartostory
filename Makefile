run-dev:
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

run-prod:
	cd ./docker && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

run-test:
	cd ./docker && \
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --renew-anon-volumes

stop:
	cd ./docker && docker-compose stop
