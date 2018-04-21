# rest-fibo
a http endpoint that returns an array that contains fibonachii sequence.

# built with
- consul
- docker
- fabio
- nodeJS
- restify
- triton cloud

# run it locally in docker

#### required pre-req's:
- docker
- docker-compose
- git
- make

```
git clone https://github.com/Smithx10/rest-fibo
cd rest-fibo
make local-build
make local-up

```

# run it on triton
#### required pre-req's




# todo
- k8s deployment
- operational tests (ex. network partitions, node failures, etc)
    - automate the process with a free ci/cd platform
    - cleanup the makefile to do proper versioning with the ci/cd platform
