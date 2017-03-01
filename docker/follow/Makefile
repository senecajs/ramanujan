container :
	cp ../../follow/follow-*.js .
	docker build -t follow .
	docker images | grep follow

run-single :
	docker service create --replicas 1 --network ramanujan --name follow -e HOST=@eth0 -e BASES=base0:39000,base1:39000 follow

rm-single :
	docker service rm follow


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
