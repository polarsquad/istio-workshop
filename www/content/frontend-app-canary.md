---
title: Canarying the example frontend app
series: frontend-app
weight: 32
hideFromIndex: true
---

Now that we have our app running on Kubernetes, we can finally get to playing around with Istio.

## Traffic routing rules

Our first task is to setup some traffic routing rules with Istio. This can be achived with Istio's `RouteRule` resource. The routing rule can be written in YAML format. Here's an example rule where we route 90% of the traffic to version 1 and 10% of the traffic to version 2.

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
    weight: 90
  - labels:
      version: v2
    weight: 10
```

The rule is applied based on the destination of the traffic, which in this case is the `frontend-svc` service. The traffic percentages (weights) are assigned to matching labels. The rule can be created using the `istioctl` tool:

```shell
workshop $ istioctl create -f apps/frontend/frontend-rules.yaml
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

## First tests

Now that both the routing rules and the ingress are setup for our example frontend app, we can access the service through Istio's own ingress service that was created during the Istio setup stage. In a cloud environment, Istio's ingress service would be exposed via an external load balancer. Since we're running the setup locally, we'll need to jump a couple of hoops to figure out the endpoint for the Istio ingress.

```shell
workshop $ ENDPOINT_HOST=$(kubectl get po -l istio=ingress -n istio-system -o 'jsonpath={.items[0].status.hostIP}')
workshop $ ENDPOINT_PORT=$(kubectl get svc istio-ingress -n istio-system -o 'jsonpath={.spec.ports[0].nodePort}')
workshop $ curl http://$ENDPOINT_HOST:$ENDPOINT_PORT
<html>
  <title>Version 1</title>
</html>
<body style="background-color: blue; color: white; font-size: 60px">
  Version 1
</body>
```

There's a (small) chance you might see "Version 2" in the output instead of "Version 1" as shown above. If you repeatedly call the endpoint with `curl`, you'll see the output occasionally flip between the versions. You can also open the endpoint in your browser and refresh the page repeatedly for the same effect.

To verify that the weight distribution works as expected, we can repeatedly call the endpoint and count the occurrences. The script `apps/frontend/version_percentage.sh` does all of this for you. Let's run it!

```shell
workshop $ ./apps/frontend/version_percentage.sh http://$ENDPOINT_HOST:$ENDPOINT_PORT
Collecting 1000 samples from http://192.168.122.198:31875/version ...
v1: 91.1%
v2: 8.9%
```

The measured weight distribution will slightly vary per test, but overall it looks pretty close to what we set up.

## Tuning routing rule weights on the fly

Tuning the routing rules on the fly is super easy! There are two ways to do it, both of which edit the `frontend-default` routing rule we defined earlier. You can edit the rule on the server directly using `kubectl`:

```shell
workshop $ kubectl edit routerule frontend-default
```

 Alternatively, edit the rule file (`apps/frontend/frontend-rules.yaml`) and push the update using `istioctl`:

 ```shell
 workshop $ istioctl replace apps/frontend/frontend-rules.yaml
 ```

**Exercise**: Change the weights to something else, and use the `version_percentage.sh` script to verify weight distribution. Note that the weights must add up to 100.
