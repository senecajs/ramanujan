container :
	cp ../../post/post-*.js .
	docker build -t post .
	docker images | grep post

run-single :
	docker service create --replicas 1 --network ramanujan --name post -e HOST=@eth0 -e BASES=base0:39000,base1:39000 post

rm-single :
	docker service rm post


clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
