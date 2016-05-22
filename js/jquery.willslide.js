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
				mode: "fit",//fit, expand
			}, options);

			el.running=false;
		    el.totalSlides=methods.countSlides(el)
		    el.slidesOrder=[];
		    el.currentSlidesOrder=[];
		    el.timer=0;
		    el.windowW=$(window).width();
		    el.windowH=$(window).height();
		    el.scale=methods.scale(el);

			methods.hide(el);
			methods.loadImages(el);
			methods.build(el);


			$(window).resize(function(){
				el.windowW=$(window).width();
		    	el.windowH=$(window).height();
				el.scale=methods.scale(el);
				methods.resize(el);
			});

			return this;
			
        },


        loadImages: function( el ){//First load all images then show slider
		    
		    function imageLoaded(){
		       counter--; 
		       if( counter === 0 ) {
		       		el.show();	
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
        	el.find("[willslidemode='fit']").each(function(){
    			$(this).wrap("<div class='layer-wrapper'><div class='fit'></div></div>");
    		});
    		el.find("[willslidemode='expand']").each(function(){
    			$(this).wrap("<div class='layer-wrapper'><div class='expand'></div></div>");
    		});
        	methods.resize( el );
        },

        scale: function( el ){
        	var scale = el.windowW/willSlideSettings.width;
        	return scale;
        },

        resize : function( el ){
        	if(willSlideSettings.mode==="fit"){
        		console.log(el.scale);
        		if(el.scale>1){
        			el.find(".fit").each(function(){
						$(this).css({
							width : willSlideSettings.width,
							height : willSlideSettings.height, 
						});
					});
					
					el.find(".expand").each(function(){
						$(this).css({
							width : el.windowW,
							height : willSlideSettings.height, 
						});
					});

					el.css({
						width : el.windowW,
						height : willSlideSettings.height, 
					});	
        		}
        		else{
					el.find(".fit").each(function(){
						$(this).css({
							width : el.windowW,
							height : willSlideSettings.height*el.scale, 
						});
					});

					el.find(".expand").each(function(){
						$(this).css({
							width : el.windowW,
							height : willSlideSettings.height*el.scale, 
						});
					});

					el.css({
						width : el.windowW,
						height : willSlideSettings.height*el.scale, 
					});
				}	
        	}
        	else if(willSlideSettings.mode==="expand"){
        		el.find(".fit").each(function(){
					$(this).css({
						width : el.windowW,
						height : willSlideSettings.height*el.scale, 
					});
				});
				el.find(".expand").each(function(){
					$(this).css({
						width : el.windowW,
						height : willSlideSettings.height*el.scale, 
					});
				});

				el.css({
					width : el.windowW,
					height : willSlideSettings.height*el.scale, 
				});
        	}
        	
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