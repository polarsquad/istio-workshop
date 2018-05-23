---
title: "Exercise 3: Dark Launch"
weight: 32
menu: true
seriesStart: exercise-3
---

Istio can also route traffic based on the incoming HTTP. This can be useful for simulating Dark Launches: releasing production-ready features to focused set of users.

![Dark Launch](/istio-workshop/img/dark-launch.png)

In this exercise, we're going to simulate a Dark Launch by controlling backend traffic destination based on the HTTP headers. Specifically, we're going to send backend requests with header `X-Enable-Edge: true` to version 2.

In the frontend, we can control the use of the X-Enable-Edge header using the "Enable edge backend" and "Disable edge backend" link in the frontend app.

First, make sure that we have a default rule in place for the backend app. We're going to send all backend traffic to version 1 by default.

```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: backend-default
spec:
  destination:
    name: backend-svc
  route:
  - labels:
      version: v1
```

```shell
workshop $ kubectl apply -f apps/backend/kube/rules/default.yaml
```

Then, let's create a rule that is only applied when the header X-Enable-Edge is true:

```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: backend-dark-launch
spec:
  destination:
    name: backend-svc
  precedence: 2
  match:
    request:
      headers:
        x-enable-edge:
          exact: "true"
  route:
  - labels:
      version: v2
```

If an incoming request doesn't match with the rule, the default rule will be used as a fallback. Go ahead and create it:

```shell
workshop $ kubectl apply -f apps/backend/kube/rules/dark-launch.yaml
```

When you visit the frontend app, you can now control the backend using the links mentioned before. Try enabling the edge and create a few custom notes!