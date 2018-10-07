npm-publish:
	npm run build
	npm publish

ifndef VERBOSE
.SILENT:
endif
