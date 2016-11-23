FILES = ./**/*.js
deploy: $(FILES)
	npm install
	node app.js
