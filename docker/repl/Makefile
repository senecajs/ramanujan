container :
	cp ../../repl/repl-service.js .
	docker build -t repl .
	docker images | grep repl

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
