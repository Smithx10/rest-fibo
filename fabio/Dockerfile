FROM centos:7

ENV CONTAINERPILOT=/etc/containerpilot.json5

# Install yum pkg deps
RUN yum update -y \
      && yum install -y \
        curl \
        unzip \
      && yum clean all 

# Add jq
 RUN export JQ_VER=1.5 \
     && export JQ_SHA256=c6b3a7d7d3e7b70c6f51b706a3b90bd01833846c54d32ca32f0027f00226ff6d \
     && export JQ_URL=https://github.com/stedolan/jq/releases/download/jq-${JQ_VER}/jq-linux64 \
     && curl -Ls --fail -o /bin/jq ${JQ_URL} \
     && echo "${JQ_SHA256}  /bin/jq" | sha256sum -c \
     && chmod +x /bin/jq

# Add Fabio and Set its Configuration
RUN export FAB_VER=1.5.2 \
    && export GO_VER=1.8.3 \
    && export FAB_PKG=fabio-${FAB_VER}-go${GO_VER}-linux_amd64 \
    && export FAB_URL=https://github.com/fabiolb/fabio/releases/download/v${FAB_VER}/${FAB_PKG} \ 
    && export FAB_SHA1=8067231054e7ff1c97ca209008cb84699d076874 \
    && curl -Ls --fail -o /usr/sbin/fabio ${FAB_URL} \
    && echo "${FAB_SHA1} /usr/sbin/fabio" | sha1sum -c \
    && chmod +x /usr/sbin/fabio 

# Add ContainerPilot and set its configuration
RUN export CP_VER=3.3.0 \
    && export CP_PKG=containerpilot-${CP_VER}.tar.gz \
    && export CP_SHA1=$(curl -L https://github.com/joyent/containerpilot/releases/download/${CP_VER}/containerpilot-${CP_VER}.sha1.txt | awk '{print $1}') \
    && export CP_URL=https://github.com/joyent/containerpilot/releases/download/${CP_VER}/${CP_PKG} \
    && curl -Ls --fail -o /tmp/${CP_PKG} ${CP_URL} \
    && echo "${CP_SHA1}  /tmp/${CP_PKG}" | sha1sum -c \
    && tar zxf /tmp/${CP_PKG} -C /usr/local/bin \
    && rm /tmp/${CP_PKG}

# Add Consul and set its configuration
RUN export CONSUL_VER=1.0.7 \
    && export CONSUL_PKG=consul_${CONSUL_VER}_linux_amd64.zip \
    && export CONSUL_URL=https://releases.hashicorp.com/consul/${CONSUL_VER}/${CONSUL_PKG} \
    && export CONSUL_SHA256=$(curl https://releases.hashicorp.com/consul/${CONSUL_VER}/consul_${CONSUL_VER}_SHA256SUMS | grep linux_amd64 | awk '{print $1}') \
    && curl -Ls --fail -o /tmp/${CONSUL_PKG} ${CONSUL_URL} \
    && echo "${CONSUL_SHA256}  /tmp/${CONSUL_PKG}" | sha256sum -c \
    && unzip /tmp/${CONSUL_PKG} -d /usr/local/bin \
    && rm /tmp/${CONSUL_PKG} \
    && mkdir /etc/consul \
    && mkdir /var/lib/consul \
    && mkdir /data \
    && mkdir /config

#https://www.joyent.com/containerpilot/docs/configuration/configuration-file
COPY fabio/etc/containerpilot.json5 /etc/containerpilot.json5

EXPOSE 80
EXPOSE 443
EXPOSE 9999
EXPOSE 9998
