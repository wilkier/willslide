(function ($) {

  var focused = true;

  //Willslide: Object Instance
  $.willslide = function(element, options) {
    var el = $(element);

    // making variables public
    el.vars = $.extend({}, $.willslide.defaults, options);
    if(el.vars.maxWidth<el.vars.width){
      el.vars.maxWidth=el.vars.Width;
    }
    
    // Store a reference to the slider object
    el.data("willslide",el);
    
    // Private slider methods
    var methods = {
        init : function() {
          el.addClass("willslide");
          el.vars.init();//Calls "init" callback function
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

        callBackTimer:function(func,time,repeat,playBefore){//function to call n times other function with delay, sometimes resize is not precise
          var counter=0;
          if(repeat==null || repeat==0){
            repeat=1;
          }
          if(playBefore){//run function one time before call it again
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
                el.vars.start();//Calls "start" callback function
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
              
              exitingSlide.animate({opacity:0},100);
              el.currentTime=0;
              setTimeout(function(){
                exitingSlide.removeClass("goodbye");
                exitingSlide.css({opacity:1});
                el.isAnimating=false;
                if(el.isStopped){//if slide was stopped, puts slider to play again
                  el.stopSlider();  
                }
                methods.animate();//call slide animations
              }, 200);
            }
            else{
              console.log("Can't slide to the current slide");
            }
          }
          else{
            console.log("Wait the slide animation please");
          }
        },

        slideTimer: function(){//slider loop
          if(el.vars.showTimeBar){
            setInterval(function(){
              if(!el.isStopped && focused && !el.isAnimating){
                el.currentTime+=el.vars.refreshStep;
                if(el.currentTime>el.vars.time){
                  el.currentTime=0;
                  methods.autoSlide();
                }
                var percentLoad=el.currentTime/el.vars.time*100;
                el.find(".willslide-loading").css('width',percentLoad+"%");
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

        autoSlide : function(){//function to slide runs automatically
          var order = el.find(".current").data("slideOrder");
          if(order == el.totalSlides){
            nextSlide=1;
            methods.slideTo(nextSlide);
          }
          else{
            nextSlide=(order+1);
            methods.slideTo(nextSlide);
          }
        },

        countSlides : function(){//Return de number os divs ".slide" inside the slider and put an indentifier class on each ".slide"
          var slides = el.find(".slide").length;
          return slides;
        },

        build : function(){//Constructs the necessary structure to slider
          var slides = el.find(".slide").each(function(e){
            
            if(el.vars.thumbs){//verify if is to create thumbs and creates a bullet for each slide and makes the current slide bullet
              methods.createBullets();// creates thumb container
              el.find(".bullet-container").append("<div class='bullet bullet"+(e+1)+"'></div>");//Creates a bullet with an unique class, bullet1, bullet2, bullet3...
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

          el.find(".slide").each(function(){
            $(this).children("div").each(function(){
              $(this).wrap("<div class='layer-wrapper'><div class='layer'></div></div>");
              $(this).parent(".layer").css({width:el.vars.maxWidth, height:el.vars.height});
              methods.transformOrigin($(this).parent(".layer").parent(".layer-wrapper"),"left top");//adjust transform origin to animations
            });
          });

          el.find("[willslidelayer]").each(function(){
            $(this).wrap("<div class='layer-wrapper'><div class='layer'></div></div>");
            $(this).parent(".layer").css({width:el.vars.maxWidth, height:el.vars.height});
            methods.transformOrigin($(this).parent(".layer").parent(".layer-wrapper"),"left top");//adjust transform origin to animations
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

          //add click function stop and play button
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
          //add click function to nav
          el.find(".nav-next").click(function(){
            el.next();
          });
          el.find(".nav-prev").click(function(){
            el.prev();
          });
        },

        createBullets:function(){//just create bullets container
          if(!el.find(".bullet-container").length){ //Verify if exist an element with the class 'bullet-container', if isn't, creates one.
            el.append("<div class='bullet-container'></div>");
          }
        },

        scale: function(){//returns scale value for window width and slider width
          var scale = el.windowW/el.vars.width;
          return scale;
        },

        scaleMaxW: function(){//returns scale value for window width and slider max width
          var scale = el.windowW/el.vars.maxWidth;
          return scale;
        },

        getAnimateVars: function(){// gets the string defined in element and apply in vars, like an object
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
                dleftreverse=1;
                dtopreverse=1;

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
            
            if(dtop<0){//if is negative set a data value to revert animation
              dtop*=-1;
              dtopreverse=-1;
            }
            
            if(dleft<0){//if is negative set a data value to revert animation
              dleft*=-1;
              dleftreverse=-1;
            }

            //store values in data, they will be used in animate function
            animatedElement.parent(".layer").data({"dtop":dtop, "dleft":dleft, "dleftreverse":dleftreverse, "dtopreverse":dtopreverse, "time":time, "delay":delay, "ease":ease}).addClass("animated-layer to-load");
          });
        },

        animate:function(){
          el.vars.before();//Calls "before" callback function
          el.find(".animated-layer.to-load").each(function(){//find all slides that need to be reloaded to animation
            var animatedElement=$(this);
            
            var dleft = animatedElement.data("dleft")*animatedElement.data("dleftreverse");
            var dtop = animatedElement.data("dtop")*animatedElement.data("dtopreverse");

            var transform = "translate("+dleft+"%, "+dtop+"%)";
            animatedElement.stop().css({
              "font-size": animatedElement.data("dleft")+"px",//font-size is used just like a fake atribute to animate, fake css tributes like "dleft" may be not interpreted by browser, and animate not works
              "line-height": animatedElement.data("dtop")+"px",//line-height is used just like a fake atribute to animate, fake css tributes like "dleft" may be not interpreted by browser, and animate not works
            });
            methods.transform(animatedElement,transform);
            animatedElement.removeClass("to-load");//after set the initial values, remove the class "to-load" to not set than again   
          });

          var current = el.find(".current");//find current slide to animate him
          current.find(".animated-layer").each(function(){
            var animatedElement=$(this);
            var time = parseInt(animatedElement.data("time"));//get time data value
            var offX=0;//create var offX to be read inside all jquery animate steps

            setTimeout(function(){//set delayed call
              if(current.hasClass("current")){//verify again if still has class current
                animatedElement.animate({
                  "font-size": 0,//font-size is used just like a fake atribute to animate, fake css tributes like "dleft" may be not interpreted by browser, and animate not works
                  "line-height": 0,//line-height is used just like a fake atribute to animate, fake css tributes like "dleft" may be not interpreted by browser, and animate not works
                }, 
                {
                  easing : animatedElement.data("ease"),//set ease data value
                  duration : time,
                  complete : function(){el.vars.after()},//Calls "after" callback function
                  step: function(now,fx) {//jquery animate is not good to transform, we used steps with fake atributes, in this case font-size and line-height
                    if (fx.prop === "fontSize") {//is the fontSize call back, so store the value in a var
                      offX = now*animatedElement.data("dleftreverse");
                    } 
                    else if (fx.prop === "lineHeight") {//is the lineHeight call back, do the transforms with offx and current "now" value
                      var offY = now*animatedElement.data("dtopreverse");
                      var transform = "translate("+offX+"%,"+offY+"%)";
                      methods.transform($(this),transform); 
                    }
                  },
                })
              }
            }, animatedElement.data("delay"));//set delay to call animation

            animatedElement.addClass("to-load");//set class "to-load" for the next animation reloads the slide
          });
        },

        transform : function(elem, transform){//simply sets all css transform with vendors prefixes
          elem.css({
            "-ms-transform": transform,
            "-webkit-transform": transform,
            "-moz-transform": transform,
            "transform": transform,
          });
        },

        transformOrigin : function(elem, value){//simply sets all css transform-origin with vendors prefixes
          elem.css({
            "-ms-transform-origin": value,
            "-webkit-transform-origin": value,
            "-moz-transform-origin": value,
            "transform-origin": value,
          });
        },

        resize : function(){//when window is resized, calculates if should scale each layer adjusting his left margin according with maxWidth var
          var slideMaxW = el.vars.maxWidth;
          var slideW = el.vars.width;
          var slideH = el.vars.height;
          el.css({width : el.windowW});//makes slider cover window size

          if(slideMaxW > slideW){//Verifies if slider has margins to adjust
            if(el.windowW > slideMaxW){//if window width is bigger than slider,  apply scale and adjust top
              var left = (el.windowW - slideMaxW)/2;
              el.css({height : el.vars.height*el.scaleMaxW});//adjust slider main div height
              el.find(".layer-wrapper").each(function(){
                methods.transform($(this), "scale("+el.scaleMaxW+")");
                $(this).css("left",0);
              });
            }
            else {
                      
              if(el.windowW > slideW){//window width is greater than sliderW and smaller than sliderMaxW, only scale to original values and adjust left margin
                el.css({height : el.vars.height});//set the original height
                var left = (el.windowW - slideMaxW)/2;
                var scale = 1;
                el.find(".layer-wrapper").each(function(){
                  methods.transform($(this), "scale("+scale+") translate("+left+"px, 0px)");
                  $(this).css("left",0);
                });
              }
              else{//window is smaller, slider must scale to be smaller to and adjust left margin
                el.css({height : el.vars.height*el.scale});//adjust slider main div height
                var left = (el.windowW - slideMaxW*el.scale)/2;
                el.find(".layer-wrapper").each(function(){
                  methods.transform($(this), "scale("+el.scale+")");
                  $(this).css("left",left);
                });
              }
            } 
          }
          else{//if hasn't margins to adjust, just scale
            el.css({height : el.vars.height * el.scale});
            el.find(".layer-wrapper").each(function(){
              methods.transform($(this), "scale("+el.scaleMaxW+")");
            });
          }
        },

        coverImages : function(){//find images with [willslide='full'] attr and makes them cover all slide area
          el.find("img[willslidelayer='full']").each(function(){
            $(this).css({//equals the img width to slider max width
              width : el.vars.maxWidth,
              height : "auto",
              position : "absolute"
            });

            var scale = ($(this).height() / el.vars.height);//verify if image height is bigger than slider height
           
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

        hide : function() {//Hide all content of the slider, created just to be able to use other ways to hide
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
        el.vars.callplay();//Calls "callplay" callback function
        el.isStopped=false;//Change var to play slideTimer funtion
        el.removeClass("stopped");//Just to set css to hide play button
      }
      else{
        el.vars.callstop();//Calls "callstop" callback function
        el.isStopped=true;//Change var to stop slideTimer funtion
        el.addClass("stopped");//Just to set css to hide play button
      } 
    },

    //willslide: Initialize
    methods.init();
  };

  // Verify if the slider window is active, this is to not run the slider when the user are in another window
  $( window ).blur( function ( e ) {
    focused = false;//Used in slideTimer funtion
  }).focus( function ( e ) {
    focused = true;//Used in slideTimer funtion
  });

  //Willslide: Default Settings
  $.willslide.defaults = {
    width: 1500,                    //Slider width, scalex
    height: 500,                    //Slider height, scaley
    maxWidth:0,                     //Must be bigger than width to do effect, it's like a slide margin to grows the width without change the height together
    time:8000,                      //Time that each slide will show itself
    showTimeBar:true,               //Show the timebar on slider
    refreshStep:20,                 //Time in milliseconds to refresh timebar
    controls:true,                  //create stop and play buttons
    nav:true,                       //create prev and next buttons
    thumbs:true,                    //create slider thumbs

    // Callback API
    start: function(){},            //Callback: Calls when the slider loads all images
    before: function(){},           //Callback: Calls before slider animation
    after: function(){},            //Callback: Calls before slider animation
    callstop: function(){},         //Callback: Calls when slider stops
    callplay: function(){},         //Callback: Calls when slider plays
    init: function(){},             //Callback: Calls when slider begin the setup
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