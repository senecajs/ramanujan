container :
	cp ../../api/api-service.js .
	docker build -t api .
	docker images | grep api

run-single :
	docker service create --replicas 1 --network ramanujan  --name api -e HOST=eth0 -e BASES=base0:39000,base1:39000 api

rm-single :
	docker service rm api

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
