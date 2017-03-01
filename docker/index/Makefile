container :
	cp ../../index/index-*.js .
	docker build -t index .
	docker images | grep index

run-single :
	docker service create --replicas 1 --network ramanujan --name index -e HOST=@eth0 -e BASES=base0:39000,base1:39000 index

rm-single :
	docker service rm index


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
