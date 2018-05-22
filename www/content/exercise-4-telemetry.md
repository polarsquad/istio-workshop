---
title: "Exercise 4: Telemetry"
weight: 34
menu: true
seriesStart: exercise-4
---

Because all traffic goes through the proxies, Istio can collect a lot of metrics about the network.

In this example we use [Prometheus](https://prometheus.io/) for storing the data and [Grafana](https://grafana.com/) for the visualisation but there's other [adapters](https://istio.io/docs/reference/config/adapters) available.

```shell
workshop $ kubectl apply -f istio/install/kubernetes/addons/prometheus.yaml
configmap "prometheus" created
service "prometheus" created
deployment "prometheus" created
serviceaccount "prometheus" created
clusterrole "prometheus" created
clusterrolebinding "prometheus" created
```

```shell
workshop $ kubectl apply -f istio/install/kubernetes/addons/grafana.yaml
service "grafana" created
deployment "grafana" created
serviceaccount "grafana" created
```

## View Grafana
When Prometheus and Grafana are installed, you should be able to see some data. To generate some traffic and access the Grafana you need multiple terminal windows.

Proxy local port 3000 to the Grafana:
```shell
# Window 1
kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```

And open [Istio Dashboard](http://localhost:3000/d/1/istio-dashboard?refresh=5s&orgId=1&from=now-1m&to=now) in browser

Next generate some traffic to the frontend:
```shell
# Window 2
./apps/frontend/version_percentage.sh $ENDPOINT 10000
```

You should see in the dashboard some basic information about the traffic

![Grafana dashboard](/istio-workshop/img/grafana-dashboard-screenshot.png)