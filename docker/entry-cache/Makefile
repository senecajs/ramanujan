container :
	cp ../../entry-cache/entry-cache-*.js .
	docker build -t entry-cache .
	docker images | grep entry-cache

run-single :
	docker service create --replicas 1 --network ramanujan --name entry-cache -e HOST=@eth0 -e BASES=base0:39000,base1:39000 entry-cache

rm-single :
	docker service rm entry-cache


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
