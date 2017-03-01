container :
	cp ../../timeline/timeline-logic.js .
	cp ../../timeline/timeline-service.js .
	docker build -t timeline-shard .
	docker images | grep timeline-shard

run-single-0 :
	docker service create --replicas 1 --network ramanujan --name timeline-shard-0 -e SHARD=0 -e HOST=@eth0 -e BASES=base0:39000,base1:39000 timeline-shard

run-single-1 :
	docker service create --replicas 1 --network ramanujan --name timeline-shard-1 -e SHARD=1 -e HOST=@eth0 -e BASES=base0:39000,base1:39000 timeline-shard

rm-single-0 :
	docker service rm timeline-shard-0

rm-single-1 :
	docker service rm timeline-shard-1


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
