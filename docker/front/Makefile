container :
	cp ../../front/front.js .
	cp -r ../../front/www .
	docker build -t front .
	docker images | grep front

run-single :
	docker service create --replicas 1 --network ramanujan --publish 8000:8000 --name front -e HOST=eth2 -e BASES=base0:39000,base1:39000 front

rm-single :
	docker service rm front

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
