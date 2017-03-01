container :
	cp ../../search/search-service.js .
	cp -r ../../search/www .
	docker build -t search .
	docker images | grep search

run-single :
	docker service create --replicas 1 --network ramanujan  --name search -e HOST=eth0 -e BASES=base0:39000,base1:39000 search

rm-single :
	docker service rm search

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
