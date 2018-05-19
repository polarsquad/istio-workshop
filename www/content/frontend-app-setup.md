---
title: Frontend app on Kubernetes
series: frontend-app
weight: 31
hideFromIndex: true
---

Our first task is to build and deploy our example frontend app to Kubernetes.

The directory `apps/frontend/` in the workshop Git repo contains the Node.JS source code for the app, Dockerfile to build the Docker image, and Kubernetes deployment configuration files.

The app launches an HTTP server with two GET endpoints. The root endpoint (`/`) outputs a simple HTML page. The version endpoint (`/version`) outputs the app version.

The app source code is split into two versions: `app_v1.js` for version 1 and `app_v2.js` for version 2. We'll later run both versions of the app simultaneously to demonstrate Istio's traffic routing capabilities.

## Setting up Minikube for building the Docker images (Minikube users only)

If you're using Minikube, make sure your Docker client uses Minikube as the backend when building images. This is so that the locally built Docker images will be available for the Kubernetes cluster. This can be achieved easily by evaluating setup commands from Minikube:

```shell
~ $ eval $(minikube docker-env)
~ $ docker info | grep Name
Name: minikube
```

## Building the Docker images

There's a handy little `Makefile` that you can use to build both versions of the app.

```shell
~ $ cd path/to/workshop/apps/frontend
workshop/apps/frontend $ make
```

Verify that the images have been built:

```shell
$ docker images frontend
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
frontend            v2                  21f8671344e2        1 minute ago        675MB
frontend            v1                  f6c7ec6f34e1        1 minute ago        675MB
```

Neat! Let's get it running on Kubernetes next.

## Deploying to Kubernetes

The YAML file `apps/frontend/frontend-svc.yaml` in the workshop Git repo contains the resource definitions for our example frontend service. It creates a deployment per app version, and exposes both deployments internally as a single service. Use `kubectl` to create the deployments and the service.

```shell
workshop $ kubectl create -f apps/frontend/frontend-svc.yaml
```

We can test the availability of the internal service using a temporary pod.

```shell
workshop $ FRONTEND_ENDPOINT=$(kubectl get svc frontend-svc -o 'jsonpath={ .spec.clusterIP }')
workshop $ kubectl run -it --rm --restart=Never curl-test-frontend --image=radial/busyboxplus:curl --env="FRONTEND_ENDPOINT=$FRONTEND_ENDPOINT"
[ root@curl-test-frontend:/ ]$ curl $FRONTEND_ENDPOINT:5000
<html>
  <title>Version 2</title>
</html>
<body style="background-color: green; font-size: 60px">
  Version 2
</body>
```

You might see a response with "Version 1" instead of "Version 2" as shown in the listing above. Don't worry, it's expected.
