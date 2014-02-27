clean:
	./node_modules/.bin/gulp clean

build:
	./node_modules/.bin/gulp build

run:
	./node_modules/.bin/gulp server

.PHONY: clean build run
