---
title: Frontend app on Kubernetes
series: frontend-app
weight: 31
hideFromIndex: true
---

Our first task is to deploy our example frontend app to Kubernetes.

The directory [apps/frontend/](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend) in the workshop Git repo contains the Node.JS source code for the app, Dockerfile to build the Docker image, and Kubernetes deployment configuration files. You can also find pre-built images from [Polar Squad Docker Hub](https://hub.docker.com/r/polarsquad/example-frontend/).

The app launches an HTTP server with two GET endpoints. The root endpoint (`/`) outputs a simple HTML page. The version endpoint (`/version`) outputs the app version.

The app source code is split into two versions: `app_v1.js` for version 1 and `app_v2.js` for version 2. We'll later run both versions of the app simultaneously to demonstrate Istio's traffic routing capabilities.

## Deploying to Kubernetes

The YAML file [apps/frontend/frontend-svc.yaml](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend/frontend-svc.yaml) in the workshop Git repo contains the resource definitions for our example frontend service. It creates a deployment per app version, and exposes both deployments internally as a single service. Use `kubectl` to create the deployments and the service.

```shell
workshop $ kubectl create -f apps/frontend/frontend-svc.yaml
```

We can test the availability of the internal service using a temporary pod.

```shell
workshop $ kubectl run -it --rm --restart=Never curl-test-frontend --image=radial/busyboxplus:curl curl http://frontend-svc:5000
<html>
  <title>Version 2</title>
</html>
<body style="background-color: green; font-size: 60px">
  Version 2
</body>
```

You might see a response with "Version 1" instead of "Version 2" as shown in the listing above. Don't worry, it's expected because Service `selector` selects both versions.
