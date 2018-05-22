---
title: Install with Docker for Mac with Kubernetes
series: installation
hideFromIndex: true
weight: 10
---

If you're using [Docker for Mac](https://docs.docker.com/docker-for-mac/), the installation is easy.

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
~ $ kubectl get nodes
NAME                 STATUS    ROLES     AGE       VERSION
docker-for-desktop   Ready     master    3m        v1.9.6
```

Brilliant! You're now running Kubernetes on your Mac.

Next check the [Istio installation guide »]({{< ref "install-istio.md" >}})