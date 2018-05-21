---
title: "Exercise 2: Canary deployment"
weight: 32
menu: true
seriesStart: exercise-2
---

Let's play around with the traffic routing rules to create canary deployments.

## Weight-based routing

Here's a rule where we route 90% of the traffic to version 1 and 10% of the traffic to version 2.

```yaml
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: frontend-canary
spec:
  destination:
    name: frontend-svc
  precedence: 2
  route:
  - labels:
      version: v1
    weight: 90
  - labels:
      version: v2
    weight: 10
```

The traffic percentages (weights) are assigned to matching labels. Create the rule:

```shell
workshop $ kubectl create -f apps/frontend/rules/canary.yaml
```

> Note that we didn't have to edit the previously created rule. Using the `precedence` field, we can set ordering for the routing rules. First matching _RoutingRule_ will get applied.

## Let's test it

Since we've already set up an _Ingress_ resource for our app, we can reuse the existing endpoint:

```shell
workshop $ curl $ENDPOINT
<html>
  <title>Version 1</title>
</html>
<body style="background-color: blue; color: white; font-size: 60px">
  Version 1
</body>
```

There's a chance you might see "Version 2" in the output instead of "Version 1" as shown above. If you repeatedly call the endpoint with `curl`, you'll see the output occasionally flip between the versions. You can also open the endpoint in your browser and refresh the page repeatedly for the same effect.

To verify that the weight distribution works as expected, we can repeatedly call the endpoint and count the occurrences. The script `apps/frontend/version_percentage.sh` does all of this for you. Let's run it!

```shell
workshop $ ./apps/frontend/version_percentage.sh $ENDPOINT
Collecting 1000 samples from http://192.168.122.198:31875/version ...
v1: 91.1%
v2: 8.9%
```

The measured weight distribution will slightly vary per test, but overall it looks pretty close to what we set up.

## Tuning routing rule weights on the fly

Tuning the routing rules on the fly is super easy! There are two ways to do it, both of which edit the `frontend-canary` routing rule we defined earlier. You can edit the rule on the server directly using `kubectl`:

```shell
workshop $ kubectl edit routerule frontend-canary
```

 Alternatively, edit the rule file (`apps/frontend/rules/canary.yaml`) and update the rule:

 ```shell
 workshop $ kubectl apply -f apps/frontend/rules/canary.yaml
 ```

Exercise: Change the weights to something else, and use the `version_percentage.sh` script to verify weight distribution. Note that the weights must add up to 100.
