container :
	cp ../../front/front.js .
	docker build -t front .
	docker images | grep front

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
