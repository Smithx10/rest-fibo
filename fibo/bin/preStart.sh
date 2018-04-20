#!/bin/bash

if [[ -z ${CONSUL} ]]; then
    echo "Missing CONSUL environment variable"
    exit 1
fi
