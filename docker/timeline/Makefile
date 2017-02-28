container :
	cp ../../timeline/timeline-shard-service.js .
	docker build -t timeline .
	docker images | grep timeline

run-single :
	docker service create --replicas 1 --network ramanujan --name timeline -e HOST=@eth0 -e BASES=base0:39000,base1:39000 timeline

rm-single :
	docker service rm timeline


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
