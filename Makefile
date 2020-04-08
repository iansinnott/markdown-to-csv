.PHONY: all clean move main

all: clean build move

clean:
	rm -rf dest

build:
	node index.js ../blog.iansinnott.com/content/_posts

move:
	mkdir -p dest
	mv *.md dest
	mv *.csv dest

