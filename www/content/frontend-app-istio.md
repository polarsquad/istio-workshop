---
title: Basic traffic routing using Istio
series: frontend-app
weight: 32
hideFromIndex: true
---

Now that we have our app running on Kubernetes, we can finally get to playing around with Istio. Let's set up some basic traffic routing capabilities for the app.

In Istio, we can set up rules for how to route traffic based on the destination service. This can be achieved with a `RouteRule` custom resource, which can be written in YAML format similar to other Kubernetes resources. Here's a rule that sends all traffic incoming to our frontend service to version 1 of the app.

```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: frontend-default
spec:
  destination:
    name: frontend-svc
  route:
  - labels:
      version: v1
```

In the rule above, the destination service is selected based on the Kubernetes service name:

```shell
workshop $ kubectl create -f apps/frontend/rules/default.yaml
```

## Ingress

Now that we have a routing rule defined, we can expose the service using an ingress resource. Here's an example ingress definition where all HTTP traffic with any path will be routed to the frontend service:

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

Notice how we set the ingress resource to use Istio as the ingress class. This allows Istio to apply it's own routing rules for the traffic that arrives to the cluster. We can create the ingress using `kubectl`:

```shell
workshop $ kubectl create -f apps/frontend/frontend-ingress.yaml
workshop $ kubectl get ingress
NAME           HOSTS     ADDRESS   PORTS     AGE
frontend-ing   *                   80        10s
```

## First test

Now that both the routing rules and the ingress are setup for our example frontend app, we can access the service through Istio's own ingress service that was created during the Istio setup stage. In a cloud environment, Istio's ingress service would be exposed via an external load balancer. Since we're running the setup locally, we'll need to jump a couple of hoops to figure out the endpoint for the Istio ingress.

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

Perfect! We can now access our app through Istio! You can also open the URL in your web browser if you like.
