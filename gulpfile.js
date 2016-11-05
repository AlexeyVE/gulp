let gulp=require('gulp'),
    sass=require('gulp-sass'),
    less=require('gulp-less'),
    browserSync=require('browser-sync'),
    uglifyjs=require('gulp-uglifyjs'),
    concat=require('gulp-concat'),
    cssnano=require('gulp-cssnano'),
    rename=require('gulp-rename'),
    del=require('del'),
    imagemin=require('gulp-imagemin'),
    pngquant=require('imagemin-pngquant'),
    cache=require('gulp-cache')
    autoprefixer=require('gulp-autoprefixer');   

gulp.task('browser-sync',()=> {
	browserSync({
		server:{
			baseDir:'app'
		},
		notify:false
	})
});

gulp.task('sass',()=> {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css/'))
	.pipe( browserSync.reload({stream:true}) )
});

gulp.task('less',()=> {
	return gulp.src('app/less/**/*.less')
	.pipe(less())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(gulp.dest('app/css/'))
	.pipe( browserSync.reload({stream:true}) )
});

gulp.task('css-libs',()=> {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix:'.min'}) )
	.pipe(gulp.dest('app/css'))
});

gulp.task('javascript',()=> {
	return gulp.src(['app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap/dist/js/bootstrap.min.js','app/js/main.js'])
	.pipe(concat('libs.min.js') )
	.pipe(uglifyjs())
	.pipe(gulp.dest('app/js/'))
	.pipe( browserSync.reload({stream:true}) )
});
gulp.task('img',()=> {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced:true,
		progressive:true,
		svgoPlugins:[{removeViewbox:false}],
		use:[pngquant()]
	})))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('watch',['less','sass','javascript','css-libs','browser-sync'],()=>{
	gulp.watch('app/less/**/*',['less']);
	gulp.watch('app/sass/**/*',['sass']);
	gulp.watch('app/js/**/*',['javascript']);
	gulp.watch('app/.html',browserSync.reload);
});

gulp.task('clean',()=> {
	return del.sync('dist')
});

gulp.task('build',['clean','img','less','sass','javascript'],()=>{
	let buildCss=gulp.src(['app/css/libs.min.css',
						   'app/css/main.css'])
	.pipe(gulp.dest('dist/css'))

	let buildFonts=gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))

	let buildJs=gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	let buildHtml=gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
});

gulp.task('default',['watch']);

gulp.task('clear',()=> {
    return cache.clearAll();
}); 


