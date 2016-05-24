(function($){
	$.fn.willslide = function(options){

	    if ( methods[ options ] ) {
            return methods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof options === 'object' || ! options ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery.willslide' );
        } 
		
	};

	var methods = {
        init : function(options) {

        	var el = this;

			willSlideSettings = $.extend({
				width: 1500,
				height: 500,
				maxWidth:0
			}, options);

			if(willSlideSettings.maxWidth<willSlideSettings.width){
				willSlideSettings.maxWidth=willSlideSettings.width;
			}
			
			el.running=false;
		    el.totalSlides=methods.countSlides(el)
		    el.slidesOrder=[];
		    el.currentSlidesOrder=[];
		    el.timer=0;
		    el.windowW=$(window).width();
		    el.windowH=$(window).height();
		    el.scale=methods.scale(el);
		    el.scaleMaxW=methods.scaleMaxW(el);

			methods.hide(el);
			methods.loadImages(el);
			methods.build(el);


			$(window).resize(function(){
				el.windowW=$(window).width();
		    	el.windowH=$(window).height();
				el.scale=methods.scale(el);
				el.scaleMaxW=methods.scaleMaxW(el);
				methods.resize(el);
			});

			return this;
			
        },


        loadImages: function( el ){//First load all images then show slider
		    
		    function imageLoaded(){
		       counter--; 
		       if( counter === 0 ) {
		       		el.show();
		       		methods.coverImages( el );		       			
		       }
		    }

		    var images = el.find("img");
		    var counter = images.length;
		    
		    images.each(function() {
		      if(this.complete) {
		        imageLoaded.call(this);
		      } else {
		        $(this).one('load', imageLoaded);
		      }
		  	});
        },

        countSlides : function(el){//Return de number os divs ".slide" inside the slider and put an indentifier class on each ".slide"
        	var slides = el.find(".slide").length;
        	return slides;
        },

        build : function( el ){//Constructs the necessary structure to slider
        	var slides = el.find(".slide").each(function(e){
				$(this).addClass("slide"+(e+1));
        		el.slidesOrder.push(e+1);
        	});
        	el.find("[willslidelayer]").each(function(){
    			$(this).wrap("<div class='layer-wrapper'><div class='layer'></div></div>");
    		});
        	methods.resize( el );
        },

        scale: function( el ){
        	var scale = el.windowW/willSlideSettings.width;
        	return scale;
        },

        scaleMaxW: function( el ){
        	var scale = el.windowW/willSlideSettings.maxWidth;
        	return scale;
        },

        resize : function( el ){
        	var slideMaxW = willSlideSettings.maxWidth;
        	var slideW = willSlideSettings.width;
        	var slideH = willSlideSettings.height;
        	el.css({width : el.windowW});

        	if(slideMaxW > slideW){
	        	if(el.windowW > slideMaxW){
					el.css({height : willSlideSettings.height*el.scaleMaxW});
					el.find(".layer").each(function(){
						$(this).css({
							width : "100%",
							height : "100%",
							left : 0, 
						});
					});
				}
				else {
					
					
					if(el.windowW > slideW){
						var left = (el.windowW - slideMaxW)/2;
						el.css({height : willSlideSettings.height});
						el.find(".layer").each(function(){
							$(this).css({
								width : slideMaxW,
								height : slideH,
								left : left, 
							});
						});
					}
					else{
						var left = (el.windowW - slideMaxW * el.scale)/2;
						el.css({height : willSlideSettings.height * el.scale});
						el.find(".layer").each(function(){
							$(this).css({
								width : slideMaxW * el.scale,
								height : slideH * el.scale,
								left : left, 
							});
							console.log(left);
						});	
					}
				}	
        	}
        	else{
        		el.css({height : willSlideSettings.height * el.scale});			
        	}
        },

        coverImages : function( el ){
        	el.find("img[willslidelayer='full']").each(function(){
        		$(this).css({
        			width : willSlideSettings.maxWidth,
        			height : "auto",
        			position : "absolute"
        		});
        		console.log($(this).width());

        		var rel = 1/($(this).height() / willSlideSettings.height);
        		var left = ($(this).width() * rel-$(this).width())/2;
        		var leftPercent = left / $(this).width();
        		console.log(leftPercent);
        		if(rel > 1){
        			$(this).css({
	        			width : (rel*100)+"%",
	        			left: -(leftPercent*100)+"%"
	        		});
        		}
        		else{

        		}
        		
        	});
        },

        hide : function( el ) {//Hide all content of the slider
        	el.hide();
        	console.log("hide");
        },

        play : function( el ) {//Play the slider
        	console.log("rodei play");
        },

        stop : function( el ) { //Stop the slider
        	console.log("rodei stop");
        }
    };

}(jQuery));