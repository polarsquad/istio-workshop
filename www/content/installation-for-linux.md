---
title: Installation on Linux
series: installation
hideFromIndex: true
weight: 11
---

If you're using Linux, you can use Minikube for running Kubernetes. In this guide, we're going to show how to run Kubernetes on top of a [KVM](https://www.linux-kvm.org/page/Main_Page)-based virtual machine using Minikube.

1. First, make sure you have Docker installed in Linux. Here's a list of guides for the officially supported distributions.
  - [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
  - [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/) (for Fedora 28 you need to enable `test` repository for now)
  - [Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
  - [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)

2. If you wish to manage Docker as a non-root user, add yourself to the Docker group.
```shell
~ $ sudo usermod -aG docker $(whoami)
~ $ newgrp docker
```

3. Install KVM drivers.
```shell
# Debian/Ubuntu
~ $ sudo apt-get install libvirt-bin qemu-kvm
# Fedora/CentOS/RHEL
~ $ sudo dnf install libvirt-daemon qemu-kvm libvirt-daemon-config-network
```

4. Add yourself to the libvirt group to manage virtual machines as a non-root user.
```shell
# Debian/Ubuntu
~ $ sudo usermod -aG libvirtd $(whoami)
~ $ newgrp libvirtd
# Fedora/CentOS/RHEL
~ $ sudo usermod -aG libvirt $(whoami)
~ $ newgrp libvirt
```

5. We're going to download and install a few tools and make them available in the `$PATH`. This guide assumes that tools will be installed to `~/kubetools`. You can use another path if you like.
```shell
~ $ mkdir -p ~/kubetools
~ $ export PATH="$HOME/kubetools:$PATH"
```

6. Install `kubectl`. It's used for managing and inspecting Kubernetes cluster resources.
```shell
~ $ curl -L -o ~/kubetools/kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
~ $ chmod +x ~/kubetools/kubectl
```
Alternatively, you can follow Kubernetes' [guide on installing `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for your distribution of choice. 

7. Install `minikube`. It's used for setting a Kubernetes cluster locally.
```shell
~ $ curl -L -o ~/kubetools/minikube https://storage.googleapis.com/minikube/releases/v0.26.1/minikube-linux-amd64
~ $ chmod +x ~/kubetools/minikube
```

8. Install KVM driver for Docker Machine. Minikube uses Docker Machine to manage the Kubernetes VM.
```shell
~ $ curl -L -o ~/kubetools/docker-machine-driver-kvm2 https://storage.googleapis.com/minikube/releases/latest/docker-machine-driver-kvm2
~ $ chmod +x ~/kubetools/docker-machine-driver-kvm2
```

9. Launch Minikube with KVM2 driver and the extra configuration shown below.
```shell
~ $ minikube start --vm-driver=kvm2 \
    --extra-config=controller-manager.cluster-signing-cert-file="/var/lib/localkube/certs/ca.crt" \
    --extra-config=controller-manager.cluster-signing-key-file="/var/lib/localkube/certs/ca.key" \
    --extra-config=apiserver.admission-control="NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota"
```

10. Make sure you have [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) add-on enabled in Minikube.
```shell
~ $ minikube addons list | grep ingress
– ingress: disabled
~ $ minikube addons enable ingress
~ $ minikube addons list | grep ingress
– ingress: enabled
```

11. Test Kubernetes
```shell
~ $ kubectl get nodes
NAME       STATUS    ROLES     AGE       VERSION
minikube   Ready     master    53m       v1.10.0
```

Awesome! You're now running Kubernetes on your Linux. Check the Istio installation guide next.