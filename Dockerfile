FROM node:9.11-alpine

# Add jq
# RUN export JQ_VER=1.5 \
#     && export JQ_URL=https://github.com/stedolan/jq/releases/download/jq-${JQ_VER}/jq-linux64 \
#     && curl -Ls --fail -o /bin/jq ${JQ_URL} \
#     && chmod +x /bin/jq

# Add ContainerPilot and set its configuration
# ENV CONTAINERPILOT=/etc/containerpilot.json5
# RUN export CP_VER=3.3.0 \
#     && export CP_PKG=containerpilot-${CP_VER}.tar.gz \
#     && export CP_SHA1=62621712ef6ba755e24805f616096de13e2fd087 \
#     && export CP_URL=https://github.com/joyent/containerpilot/releases/download/${CP_VER}/${CP_PKG} \
#     && curl -Ls --fail -o /tmp/${CP_PKG} ${CP_URL} \
#     && echo "${CP_SHA1} /tmp/${CP_PKG}" | sha1sum -c \
#     && tar zxf /tmp/${CP_PKG} -C /usr/local/bin \
#     && rm /tmp/${CP_PKG}

# Add Consul and set its configuration
RUN export CONSUL_VER=1.0.7 \
    && export CONSUL_PKG=consul_${CONSUL_VER}_linux_amd64.zip \
    && export CONSUL_URL=https://releases.hashicorp.com/consul/${CONSUL_VER}/${CONSUL_PKG} \
    && export CONSUL_SHA256=$(curl https://releases.hashicorp.com/consul/${CONSUL_VER}/consul_${CONSUL_VER}_SHA256SUMS) \
    && curl -Ls --fail -o /tmp/${CONSUL_PKG} ${CONSUL_URL} \
    && echo "${CONSUL_SHA1} /tmp/${CONSUL_PKG}" | sha1sum -c \
    && unzip /tmp/${CONSUL_PKG} -d /usr/local/bin \
    && rm /tmp/${CONSUL_PKG} \
    && mkdir /etc/consul \
    && mkdir /var/lib/consul \
    && mkdir /data \
    && mkdir /config


