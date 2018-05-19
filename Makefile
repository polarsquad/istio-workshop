
# Install all the build dependencies
setup:
	curl -sfL https://install.goreleaser.com/github.com/gohugoio/hugo.sh | bash
.PHONY: setup

# Generate the static documentation
build:
	@./bin/hugo --source www
.PHONY: build

serve:
	@./bin/hugo server --watch --source www
.PHONY: serve

publish: build
	cd www/static
	rm -rf .git
	git init
	git add -A
	git commit -m 'update static site'
	git push -f git@github.com:polarsquad/istio-workshop.git master:gh-pages

.DEFAULT_GOAL := build