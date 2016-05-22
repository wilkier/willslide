(function($){
	$.fn.willslide = function(options){
		var el = this;
		var settings = $.extend({
			color: "green",
			background:"white"
		}, options);
		console.log(settings.color);
		el.css({"color":settings.color, "background-color":settings.background});
		el.click(function(){
			el.fadeOut();
			setTimeout(function(){
				el.show();
			},500);
		});
		return this;
	};

	$(document).ready(function(){
		$("a").willslide({
			color:"red",
		});
	});
}(jQuery));