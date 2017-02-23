container :
	cp ../../base/base.js .
	docker build -t base .
	docker images | grep base

clean :
	rm -f *~
	rm -f *.js
	rm -f *.json

.PHONY : container clean
