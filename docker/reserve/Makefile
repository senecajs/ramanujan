container :
	cp ../../reserve/reserve-*.js .
	docker build -t reserve .
	docker images | grep reserve

run-single :
	docker service create --replicas 1 --network ramanujan --name reserve -e HOST=@eth0 -e BASES=base0:39000,base1:39000 reserve

rm-single :
	docker service rm reserve


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
