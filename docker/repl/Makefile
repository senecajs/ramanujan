container :
	cp ../../repl/repl-service.js .
	cp ../../monitor/monitor.js .
	docker build -t repl .
	docker images | grep repl

run-single :
	docker service create --replicas 1 --network ramanujan -p 10001:10001 --name repl -e REPL_HOST=0.0.0.0  -e HOST=@eth2 -e BASES=base0:39000,base1:39000 repl


rm-single :
	docker service rm repl


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
