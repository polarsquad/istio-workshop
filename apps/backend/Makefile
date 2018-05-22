APP_NAME = polarsquad/example-backend

all: v1 v2

v1:
	docker build -t $(APP_NAME):v1 --build-arg version=1  .

v2:
	docker build -t $(APP_NAME):v2 --build-arg version=2 .

clean:
	docker rmi $(APP_NAME):v1
	docker rmi $(APP_NAME):v2

.PHONY: all clean v1 v2

publish: v1 v2
	docker push $(APP_NAME):v1
	docker push $(APP_NAME):v2