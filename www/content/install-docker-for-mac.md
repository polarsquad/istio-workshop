---
title: Install with Docker for Mac with Kubernetes
series: installation
hideFromIndex: true
weight: 10
---

If you're using [Docker for Mac](https://docs.docker.com/docker-for-mac/) installation is easy.

1. Install Edge version of Docker for Mac from [here](https://download.docker.com/mac/edge/Docker.dmg)

2. Turn on experimental Kubernetes support
   
   1. Click Docker icon at top right corner

   2. Click `Preferences`
   
   3. Select `Kubernetes` tab

   4. Select `Enable Kubernetes`

   5. Click `Apply`

3. Wait until installation completes!

4. Test Kubernetes
```shell
user@mac:~/ $ kubectl get nodes
NAME                 STATUS    ROLES     AGE       VERSION
docker-for-desktop   Ready     master    3m        v1.9.6
```

5. Get `istioctl` and installation yaml files
```shell
user@mac:~/ $ curl -L https://git.io/getLatestIstio | sh -
user@mac:~/ $ cd istio-0.7.1
```

6. Add `istioctl` to PATH
```shell
user@mac:~/istio-0.7.1/ $ export PATH=$PWD/bin:$PATH
```

7. Install core components
```shell
user@mac:~/istio-0.7.1/ $ kubectl apply -f install/kubernetes/istio.yaml
```
> If you get "unable to recognize" errors, re-run the apply command

8. Verify installation
```shell
user@mac:~/ $ kubectl get pods -n istio-system
NAME                             READY     STATUS    RESTARTS   AGE
istio-ca-86f55cc46f-f7r2g        1/1       Running   0          1m
istio-ingress-5bb556fcbf-5gvsz   1/1       Running   0          1m
istio-mixer-86f5df6997-5bw96     3/3       Running   0          1m
istio-pilot-67d6ddbdf6-bpps4     2/2       Running   0          1m
```
Ensure that all pods are in `Running` state

9. You're done! :)
