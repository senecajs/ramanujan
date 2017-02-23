
container :
	cp ../../package.json .
	docker build -t shared .
	docker images | grep shared

clean :
	rm -f *~
	rm -f *.json

.PHONY : container clean

