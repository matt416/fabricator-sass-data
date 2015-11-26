# Fabricator Sass Data

> Gulp plugin for Fabricator to find SASS variables and turn them into JSON data.

Your SASS/SCSS variables Become a JSON object inside your specified filename (toolkit.json by default)

From

```sass
	$black: #1A1608
	$grey: #666666
	$yellow: #FCD900
	$yellow-dirty: #CFAD00
	$yellow-pale: #FFDD4F
```

To

```json
{
	"colors" : {
		"black": "#1A1608",
		"grey": "#666666",
		"yellow": "#FCD900",
		"yellow-dirty": "#CFAD00",
		"yellow-pale": "#FFDD4F"
	}
}
```
Usage

Install with `npm i --save-dev fabricator-sass-data`


Inside your gulpfile.js include:


```js

// At the top with the other requirements:

var sassData = require('fabricator-sass-data');


// Further down with the other Gulp tasks

// Task
gulp.task('sass-data', function () {
    return gulp.src('src/assets/toolkit/styles/variables/**/*.{sass,scss}') // Location of the SASS/SCSS files you want to process.
        .pipe(sassData())
       	.pipe(gulp.dest('src/data')); // Output directory
});

// Watch for changes
// Paste this with the other watch tasks, inside the 'serve' task

gulp.task('sass-data:watch', ['sass-data']);
gulp.watch('src/assets/toolkit/styles/variables/**/*.{sass,scss}', ['sass-data:watch']); // Ensure the location is the same as above so the task runs when the SASS files are changed.

```


I also found it useful to add a dependency to the 'assemble' task. This ensures the JSON file is created before Fabricator attempts to add it to the project.

```js
gulp.task('assemble', ['sass-data'], function (done) {
	assemble({
		helpers: helpers,
		logErrors: config.dev
	});
	done();
});
```
