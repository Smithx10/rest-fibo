# Makefile for shipping and testing the container image.

MAKEFLAGS += --warn-undefined-variables
.DEFAULT_GOAL := build
.PHONY: *

# we get these from CI environment if available, otherwise from git
GIT_COMMIT ?= $(shell git rev-parse --short HEAD)
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)

namespace ?= smithx10
tag := branch-$(shell basename $(GIT_BRANCH))
image := $(namespace)/fibo
testImage := $(namespace)/fibo-testrunner

## Display this help message
help:
	@awk '/^##.*$$/,/[a-zA-Z_-]+:/' $(MAKEFILE_LIST) | awk '!(NR%2){print $$0p}{p=$$0}' | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' | sort

# ------------------------------------------------
# Container builds

## Builds the application container image locally
local-build:
	docker build -f fibo/Dockerfile -t=$(image):latest .
	docker build -f fabio/Dockerfile -t=smithx10/fabio:latest .

triton-build: 
	triton-docker build -f fibo/Dockerfile -t=$(image):latest .
	triton-docker build -f fabio/Dockerfile -t=smithx10/fabio:latest .

## This Process would be taken care of in CI to make sure the application is cleanly deployed.  For now, I'm just going to show operability.

# Push the current application container images to the Docker Registry
#push:
	#docker push $(image):$(tag)
	#docker push $(testImage):$(tag)

## Tag the current images as 'latest' and push them to the Docker Registry
#ship:
	#docker tag $(image):$(tag) $(image):latest
	#docker tag $(testImage):$(tag) $(testImage):latest
	#docker tag $(image):$(tag) $(image):latest
	#docker push $(image):$(tag)
	#docker push $(image):latest


# ------------------------------------------------
# Test running


# ------------------------------------------------
# Up / Down / Clean Locally
local-up:
	docker-compose -f examples/compose/docker-compose.yml -p fibo up -d

local-down:
	docker-compose -f examples/compose/docker-compose.yml -p fibo down

# ------------------------------------------------
# Up / Down / Clean on Triton
triton-up:
	triton-compose -f examples/triton/docker-compose.yml -p fibo up -d

triton-down:
	triton-compose -f examples/triton/docker-compose.yml -p fibo down

int-tests:





## Print environment for build debugging
debug:
	@echo GIT_COMMIT=$(GIT_COMMIT)
	@echo GIT_BRANCH=$(GIT_BRANCH)
	@echo namespace=$(namespace)
	@echo tag=$(tag)
	@echo image=$(image)
	@echo testImage=$(testImage)

check_var = $(foreach 1,$1,$(__check_var))
__check_var = $(if $(value $1),,\
	$(error Missing $1 $(if $(value 2),$(strip $2))))
