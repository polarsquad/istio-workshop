
# Install all the build dependencies
setup:
	curl -sfL https://install.goreleaser.com/github.com/gohugoio/hugo.sh | bash
.PHONY: setup

# Generate the static documentation
build:
	@./bin/hugo --source www
.PHONY: static

serve:
	@./bin/hugo server -w -s www
.PHONY: serve

.DEFAULT_GOAL := build