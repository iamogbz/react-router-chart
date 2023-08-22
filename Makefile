upstream:
	@git remote add upstream https://github.com/iamogbz/node-js-boilerplate
	@git push origin main
	@git push --all
	echo "upstream: remote successfully configured"

npm-publish:
	npm run build
	npm publish

ifndef VERBOSE
.SILENT:
endif
