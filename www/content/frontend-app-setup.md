---
title: Deploy Application
weight: 30
menu: true
seriesStart: exercise-2
---

We'll demonstrate a simple, Node.JS based frontend app on top of Kubernetes with traffic routing handled by Istio.

Our first task is to deploy our example frontend app to Kubernetes.

The directory [apps/frontend/](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend) in the workshop Git repo contains the Node.JS source code for the app, Dockerfile to build the Docker image, and Kubernetes deployment configuration files. You can also find pre-built images from [Polar Squad Docker Hub](https://hub.docker.com/r/polarsquad/example-frontend/).

The app launches an HTTP server with two GET endpoints. The root endpoint (`/`) outputs a simple HTML page. The version endpoint (`/version`) outputs the app version.

The app source code is split into two versions: `app_v1.js` for version 1 and `app_v2.js` for version 2. We'll later run both versions of the app simultaneously to demonstrate Istio's traffic routing capabilities.

## Deploying to Kubernetes

The YAML file [apps/frontend/kube/deployment.yaml](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend/kube/deployment.yaml) in the workshop Git repo contains the resource definitions for our example frontend service. It creates a _Deployment_ per app version, and exposes both deployments internally as a single _Service_. Use `kubectl` to create the _Deployments_ and the _Service_.

```shell
workshop $ kubectl create -f apps/frontend/kube/deployment.yaml
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

You might see randomly a response with "Version 1" instead of "Version 2" as shown in the listing above. 
Don't worry, it's expected because _Service_ `selector` selects both versions

## Ingress

Let's expose the service using an Kubernetes _Ingress_ resource. Here's an example _Ingress_ definition where all HTTP traffic with any path will be routed to the frontend service:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: frontend-ing
  annotations:
    kubernetes.io/ingress.class: "istio"
spec:
  rules:
  - http:
      paths:
      - path: /.*
        backend:
          serviceName: frontend-svc
          servicePort: 5000
```

Notice how we set the _Ingress_ resource to use Istio as the ingress controller. This allows Istio to apply it's own routing rules for the traffic that arrives to the cluster. We can create the ingress using `kubectl`:

```shell
workshop $ kubectl create -f apps/frontend/kube/ingress.yaml
workshop $ kubectl get ingress
NAME           HOSTS     ADDRESS   PORTS     AGE
frontend-ing   *                   80        10s
```

## Access the service
Now that both _Deployment_ and the _Ingress_ are setup for our example frontend app, we can access the _Service_ through Istio's own _Ingress_ controller that was created during the Istio setup stage. In a cloud environment, Istio's _Ingress_ controller would be exposed via an external load balancer. Since we're running the setup locally, we'll need to jump a couple of hoops to figure out the endpoint for the Istio _Ingress_.

```shell
workshop $ ENDPOINT_HOST=$(kubectl get po -l istio=ingress -n istio-system -o 'jsonpath={.items[0].status.hostIP}')
workshop $ ENDPOINT_PORT=$(kubectl get svc istio-ingress -n istio-system -o 'jsonpath={.spec.ports[0].nodePort}')
workshop $ ENDPOINT="http://$ENDPOINT_HOST:$ENDPOINT_PORT"
workshop $ curl $ENDPOINT
<html>
  <title>Version 1</title>
</html>
<body style="background-color: blue; color: white; font-size: 60px">
  Version 1
</body>
```

Later in the exercises we use the `$ENDPOINT` in our examples to access the service.