clean:
	./node_modules/.bin/gulp clean

build:
	./node_modules/.bin/gulp build

run:
	./node_modules/.bin/gulp server

test:
	@echo "Tests are run in the browser."
	@echo "Run:"
	@echo "  make build"
	@echo "  make run"
	@echo "Then navigate to http://localhost:4000/runner.html"

.PHONY: clean build run test
