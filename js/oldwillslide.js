// FunÃ§Ã£o construtora
function Willslide(el, options){
   var elem = el;
   var that = this;
   this.options = $.extend({
    largura:1900,
    altura:500,
    minLargura:1000
   }, options);
   this.running=false;
   this.totalPages=0;
   this.slidesOrder=[""];
   this.timer=0;
   this.slideStop=false;
   this.prevSlideStop=false;
   this.name=el;
   this.janelaLargura=$(window).width();
   this.janelaAltura=$(window).height();

   $(window).on("resize", function() {
    that.janelaLargura=$(window).width();
    that.janelaAltura=$(window).height();
    that.sliderStart(that);
    that.responsiveslide(that);
  });

  $(document).ready(function(){
    that.imageWasLoaded(that);
    TweenMax.set(that.name, {"height":that.options.altura});
    $(elem).children(".slidenext").click(function(){
      that.next(that);
    });
    $(elem).children(".slideprev").click(function(){
      that.prev(that);
    });
    $(elem+" .sliderStop .will-play").click(function(){
      that.stopSlider(that);
    });
    $(elem+" .sliderStop .will-stop").click(function(){
      that.stopSlider(that);
    });
  });

  $(window).on("blur focus", function(e) {
    var prevType = $(this).data("prevType");
    if (prevType != e.type) {
      switch (e.type) {
        case "blur":
          that.prevSlideStop=that.slideStop;
          that.slideStop=true;
          break;
        case "focus":
           if(that.prevSlideStop){
             that.slideStop=true;
          }
          else{
            that.slideStop=false;
          } 
          break;
      }
    }
    $(this).data("prevType", e.type);
  })  
}

