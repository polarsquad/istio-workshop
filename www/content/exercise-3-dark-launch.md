---
title: "Exercise 3: Dark Launch"
weight: 32
menu: true
seriesStart: exercise-3
---

Istio can also route traffic based on the incoming HTTP. This can be useful for simulating Dark Launches: releasing production-ready features to focused set of users.

In this exercise, we're going to simulate a Dark Launch by controlling backend traffic destination based on the HTTP headers. Specifically, we're going to send requests with header `X-Client-Version: 2` to backend version 2, thus effectively synchronising version 2 frontend with version 2 backend.

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

Next, we're going to create a rule that is only applied when the header X-Client-Version is 2:

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
        x-client-version:
          exact: "2"
  route:
  - labels:
      version: v2
```

If an incoming request doesn't match with the rule, the default rule will be used as a fallback. Go ahead and create it:

```shell
workshop $ kubectl apply -f apps/backend/kube/rules/dark-launch.yaml
```

When you visit the frontend page, you should now see the default greeting appear only for version 1 of the page.