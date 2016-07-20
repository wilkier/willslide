##Willslide by Wilkier, simple responsive layer html slider ;]

See the demo working on my site:
http://wilkier.com/willslide/

#How to use

##Base linkage

You need to set jQuery, jQueryUI, jquery.willslide.js and willslide.css.

```html
<link href="css/willslide.css" rel="stylesheet" />

<script src="js/jquery-1.12.4.min.js"></script>

<script src="js/jquery-ui.min.js"></script>

<script src="js/jquery.willslide.min.js"></script>
```


##The base HTML
```html
<div id="slider">

  <div class="slide">
    *content slide1
  </div>
  
  <div class="slide">
    *content slide2
  </div>

</div>
```

##Willslide call function
```javascript
$("#slider").willslide();
```

##Willslide settings

|**Setting**:   |Default value  | Description      |
| ------------- |:-------------:| -----:|
|**width**         |1500           |Slider width, scalex, value in pixels|
|**height**        | 500                     |Slider height, scaley, value in pixels|
|**maxWidth**| 0                |Must be bigger than width to do effect, it's like a slide margin to grows the width without change the height together, value in pixels|
|**time**| 8000                     |Time that each slide will show itself, value in milliseconds|
|**showTimeBar**| true      |Show the timebar on slider|
|**refreshStep**| 20            |Time in milliseconds to refresh timebar, value in milliseconds|
|**controls**| true                |Creates stop and play buttons|
|**nav**| true                       |Creates prev and next buttons|
|**bullets**| true                  |Creates slider bullets|


**Example:**
```javascript
$("#slider").willslide({
	width:800,
	height:400,
	maxWidth:1200,
});
```

When window is equals or lower 800px, willslider will maintain proportion 800x400 or 2x1, but if window is bigger than 800px, willslider will grows only width until reach 1200px, after this it will scale equals to proportion 1200x400 or 3x1.

So when you are positioning elements inside slider use to reference maxWidth and height value, and width value centralized only if you want garantes element ever visible.


##Willslide Callbacks
|**Setting**       | Callback      |
| ------------- |:-------------:|
|**start**            | Calls when the slider loads all images|
|**before**         | Calls before slider animation|
|**after**            | Calls after slider animation|
|**callstop**       | Calls when slider stops|
|**callplay**       | Calls when slider plays|
|**init**              | Calls when slider begin the setup|

**Example**
```javascript
$("#slider").willslide({
	width:800,
	height:400,
	maxWidth:1200,
	start:function(){console.log(‘hi, I was started’)},
});
```

When slider load all images and start, it will return the log “hi, I was started”.


##Making images and divs responsible with slider
```html
<div id="slider">
  <div class="slide">
  	<img animate src=”…”>
  	<div animate class=”your-class”></div>
  </div>
</div>
```

You need to set attribute “animate” on div or image, if you don’t, the element don’t will resize with slider, and you will need to set z-index in the class to make element visible.

##Wrong way to set animate attribute
Only set animate attribute on elemets exactly after “slide” div.

**Right**
```html
<div id="slider">
  <div class="slide">
  	<img animate src=”…”>
    <div animate class=”your-class”></div>
    <img animate src=”…”>
    <img animate src=”…”>
  </div>
</div>
```

**Wrong**
```html
<div id="slider">
  <div class="slide">
  	<div class=”your-class”>
    	<img animate src=”…”>
    </div>
  </div>
</div>
```



##Making images cover slider
To make images fill all slider area you need to set “full” atrubute on element.
```html
<div id="slider">
  <div class="slide">
  	<img full animate src=”…”>
  </div>
</div>
```

##Willslide animations

###dtop

|**Setting**|Default Value|Description|
| ------------- |:-------------:| -----:|
|**dtop** |0|Distance top, represents a percentage, accept negative values.|

**Example**, if I want img appear by slide bottom area:
```html
<img animate="dtop:100" src="…">
```

If i want img appear by slide top area:
```html
<img animate="dtop:-100" src="…">
```

--

###dleft
|**Setting**|Default Value|Description|
| ------------- |:-------------:| -----:|
|**dleft** |0|Distance left, represents a percentage, accept negative values.|

**Example**, if I want img appear by slide right area:
```html
<img animate="dleft:100" src="…">
```

If i want img appear by slide left area:
```html
<img animate="dleft:-100" src="…">
```

--

###time
|**Setting**|Default Value|Description|
| ------------- |:-------------:| -----:|
|**time** |500|Animation time in milliseconds.|

**Example**, 1 second animation:
```html
<img animate="time:1000" src="…">
```

--

###delay
|**Setting**|Default Value|Description|
| ------------- |:-------------:| -----:|
|**delay** |0|Delay to begin animation in milliseconds.|

**Example**, 500 milliseconds delay:
```html
<img animate="delay:500" src="…">
```

--

###ease
|**Setting**|Default Value|Description|
| ------------- |:-------------:| -----:|
|**ease** |linear|easing effect to animation, accepts all jQueryUI eases.|

**Example** easeOutElastic:
```html
<img animate="ease:easeOutElastic" src="…">
```

--

###All eases:
1. linear
2. swing
3. easeInQuad
4. easeOutQuad
5. easeInOutQuad
6. easeInCubic
7. easeOutCubic
8. easeInOutCubic
9. easeInQuart
10. easeOutQuart
11. easeInOutQuart
12. easeInQuint
13. easeOutQuint
14. easeInOutQuint
15. easeInExpo
16. easeOutExpo
17. easeInOutExpo
18. easeInSine
19. easeOutSine
20. easeInOutSine
21. easeInCirc
22. easeOutCirc
23. easeInOutCirc
24. easeInElastic
25. easeOutElastic
26. easeInOutElastic
27. easeInBack
28. easeOutBack
29. easeInOutBack
30. easeInBounce
31. easeOutBounce
32. easeInOutBounce

**See them here:**
https://api.jqueryui.com/resources/easing-graph.html


**Final animation example:**
```html
<img animate="dtop:100, dleft:20, time:2800, delay:200, ease:easeOutElastic" src="…">
```

##That’s all folks!