Willslide.prototype = {
   responsiveslide: function(that){
    $(that.name +" .slide .crop").each(function() {
      TweenMax.set(this, {"margin-left": (($(this).width()-that.janelaLargura)/2)*-1});
      if(that.janelaLargura<that.options.minLargura){
        var porcentagem=(that.janelaLargura)/that.options.minLargura;
        TweenMax.set(this, {"width":that.options.largura*porcentagem});
        TweenMax.set(this, {"height":that.options.altura*porcentagem});
        TweenMax.set(that.name, {"height":that.options.altura*porcentagem});
      }
      else if(that.janelaLargura>that.options.largura){
        var porcentagem=(that.janelaLargura)/that.options.largura;
        TweenMax.set(this, {"width":that.options.largura*porcentagem});
        TweenMax.set(this, {"height":that.options.altura*porcentagem});
        TweenMax.set(that.name, {"height":that.options.altura*porcentagem});
      }
      else{
        TweenMax.set(this, {"width":that.options.largura});
        TweenMax.set(this, {"height":that.options.altura});
        TweenMax.set(that.name, {"height":that.options.altura});
      } 
    });
  },

  sliderStart: function(that){
    that.responsiveslide(that);
    $(that.name+" .layertext span").each(function() { 
      var largurapers=($(this).parent('.layertext').parent('.layer').height())/that.options.altura;
      TweenMax.set(this, {"font-size":$(this).attr("tfont")*largurapers+"px", "line-height":$(this).attr("tfont")*largurapers+"px"});  
    });
    $(that.name+" .layertext a").each(function() {  
      var largurapers=($(this).parent('.layertext').parent('.layer').height())/that.options.altura;
      TweenMax.set(this, {"font-size":$(this).attr("tfont")*largurapers+"px", "line-height":$(this).attr("tfont")*largurapers+"px"});
    }); 
  },

  animaslide: function(that){
    $(that.name+" .layer.animate").each(function() {
      var thisElem = this;
      if($(thisElem).attr('inicial')!=null){
        var str = $(thisElem).attr('inicial');
        var res = str.split("/"); 
        var dtop=res[0]+"%";
        var dleft=res[1]+"%";
        var dtime=res[2];
        var ddelay=res[3];
        var dease=res[4];
      }
      else{
        var dtop=100;
        var dleft=0;
        var dtime=0;
      }
      if($(thisElem).parent("div").parent(".slide").hasClass("currentslide")){
        TweenMax.fromTo($(thisElem), dtime, {top:dtop, left:dleft, ease:dease }, {top:"0%", left:"0%", ease:dease, delay:ddelay} );   
      }
      else{
        TweenMax.fromTo($(thisElem), 0, {top:"0%", ease:Elastic.easeOut}, {top:"100%", ease:Linear.easeNone, delay:0} );
      }   
    });
  },

  imageWasLoaded: function(that){
    function imageLoaded(){
       counter--; 
       if( counter === 0 ) {
         that.sliderStart(that);  
         that.sliderScriptReload(that);
         TweenMax.set(that.name, {"opacity":1});
       }
    }
    var images = $(that.name+' img');
    var counter = images.length; 
    images.each(function() {
      if(this.complete) {
        imageLoaded.call(this);
      } else {
        $(this).one('load', imageLoaded);
      }
    });
  },

  sliderScriptReload: function(that){
    var that = that;
    $(that.name+" .layer img").each(function() {
      var alturapers=(parseInt($(this).height()*100)/that.options.altura);
      var largurapers=(parseInt($(this).width()*100)/that.options.largura);
      var leftpers=(parseInt(parseInt($(this).css("left"))*100)/that.options.largura);
      var toppers=(parseInt(parseInt($(this).css("top"))*100)/that.options.altura);
      TweenMax.set(this, {"width":largurapers+"%", "height":alturapers+"%" , "left":leftpers+"%", "top":toppers+"%"});
      //console.log("width"+largurapers+"% "+ " height"+alturapers+"% " + " left"+leftpers+"%" + " top "+ toppers+"%" );
    });
    $(that.name+" .layertext").each(function() {
      var alturapers=(parseInt($(this).height()*100)/that.options.altura);
      var largurapers=(parseInt($(this).width()*100)/that.options.largura);
      var leftpers=(parseInt(parseInt($(this).css("left"))*100)/that.options.largura);
      var toppers=(parseInt(parseInt($(this).css("top"))*100)/that.options.altura);
      TweenMax.set(this, {"width":largurapers+"%", "height":alturapers+"%" , "left":leftpers+"%", "top":toppers+"%"});
    });
    $(that.name+" .layertext span").each(function() {
      var largurapers=($(this).parent('.layertext').parent('.layer').height())/that.options.altura;
      TweenMax.set(this, {"font-size":$(this).attr("tfont")*largurapers+"px", "line-height":$(this).attr("tfont")*largurapers+"px"});
    }); 
    that.running=false;
    that.slideTimer(that);
    that.totalPages=0;
    that.slidesOrder=[""];
    $(that.name).children(".slide").each(function() {
      $(this).addClass('slide'+(that.totalPages));
      var temp=that.totalPages;
      that.slidesOrder[temp] = that.name+' .slide'+that.totalPages;
      that.totalPages++;
    });
    $(that.slidesOrder[0]).addClass("currentslide");
    $(that.slidesOrder[1]).addClass("preslide");
    $(that.slidesOrder[that.totalPages-1]).addClass("outerslide");
    $(that.slidesOrder[that.totalPages-1]).css('width', 0);
    TweenMax.set(that.slidesOrder[that.totalPages-1], {'width': 0});
    that.responsiveslide(that);
    that.animaslide(that);
  },

  slideTimer: function(that){
    clearInterval(that.timer);
    that.timer = setInterval(function(){
      if(!that.slideStop){
        that.autoslide(that);
      }
    ;}, 8000);
  },

  next: function(that){
    if(!that.running){
      that.running=true;
      $(that.slidesOrder[0]).removeClass("currentslide");
      $(that.slidesOrder[0]).addClass("outerslide");
      $(that.slidesOrder[1]).removeClass("preslide");
      $(that.slidesOrder[1]).addClass("currentslide");
      $(that.slidesOrder[that.totalPages-1]).removeClass("outerslide");
      TweenMax.set(that.slidesOrder[that.totalPages-1], {'width': "100%"});
      $(that.slidesOrder[2]).addClass("preslide");
      TweenLite.to($(that.slidesOrder[0]), 0.2, {width:0});
      TweenLite.delayedCall(0.2, that.afterslidenext, [that]);
    }
    that.slideTimer(that);
    that.responsiveslide(that);
  },

  autoslide: function(that){
    if(!that.running){
      that.running=true;
      $(that.slidesOrder[0]).removeClass("currentslide");
      $(that.slidesOrder[0]).addClass("outerslide");
      $(that.slidesOrder[1]).removeClass("preslide");
      $(that.slidesOrder[1]).addClass("currentslide");
      $(that.slidesOrder[that.totalPages-1]).removeClass("outerslide");
      TweenMax.set(that.slidesOrder[that.totalPages-1], {'width': "100%"});
      $(that.slidesOrder[2]).addClass("preslide");
      TweenLite.to($(that.slidesOrder[0]), 0.2, {width:0});
      TweenLite.delayedCall(0.2, that.afterslidenext, [that]);
    }
    that.responsiveslide(that);
  },

  afterslidenext: function(that){   
    var tempslide=that.slidesOrder[0];
    for(i=0; i<that.totalPages-1; i++){
      that.slidesOrder[i]=that.slidesOrder[i+1];  
    }
    that.slidesOrder[that.totalPages-1]=tempslide;
    that.running=false;
    that.animaslide(that);
  },

  prev: function(that){
    if(!that.running){
      that.running=true;
      TweenLite.to($(that.slidesOrder[that.totalPages-1]), 0.2, {width:"100%"});
      TweenLite.delayedCall(0.2, that.afterslideprev, [that]);
    }
    that.slideTimer(that)
    that.responsiveslide(that);
  },

  afterslideprev: function(that){
    $(that.slidesOrder[0]).removeClass("currentslide");
    $(that.slidesOrder[0]).addClass("preslide");
    $(that.slidesOrder[that.totalPages-1]).removeClass("outerslide");
    $(that.slidesOrder[that.totalPages-1]).addClass("currentslide");
    $(that.slidesOrder[1]).removeClass("preslide");
    $(that.slidesOrder[that.totalPages-2]).addClass("outerslide");
    TweenMax.set(that.slidesOrder[that.totalPages-2], {'width': 0});
    var tempslide=that.slidesOrder[that.totalPages-1];
    for(i=that.totalPages-1; i>0; i--){
      that.slidesOrder[i]=that.slidesOrder[i-1];  
    }
    that.slidesOrder[0]=tempslide;
    that.running=false;
    that.animaslide(that);
  },

  stopSlider: function(that){
    if(!that.slideStop){
      that.slideStop=true;
      TweenMax.set(that.name+" .will-stop", {"display":"none"});
      TweenMax.set(that.name+" .will-play", {"display":"block"});
    }
    else{
      that.slideStop=false;
      TweenMax.set(that.name+" .will-play", {"display":"none"});
      TweenMax.set(that.name+" .will-stop", {"display":"block"});      
    }
  }
}

