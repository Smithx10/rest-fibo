# rest-fibo
a http endpoint that returns an array that contains fibonachii sequence using the [autopilot pattern](http://autopilotpattern.io/).  check out more examples of the autopilot pattern on https://github.com/autopilotpattern/.  this approach to orchestratin is scheduler agnostic, meaning we can port this application to anywhere where we have unix and ip networking.  my preference of course it to run this on triton because of the networking performance and security.  networking virtualization on triton allows us to mix top of rack rabrics with overlay fabrics, a spoil i've come to love.

# built with
- [bunyan](https://github.com/trentm/node-bunyan)
- [prometheus](https://prometheus.io/)
- [consul](https://www.consul.io/)
- [containerpilot](https://www.joyent.com/containerpilot)
- [docker](https://www.docker.com/)
- [fabio](https://github.com/fabiolb/fabio)
- [nodejs](https://nodejs.org/)
- [restify](http://restify.com/)
- [triton cloud](https://www.joyent.com/triton/compute)

# run it locally in docker

#### required pre-req's:
- [docker](https://www.docker.com/)
- [docker-compose](https://github.com/docker/compose)
- [httpie](https://github.com/jakubroztocil/httpie)
- [git](https://git-scm.com/)
- [gnumake](https://www.gnu.org/software/make/)


#### clone, build, deploy, scale
```
git clone https://github.com/Smithx10/rest-fibo
cd rest-fibo
make local-build
make local-up
make local-scale-up
make local-scale-down
```

#### request example
 
```
bruce.smith@Bruces-MBP /g/f/rest-fibo ❯❯❯ http localhost/api/fibo/-4

HTTP/1.1 409 Conflict
Content-Length: 87
Content-Type: application/json
Date: Sat, 21 Apr 2018 07:16:54 GMT
Server: fibo-api

{
    "code": "InvalidArgument",
    "message": "The Parameter provided is not a Positive Number."
}
```

#### prometheus endpoints
currently fibo will advertise restify metrics on :8080/metrics. fabio is configured currently to only route /api/fibo to the fibo backends. for future expansion we can use fabio's routing to scale horizontally.  if we reach performance limits with fabio, which is also horizontally scalable, we can easily swap out for another LB.

# todo
- k8s deployment
- triton cloud instructions
- tls & secrets all of the things
- add prometheus endpoints to fabio and consul
- operational tests (ex. network partitions, node failures, etc)
- automate the process with a free ci/cd platform
- rotate log data to Manta / Object storage
- cleanup the makefile to do proper versioning with the ci/cd platform
- add pretty graphs with mermaid, maybe?

# developing rest-fibo
if you wish to work on rest-fibo itself, you'll first need [nodejs](https://nodejs.org/) installed. All the modules used should work 6.9.0 and newer. The [dtrace-provider](https://github.com/chrisa/node-dtrace-provider) will require [gnumake](https://www.gnu.org/software/make/) and [python](https://www.python.org/) to build.    


#### environment variables
by default _rest-fibo_ will log to */var/log/* if your local env doesn't have perms you can override this by setting FIBO_LOGPATH to your desired path.

#### example

```
git clone https://github.com/Smithx10/rest-fibo
cd rest-fibo/fibo/src
npm install
mkdir -p ~/var/log
export FIBO_LOGPATH=~/var/log
node api.js
```
at this point you should be able to hit the endpoint on localhost:8080/api/fbo/:param
```
bruce.smith@Bruces-MacBook-Pro /g/f/r/fibo ❯❯❯ http localhost:8080/api/fibo/4                                                                                          ⏎ master ✱
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 13
Content-Type: application/json
Date: Sat, 21 Apr 2018 19:46:39 GMT
Server: fibo-api

"[1,1,2,3,5]"
```



