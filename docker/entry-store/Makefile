container :
	cp ../../entry-store/entry-store-*.js .
	docker build -t entry-store .
	docker images | grep entry-store

run-single :
	docker service create --replicas 1 --network ramanujan --name entry-store -e HOST=@eth0 -e BASES=base0:39000,base1:39000 entry-store

rm-single :
	docker service rm entry-store


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
