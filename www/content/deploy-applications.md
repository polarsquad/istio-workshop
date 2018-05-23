---
title: Deploy Applications
weight: 30
menu: true
---

We'll demonstrate a simple, Node.JS based frontend & backend app on top of Kubernetes with traffic routing handled by Istio.

![Applications architecture](/istio-workshop/img/applications-architecture.png)

Our first task is to deploy our example applications to Kubernetes.

The directory [apps/frontend/](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend) and [apps/backend/](https://github.com/polarsquad/istio-workshop/tree/master/apps/backend) in the workshop Git repo contains the Node.JS source code for the apps, Dockerfile to build the Docker images, and Kubernetes deployment configuration files. You can find pre-built images from [Polar Squad Docker Hub](https://hub.docker.com/r/polarsquad/example-frontend/).

The frontend app launches an HTTP server that lists notes stored in the backend app. The root endpoint (`/`) outputs a simple HTML form and a list of stored notes. The version endpoint (`/version`) outputs the app version.

The frontend app source code is split into two versions: `app_v1.js` for version 1 and `app_v2.js` for version 2. We'll later run both versions of the app simultaneously to demonstrate Istio's traffic routing capabilities.

Similarly, the backend app also has two versions. Version 1 has a static greeting note, and the version 2 allows adding custom notes.

## Deploying to Kubernetes

The YAML file [apps/frontend/kube/deployment.yaml](https://github.com/polarsquad/istio-workshop/tree/master/apps/frontend/kube/deployment.yaml) and [apps/backend/kube/deployment.yaml](https://github.com/polarsquad/istio-workshop/tree/master/apps/backend/kube/deployment.yaml) in the workshop Git repo contains the resource definitions for our example services. It creates a _Deployment_ per app and version, and exposes all deployments internally as a _Services_. Use `kubectl` to create the _Deployments_ and the _Services_.

```shell
workshop $ kubectl get deployment
NAME          DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
backend-v1    1         1         1            1           1h
frontend-v1   1         1         1            1           1d
frontend-v2   1         1         1            1           1d
```

Next let's add _Ingress_ so we can access it outside.

## Ingress

Let's expose the frontend service using an Kubernetes _Ingress_ resource. Here's an example _Ingress_ definition where all HTTP traffic with any path will be routed to the frontend service:

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

Notice how we set the _Ingress_ resource to use Istio as the ingress controller. This allows Istio to apply it's own routing rules for the traffic that arrives to the cluster. We can create the _Ingress_ using `kubectl`:

```shell
workshop $ kubectl create -f apps/frontend/kube/ingress.yaml
ingress "frontend-ing" created

workshop $ kubectl get ingress
NAME           HOSTS     ADDRESS   PORTS     AGE
frontend-ing   *                   80        10s
```

## Access the service
Now that all _Deployments_ and the _Ingress_ are setup for our example frontend and backend apps, we can access the _Service_ through Istio's own _Ingress_ controller that was created during the Istio setup stage. In a cloud environment, Istio's _Ingress_ controller would be exposed via an external load balancer. Since we're running the setup locally, we'll need to jump a couple of hoops to figure out the endpoint for the Istio _Ingress_.

```shell
workshop $ ENDPOINT_HOST=$(kubectl get po -l istio=ingress -n istio-system -o 'jsonpath={.items[0].status.hostIP}')
workshop $ ENDPOINT_PORT=$(kubectl get svc istio-ingress -n istio-system -o 'jsonpath={.spec.ports[0].nodePort}')
workshop $ ENDPOINT="http://$ENDPOINT_HOST:$ENDPOINT_PORT"
workshop $ curl $ENDPOINT
<html><title>Version 1</title></html>
<body>
<h1 style="background-color: blue; color: white">Version 1</h1>
<ul><li><a href="/greetings">greetings</a></li></ul>
<form action="/" method="post">
Title:<br/> <input type="text" name="title" /><br />
Text:<br/> <textarea name="text"></textarea><br />
<input type="hidden" name="useEdge" value="false" />
<input type="submit" value="Submit" />
</form>
<a href="?useEdge=true">Enable edge backend</a>
</body>
```

You might see randomly a response with "Version 1" instead of "Version 2" as shown in the listing above. 
Don't worry, it's expected because _Service_ `selector` selects both versions.

Later in the exercises we use the `$ENDPOINT` in our examples to access the service.

To start controlling the traffic with Istio, first we want to implement the [default routing »]({{< ref "exercise-1-default-routing.md" >}})