---
title: Install Istio
weight: 25
menu: true
---

Once you have a Kubernetes cluster up and running, you can install istio by running our Istio installation script.

This script will perform the following steps:

1. Fetches the Istio distribution for your operating system (Linux or MacOS)

2. Unpacks Istio to the workshop directory.

3. Installs [Istio core components](https://istio.io/docs/setup/kubernetes/quick-start.html) to your Kubernetes cluster.

4. Installs [Istio sidecar injector](https://istio.io/docs/setup/kubernetes/sidecar-injection.html#automatic-sidecar-injection) to your Kubernetes cluster.

5. Makes the pods in the default namespace to use the sidecar injector for the pods by default. 

```shell
workshop $ ./install_istio.sh
... bunch of lines here ...
============================
Add /home/myusername/Projects/internal/istio-workshop/istio/bin to your path; e.g copy paste in your shell and/or ~/.profile:
export PATH="$PATH:/home/myusername/Projects/internal/istio-workshop/istio/bin"
OR use Istio directly from ./istio/bin/istioctl
```

Ensure that all Istio pods are in Running state, the sidecar injector is up, and the default namespace is using sidecar injection:

```shell
workshop $ kubectl get pods -n istio-system
NAME                             READY     STATUS    RESTARTS   AGE
istio-ca-86f55cc46f-f7r2g        1/1       Running   0          1m
istio-ingress-5bb556fcbf-5gvsz   1/1       Running   0          1m
istio-mixer-86f5df6997-5bw96     3/3       Running   0          1m
istio-pilot-67d6ddbdf6-bpps4     2/2       Running   0          1m
workshop $ kubectl -n istio-system get deployment -listio=sidecar-injector
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
istio-sidecar-injector   1         1         1            1           28m
workshop $ kubectl get namespace -L istio-injection
NAME           STATUS    AGE       ISTIO-INJECTION
default        Active    33m       enabled
istio-system   Active    29m       
kube-public    Active    33m       
kube-system    Active    33m
```

You're done! :slightly_smiling_face::+1:
