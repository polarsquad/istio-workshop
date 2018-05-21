# example frontend
This directory contains example frontend application for Istio workshop.

## Build
### Setting up Minikube for building the Docker images (Minikube users only)

If you're using Minikube, make sure your Docker client uses Minikube as the backend when building images. This is so that the locally built Docker images will be available for the Kubernetes cluster. This can be achieved easily by evaluating setup commands from Minikube:

```shell
~ $ eval $(minikube docker-env)
~ $ docker info | grep Name
Name: minikube
```

### Building the Docker images

There's a handy little `Makefile` that you can use to build both versions of the app.

```shell
~ $ cd path/to/workshop/apps/frontend
workshop/apps/frontend $ make
```

Verify that the images have been built:

```shell
$ docker images polarsquad/example-frontend
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
polarsquad/example-frontend            v2                  21f8671344e2        1 minute ago        675MB
polarsquad/example-frontend            v1                  f6c7ec6f34e1        1 minute ago        675MB
```
