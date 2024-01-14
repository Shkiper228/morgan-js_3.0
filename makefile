build:
	docker build . -t bot

start:
	docker run -d bot