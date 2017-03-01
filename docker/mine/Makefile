container :
	cp ../../mine/mine-service.js .
	cp -r ../../mine/www .
	docker build -t mine .
	docker images | grep mine

run-single :
	docker service create --replicas 1 --network ramanujan  --name mine -e HOST=eth0 -e BASES=base0:39000,base1:39000 mine

rm-single :
	docker service rm mine

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
