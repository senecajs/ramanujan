container :
	cp ../../home/home-service.js .
	cp -r ../../home/www .
	docker build -t home .
	docker images | grep home

run-single :
	docker service create --replicas 1 --network ramanujan  --name home -e HOST=eth0 -e BASES=base0:39000,base1:39000 home

rm-single :
	docker service rm home

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
