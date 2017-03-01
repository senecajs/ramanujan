container :
	cp ../../fanout/fanout-*.js .
	docker build -t fanout .
	docker images | grep fanout

run-single :
	docker service create --replicas 1 --network ramanujan --name fanout -e HOST=@eth0 -e BASES=base0:39000,base1:39000 fanout

rm-single :
	docker service rm fanout


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
