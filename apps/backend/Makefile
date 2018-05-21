APP_NAME = polarsquad/example-backend

all: v1

v1:
	docker build -t $(APP_NAME):v1 --build-arg version=1  .

clean:
	docker rmi $(APP_NAME):v1

.PHONY: all clean v1

publish: v1
	docker push $(APP_NAME):v1