---
title: Install Istio
series: installation
hideFromIndex: true
weight: 15
---

1. Get `istioctl` and installation yaml files
```shell
~ $ curl -L https://git.io/getLatestIstio | sh -
~ $ cd istio-0.7.1
```

2. Add `istioctl` to PATH
```shell
~/istio-0.7.1/ $ export PATH="$PWD/bin:$PATH"
```

3. Install core components
```shell
~/istio-0.7.1/ $ kubectl apply -f install/kubernetes/istio.yaml
```
> If you get "unable to recognize" errors, re-run the apply command

4. Verify installation
```shell
~ $ kubectl get pods -n istio-system
NAME                             READY     STATUS    RESTARTS   AGE
istio-ca-86f55cc46f-f7r2g        1/1       Running   0          1m
istio-ingress-5bb556fcbf-5gvsz   1/1       Running   0          1m
istio-mixer-86f5df6997-5bw96     3/3       Running   0          1m
istio-pilot-67d6ddbdf6-bpps4     2/2       Running   0          1m
```
Ensure that all pods are in `Running` state

You're done! :)
