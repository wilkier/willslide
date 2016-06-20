(function ($) {

  var focused = true;

  //FlexSlider: Object Instance
  $.willslide = function(element, options) {
    var el = $(element);

    // making variables public
    el.vars = $.extend({}, $.willslide.defaults, options);
    console.log(el.vars.maxWidth);
    if(el.vars.maxWidth<el.vars.width){
      el.vars.maxWidth=el.vars.Width;
    }
    
    // Store a reference to the slider object
    el.data("willslide",el);
    //$.data(element, "willslide", el);
    
    // Private slider methods
    var methods = {
        init : function() {
          el.isAnimating=false;
          el.isStopped=false;
          el.totalSlides=methods.countSlides(el);
          el.slidesOrder=[];
          el.currentSlide=1;
          el.currentTime=0;
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
            methods.callBackTimer(methods.resize,500,1,1);
          });

          return this;
      
        },

        callBackTimer:function(func,time,repeat,playBefore){
          var counter=0;
          if(repeat==null || repeat==0){
            repeat=1;
          }
          if(playBefore){
            func();
          }
          var loop = setInterval(function(){
            func();
            counter++;
            if(counter>=repeat){
              clearInterval(loop);
            }
          },time);
        },

        loadImages: function(){//First load all images then show slider
        
          function imageLoaded(){
             counter--; 
             if( counter === 0 ) {
                el.show();
                methods.coverImages();
                methods.slideTimer();
                methods.animate();         
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

        slideTo : function(nextSlide){
          if(!el.isAnimating){
            if(el.currentSlide!=nextSlide){
              el.currentSlide=nextSlide;
              el.isAnimating=true;
              var next = el.find(".slide"+nextSlide);
              var exitingSlide = el.find(".current");
              exitingSlide.addClass("goodbye").removeClass("current");
              next.addClass("current");
              
              $(".bullet.current-bullet").removeClass("current-bullet");//Refresh  the current bullet
              $(".bullet"+nextSlide).addClass("current-bullet");
              
              exitingSlide.animate({opacity:0},300);
              el.currentTime=0;
              setTimeout(function(){
                exitingSlide.removeClass("goodbye");
                exitingSlide.css({opacity:1});
                el.isAnimating=false;
                if(el.isStopped){//if slide was stopped, puts slider to play again
                  el.stopSlider();  
                }
                methods.animate();//call slide animations
              }, 400);
            }
            else{
              console.log("Can't slide to the current slide");
            }
          }
          else{
            console.log("Wait the slide animation please");
          }
        },

        slideTimer: function(){
          if(el.vars.showTimeBar){
            setInterval(function(){
              if(!el.isStopped && focused && !el.isAnimating){
                el.currentTime+=el.vars.refreshStep;
                if(el.currentTime>el.vars.time){
                  el.currentTime=0;
                  methods.autoSlide();
                }
                var percentLoad=el.currentTime/el.vars.time*100;
                $(".willslide-loading").css('width',percentLoad+"%");
              }
            }, el.vars.refreshStep);
          }
          else{
            setInterval(function(){
              if(!el.isStopped && focused && !el.isAnimating){
                el.currentTime+=el.vars.refreshStep;
                if(el.currentTime>el.vars.time){
                  el.currentTime=0;
                  methods.autoSlide();
                }
              }
            }, el.vars.refreshStep);
          }   
        },

        autoSlide : function(){
          var order = el.find(".current").data("slideOrder");
          if(order == el.totalSlides){
            nextSlide=1;
            console.log(nextSlide);
            methods.slideTo(nextSlide);
          }
          else{
            nextSlide=(order+1);
            console.log(nextSlide);
            methods.slideTo(nextSlide);
          }
        },

        countSlides : function(){//Return de number os divs ".slide" inside the slider and put an indentifier class on each ".slide"
          var slides = el.find(".slide").length;
          return slides;
        },

        build : function(){//Constructs the necessary structure to slider
          el.addClass("willslide");
          if(el.vars.thumbs){methods.createThumbs();}
          var slides = el.find(".slide").each(function(e){
            
            if(el.vars.thumbs){//creates a bullet for each slide and makes the current slide bullet
              $(".thumbs-container").append("<div class='bullet bullet"+(e+1)+"'></div>");//Creates a bullet with an unique class, bullet1, bullet2, bullet3...
              var bullet = el.find(".bullet"+(e+1));
              bullet.data("order",(e+1));//save bullet sequence in data
              bullet.click(function(){//creates the function to change slide for each bullet
                var nextSlide = bullet.data("order");
                methods.slideTo(nextSlide);
              });
              if(e==0){
                bullet.addClass("current-bullet");
              }
            }
            if(e==0){//verify if is the first slide to add class current
              $(this).addClass("current");
            }
            $(this).addClass("slide"+(e+1));//add an unique class to each slide, slide1, slide2, slide3...
            $(this).data("slideOrder",(e+1));//add the sequence number inside slideOrder data atribute
          });

          el.find("[willslidelayer]").each(function(){
            $(this).wrap("<div class='layer-wrapper'><div class='layer'></div></div>");
            $(this).parent(".layer").css({width:el.vars.maxWidth, height:el.vars.height});
          });
          
          if(el.vars.showTimeBar){methods.createTimeBar();}
          if(el.vars.controls){methods.createControls();}
          if(el.vars.nav){methods.createNav();}

          methods.getAnimateVars();
          methods.resize();
        },

        createTimeBar:function(){
          el.append("<div class='willslide-loading'></div>");
        },

        createControls:function(){
          if(!el.find(".sliderControl").length){ //Verify if exist an element with the class 'slideControl', if isn't, creates one.
            el.append("<div class='sliderControl'><span class='will-play'>PLAY</span><span class='will-stop' >STOP</span></div>");
          }
          el.find(".will-play").click(function(){
            el.stopSlider();
          });
          el.find(".will-stop").click(function(){
            el.stopSlider();
          });
        },

        createNav:function(){
          if(!el.find(".nav-next").length){ //Verify if exist an element with the class 'nav-next', if isn't, creates one.
            el.append("<div class='nav-next will-slide-next'>NEXT</div>");
          }
          if(!el.find(".nav-prev").length){ //Verify if exist an element with the class 'nav-prev', if isn't, creates one.
            el.append("<div class='nav-prev will-slide-prev'>PREV</div>");
          }
          el.find(".nav-next").click(function(){
            el.next();
          });
          el.find(".nav-prev").click(function(){
            el.prev();
          });
        },

        createThumbs:function(){
          if(!el.find(".thumbs-container").length){ //Verify if exist an element with the class 'thumbs-container', if isn't, creates one.
            el.append("<div class='thumbs-container'></div>");
          }
        },

        scale: function(){
          var scale = el.windowW/el.vars.width;
          return scale;
        },

        scaleMaxW: function(){
          var scale = el.windowW/el.vars.maxWidth;
          return scale;
        },

        getAnimateVars: function(){
          el.find("[animate]").each(function(){
            var animatedElement=$(this);
                dataString = animatedElement.attr("animate");//get attr animate value
                dataString=dataString.replace(/ /g,"");//remove spaces
                data = dataString.split(",");//separate the "," in an array
                dtop = null;//create vars
                dleft = null;
                time = null;
                delay = null;
                ease = null;

            data.forEach(function(value) {//new animation values
              if(dtop == null){dtop = value.split("dtop:")[1]};
              if(dleft == null){dleft = value.split("dleft:")[1]}; 
              if(time == null){time = value.split("time:")[1]}; 
              if(delay == null){delay = value.split("delay:")[1]}; 
              if(ease == null){ease = value.split("ease:")[1]}; 
            });

            if(dtop == null){dtop=0};//if value is still null, apply default value
            if(dleft == null){dleft=0}; 
            if(time == null){time=0}; 
            if(delay == null){delay=0}; 
            if(ease == null){ease="linear"};

            console.log(animatedElement);
            animatedElement.parent(".layer").data({"dtop":dtop, "dleft":dleft, "time":time, "delay":delay, "ease":ease}).addClass("animated-layer to-load");
          });
        },

        animate:function(){
          
          el.find(".animated-layer.to-load").each(function(){
            var animatedElement=$(this);
            animatedElement.css({
              top:animatedElement.data("dtop")+"%", 
              left:animatedElement.data("dleft")+"%"
            });
            animatedElement.removeClass("to-load");//after set the initial values, remove the class "to-load" to not set than again   
          });

          var current = el.find(".current");
          current.find(".animated-layer").each(function(){
            var animatedElement=$(this);
            var time = parseInt(animatedElement.data("time"));
            setTimeout(function(){
              animatedElement.animate({
                top:0, 
                left:0
              }, 
              {
                easing : animatedElement.data("ease"), 
                duration : time
              })
            }, animatedElement.data("delay"));
            animatedElement.addClass("to-load");
          });
        },

        transform : function(elem, transform){
          elem.css({
            "-ms-transform": transform,
            "-webkit-transform": transform,
            "-moz-transform": transform,
            "transform": transform,
            "-ms-transform-origin": "left top",
            "-webkit-transform-origin": "left top",
            "-moz-transform-origin": "left top",
            "transform-origin": "left top",
          });
        },

        resize : function(){//when window is resized, calculates if should scale width and height of slider and each layer adjusting his left margin according with maxWidth var
          var slideMaxW = el.vars.maxWidth;
          var slideW = el.vars.width;
          var slideH = el.vars.height;
          el.css({width : el.windowW});

          if(slideMaxW > slideW){// Verify if only adjust margin left, if yes
            if(el.windowW > slideMaxW){//if window width is bigger than slider,  apply scale and adjust top
              var left = (el.windowW - slideMaxW)/2;
              el.css({height : el.vars.height*el.scaleMaxW});//adjust slider main div height
              el.find(".layer-wrapper").each(function(){
                methods.transform($(this), "scale("+el.scaleMaxW+")");
                $(this).css("left",0);
              });
            }
            else {
                      
              if(el.windowW > slideW){
                el.css({height : el.vars.height});
                var left = (el.windowW - slideMaxW)/2;
                var scale = 1;
                el.find(".layer-wrapper").each(function(){
                  methods.transform($(this), "scale("+scale+") translate("+left+"px, 0px)");
                  $(this).css("left",0);
                });
              }
              else{
                el.css({height : el.vars.height*el.scale});//adjust slider main div height
                var left = (el.windowW - slideMaxW*el.scale)/2;
                el.find(".layer-wrapper").each(function(){
                  methods.transform($(this), "scale("+el.scale+")");
                  $(this).css("left",left);
                });
              }
            } 
          }
          else{
            el.css({height : el.vars.height * el.scale});
            el.find(".layer-wrapper").each(function(){
              methods.transform($(this), "scale("+el.scaleMaxW+")");
            });
          }

          el.find("[will]").css('background',"red");
        },

        coverImages : function(){//find images with [willslide='full'] attr and makes them cover all slide area
          el.find("img[willslidelayer='full']").each(function(){
            $(this).css({//equals the img width to slider max width
              width : el.vars.maxWidth,
              height : "auto",
              position : "absolute"
            });

            var scale = ($(this).height() / el.vars.height);//verify if image height is bigger than slider height
            console.log(scale);
           
            if(scale < 1){//must enlarge the image width  proportionally to height until fill the slide, after adjust left
              var rel = 1/scale;
              var left = ($(this).width() * rel-$(this).width())/2;
              var leftPercent = left / $(this).width();
              $(this).css({
                width : (rel*100)+"%",
                left: -(leftPercent*100)+"%"
              });
            }
            else{//must set the width 100%, proportionally the height will grow, after, adjust the top, because image height is bigger 
              var rel = scale;
              var top = ($(this).height() * rel-$(this).height())/2;
              var topPercent = top / $(this).height();
              $(this).css({
                width : "100%",
                top: -(topPercent*100)+"%"
              });
            }
            
          });
        },

        hide : function() {//Hide all content of the slider
          el.hide();
        },

      };

    // public methods
    el.next = function(){
      methods.autoSlide();//just call autoSLide, because that function do the same thing
    };

    el.prev = function(){
      var order = el.find(".current").data("slideOrder");
      if(order == 1){
        nextSlide=(el.totalSlides);//set the last slide
        methods.slideTo(nextSlide);
      }
      else{
        nextSlide=order-1;//set the previous slide
        methods.slideTo(nextSlide);
      }     
    };

    el.stopSlider = function(){//stop and play the slider
      if(el.isStopped){
        el.isStopped=false;
        el.removeClass("stopped");
      }
      else{
        el.isStopped=true;
        el.addClass("stopped");
      } 
    },

    //willslide: Initialize
    methods.init();
  };

  // Verify if the slider window is active, this is to not run the slider when the user are in another window
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.willslide.defaults = {
    width: 1500,                    //Slider width, scalex
    height: 500,                    //Slider height, scaley
    maxWidth:0,                     //Must be bigger than width to do effect, it's like a slide margin to grows the width without change the height together
    time:8000,                      //Time that each slide will show itself
    showTimeBar:true,              //Show the timebar on slider
    refreshStep:20,                 //Time in milliseconds to refresh timebar
    controls:true,                  //create stop and play buttons
    nav:true,                       //create prev and next buttons
    thumbs:true,                    //create slider thumbs

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function(){}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //WillSlide: Plugin Function
  $.fn.willslide = function(options) {//jquery function
    
    if (options === undefined) { options = {}; }

    if (typeof options === "object") {//if is an object call the function to initialize the slider
      
      new $.willslide(this, options);
      
    } else {//else, verify if is calling some of the slider global functions
      var $slider = $(this).data('willslide');
      switch (options) {
        case "play":
        case "stop": $slider.stopSlider(); break;
        case "next": $slider.next(); break;
        case "prev":
        case "previous": $slider.prev(); break;
        default: console.log("This callback doesn't exist");
      }
    }
  };

})(jQuery);