---
title: "Exercise 5: Fault Injection"
weight: 35
menu: true
seriesStart: exercise-5
---

With Istio you can also inject some failures to the mesh to test failure cases.

This can be really powerful when testing different error cases to make your service more failure tolerant.

First open the frontend app in your browser `open http://$ENDPOINT` and you should see the html form. You can create few items to the list if you like.

## Delay
Now, let's think we want to simulate some slowiness in the backend _Service_ to test out how it affects to our application.

![Delay traffic](/istio-workshop/img/delay.png)

With Istio we can add _RouteRule_ which add some delay to the network traffic.
Following simple RouteRule delay 100% of the requests with 10s:
```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: backend-delay
  labels:
    exercise: fault-injection
spec:
  destination:
    name: backend-svc
  precedence: 2
  httpFault:
    delay:
      percent: 100
      fixedDelay: 10s
```

```shell
workshop $ kubectl apply -f apps/backend/kube/rules/delay.yaml
routerule "backend-delay" created
```

Now try to refresh the page and you'll see that loading the page takes roughly 10s.

## Failure
Let's do another test case, you want to test that your frontend application handle the case that backend _Service_ is down.

![Abort traffic](/istio-workshop/img/failure.png)

With Istio we can define that all requests to the backend will return HTTP 500 response:
```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: backend-failure
  labels:
    exercise: fault-injection
spec:
  destination:
    name: backend-svc
  precedence: 2
  httpFault:
    abort:
      percent: 100
      httpStatus: 500
```


```shell
workshop $ kubectl apply -f apps/backend/kube/rules/failure.yaml
routerule "backend-failure" created
```

Now if you try to reload the page, you should see:

`Error: Backend failure with code 500`

As you can see, Istio can help you to harden your microservice architecture by providing handy tools to simulate different kind of error cases.