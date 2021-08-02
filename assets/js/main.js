/*!
 * main.js
 * JS main file
 * charset utf-8
 * @author  Nonprofit organization "National Trails"
 * @version 2018-08-23
 * @url https://nationaltrails.ru/user/themes/sky/js/main.js
 */

// Detect current language
var lang = document.documentElement.lang || 'en';

/*! youtube lazi load */
function youtube () {
	var videos = document.querySelectorAll('.youtube');

    var nb_videos = videos.length;
    for (var i = 0; i < nb_videos; i++) {
        var src = '/user/data/videos/thumbs/' + videos[i].id + '.jpg';
		var img = document.createElement('img');
		img.setAttribute('src', src);
		img.setAttribute('alt', '');
		videos[i].appendChild(img);

        // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
        var play = document.createElement('div');
        play.setAttribute('class','play');
        videos[i].appendChild(play);

        videos[i].onclick = function() {
            // создаем iframe со включенной опцией autoplay
            var iframe = document.createElement("iframe");
            var iframe_url = "https://www.youtube-nocookie.com/embed/" + this.id + "?autoplay=1&rel=0";
            if (this.hasAttribute("data-params")) iframe_url+='&'+this.getAttribute("data-params");
            iframe.setAttribute("src",iframe_url);
            iframe.setAttribute("allowfullscreen",'true');

            iframe.style.width  = this.offsetWidth + 'px';
            iframe.style.height = this.offsetHeight + 'px';

            // Заменяем миниатюру плеером с YouTube
            this.parentNode.replaceChild(iframe, this);
        }
    }
}
/*! youtube lazy load end */


/*!
 * baguetteBox.js
 * @author  feimosi
 * @version 1.5.0
 * @url https://github.com/feimosi/baguetteBox.js
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.baguetteBox = factory();
    }
}(this, function () {			
    // Global options and their defaults
    var options = {}, defaults = {
        captions: true,
        fullScreen: false,
        // noScrollbars: false,
        titleTag: false,
        buttons: 'auto',
        async: false,
        preload: 2,
        animation: 'slideIn',
        afterShow: null,
        afterHide: null,
        // callback when image changes with `currentIndex` and `imagesElements.length` as parameters
        onChange: null,
        overlayBackgroundColor: 'rgba(0, 0, 0, .8)',
    };
    // Object containing information about features compatibility
    var supports = {};
    // DOM Elements references
    var overlay, slider, previousButton, nextButton, closeButton, descrButton;
    // Current image index inside the slider and displayed images index
    var currentIndex = 0;
    // Touch event start position (for slide gesture)
    var touchStartX;
	var touchStartY;
    // If set to true ignore touch events because animation was already fired
    var touchFlag = false;
    // Regex pattern to match image files
    var regex = /.+\.(gif|jpe?g|png|webp)/i;
    // Array of all used galleries (Array od NodeList elements)
	var images = [];
    // Array of images inside
    var imagesMap = [];
    // Array containing temporary images DOM elements
    var imagesElements = [];
   
   // Event handlers
    var imagedEventHandlers = {};
    var overlayClickHandler = function(event) {
        // When clicked on the overlay (outside displayed image) close it
        if(event.target && event.target.nodeName !== 'IMG' && event.target.nodeName !== 'FIGCAPTION' && event.target.nodeName !== 'P')
            hideOverlay();
    };
    var previousButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation();
        showPreviousImage();
    };
    var nextButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation();
        showNextImage();
    };
    var closeButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation();
        hideOverlay();
    };
	var descrButtonClickHandler = function(event) {
        event.stopPropagation();
        showDescription();
    };
    var touchstartHandler = function(event) {
		// Save x and y axis position
        touchStartX = event.changedTouches[0].pageX;
        touchStartY = event.changedTouches[0].pageY;
    };
    var touchmoveHandler = function(event) {
        // If action was already triggered return
        if(touchFlag)
            return;
        /*jshint -W030 */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        touch = event.touches[0] || event.changedTouches[0];
        // Move at least 40 pixels to trigger the action
        if(touch.pageX - touchStartX > 40) {
            touchFlag = true;
            showPreviousImage();
        } else if (touch.pageX - touchStartX < -40) {
            touchFlag = true;
            showNextImage();
        // Move 100 pixels up to close the overlay
        } else if (touchStartY - touch.pageY > 100) {
            hideOverlay();
        }
    };
    var touchendHandler = function(event) {
        touchFlag = false;
    };

    // Script entry point
    function run(selector, userOptions) {
		// Fill supports object
		supports.transforms = testTransformsSupport();

		buildOverlay();
		bindImageClickListeners(selector, userOptions);
    }

    function bindImageClickListeners(selector, userOptions) {
        // For each images bind a click event to every image inside it
        images = document.querySelectorAll(selector);

        [].forEach.call(images, function(galleryElement) {
            var tags = galleryElement;
            imagesMap.push(tags);
		});
		 
		[].forEach.call(imagesMap, function(imageElement, imageIndex) {
		
			//WHERE IT ALL STARTS
			var imageElementClickHandler = function(event) {
				/*jshint -W030 */
				event.preventDefault ? event.preventDefault() : event.returnValue = false;
				if (galleryMoving == false) {
					prepareOverlay();
					showOverlay(imageIndex);
				}
			};
			imagedEventHandlers[imageElement] = imageElementClickHandler;
			
			// !!!CLICK listener
			bind(imageElement, 'click', imageElementClickHandler);
			//bind(imageElement, 'touchstart', imageElementClickHandler);
			// !!!CLICK listener
		});
    }

    function unbindImageClickListeners() {
   		[].forEach.call(images, function(galleryElement) {
			[].forEach.call(imagesMap, function(imageElement, imageIndex) {
				unbind(imageElement, 'click', imagedEventHandlers[imageElement]);
			});
			imagesMap.pop();
		});
    }

    function buildOverlay() {
        overlay = getByID('baguetteBox-overlay');
        // Check if the overlay already exists
        if(overlay) {
            slider = getByID('baguetteBox-slider');
            previousButton = getByID('previous-button');
            nextButton = getByID('next-button');
            closeButton = getByID('close-button');
            descrButton = getByID('descr-button');
			bindEvents();
            return;
        }
    }

    function keyDownHandler(event) {
        switch(event.keyCode) {
            case 37: // Left arrow
                showPreviousImage();
                break;
            case 39: // Right arrow
                showNextImage();
                break;
            case 27: // Esc
                hideOverlay();
                break;
        }
    }

    function bindEvents() {
        bind(overlay, 'click', overlayClickHandler);
        bind(previousButton, 'click', previousButtonClickHandler);
        bind(nextButton, 'click', nextButtonClickHandler);
        bind(closeButton, 'click', closeButtonClickHandler);
        bind(descrButton, 'click', descrButtonClickHandler);
        bind(overlay, 'touchstart', touchstartHandler);
        bind(overlay, 'touchmove', touchmoveHandler);
        bind(overlay, 'touchend', touchendHandler);
    }

    function unbindEvents() {
        unbind(overlay, 'click', overlayClickHandler);
        unbind(previousButton, 'click', previousButtonClickHandler);
        unbind(nextButton, 'click', nextButtonClickHandler);
        unbind(closeButton, 'click', closeButtonClickHandler);
        unbind(descrButton, 'click', descrButtonClickHandler);
        unbind(overlay, 'touchstart', touchstartHandler);
        unbind(overlay, 'touchmove', touchmoveHandler);
        unbind(overlay, 'touchend', touchendHandler);
    }

    function prepareOverlay() {
        // Update images specific options
        setOptions(imagesMap.options);
        // Empty slider of previous contents (more effective than .innerHTML = "")
/* maybe to delete */ while(slider.firstChild) {
            slider.removeChild(slider.firstChild); }/* maybe to delete */
        imagesElements.length = 0;
        // Prepare and append images containers
        for(var i = 0, fullImage; i < imagesMap.length; i++) {
            fullImage = create('div');
            fullImage.className = 'full-image';
            fullImage.id = 'baguette-img-' + i;
            imagesElements.push(fullImage);
            slider.appendChild(imagesElements[i]);
        }
    }

    function setOptions(newOptions) {
        if(!newOptions)
            newOptions = {};
        // Fill options object
        for(var item in defaults) {
            options[item] = defaults[item];
            if(typeof newOptions[item] !== 'undefined')
                options[item] = newOptions[item];
        }
        /* Apply new options */
        // Change transition for proper animation
        slider.style.transition = slider.style.webkitTransition = (options.animation === 'fadeIn' ? 'opacity .4s ease' :
            options.animation === 'slideIn' ? '' : 'none');
        // Hide buttons if necessary
        if(options.buttons === 'auto' && ('ontouchstart' in window || imagesMap.length === 1))
            options.buttons = false;
        // Set buttons style to hide or display them
        previousButton.style.display = nextButton.style.display = (options.buttons ? '' : 'none');
		// Set overlay color
        overlay.style.backgroundColor = options.overlayBackgroundColor;
    }

    function showOverlay(chosenImageIndex) {
        if(overlay.style.display === 'block') {
            return;
		}
		bind(document, 'keydown', keyDownHandler);
        currentIndex = chosenImageIndex;
        loadImage(currentIndex, function() {
            preloadNext(currentIndex);
            preloadPrev(currentIndex);
        });		

        updateOffset();
        overlay.style.display = 'block';
		if(options.fullScreen)
            enterFullScreen();
        // Fade in overlay
        setTimeout(function() {
            overlay.className = 'visible';
			if(options.afterShow)
				options.afterShow();
         	/*kir*/document.documentElement.style.overflowY = 'hidden';
			/*kir*/document.body.style.overflowY = 'scroll';
        }, 50);
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
    }
	
    function enterFullScreen() {
        if(overlay.requestFullscreen)
            overlay.requestFullscreen();
        else if(overlay.webkitRequestFullscreen )
            overlay.webkitRequestFullscreen();
        else if(overlay.mozRequestFullScreen)
            overlay.mozRequestFullScreen();
    }

    function exitFullscreen() {
        if(document.exitFullscreen)
            document.exitFullscreen();
        else if(document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if(document.webkitExitFullscreen)
            document.webkitExitFullscreen();
    }

    function hideOverlay() {
        if(overlay.style.display === 'none') {
            return;
		}
		
        unbind(document, 'keydown', keyDownHandler);
        // Fade out and hide the overlay
        overlay.className = '';
        setTimeout(function() {
            overlay.style.display = 'none';
			exitFullscreen();
            /*kir*/document.documentElement.style.overflowY = 'auto';
			/*kir*/document.body.style.overflowY = 'auto';
			if(options.afterHide)
                options.afterHide();
        }, 500);
    }
	
	function showDescription () {
		document.querySelector('#baguetteBox-slider').classList.toggle('close');
	}
	
    function loadImage(index, callback) {
        var imageContainer = imagesElements[index];
		

        if(typeof imageContainer === 'undefined')
            return;

        // If image is already loaded run callback and return
        if(imageContainer.getElementsByTagName('img')[0]) {
			if(callback)
                callback();
            return;
        }
        // Get element reference, optional caption and source path
        imageElement = imagesMap[index];
		
		// Взять заголовок либо из data-title если он есть, либо из title, либо из alt
		// В title сохраняется заголовок + локация
		// В data-title сохраняется только заголовок, без локации
		var imageCaption = '';
		var imageTitle = '';
		if (imageElement.childNodes.length != 0 && imageElement.firstChild.nodeType == 1) {
			if (imageElement.firstChild.hasAttribute('alt')) {
				imageTitle = imageElement.firstChild.getAttribute('alt');
			}
		}
		else if (imageElement.hasAttribute('title')) {
			imageTitle = imageElement.getAttribute('title');
		}
		else if (imageElement.hasAttribute('data-title')) {
			imageTitle = imageElement.getAttribute('data-title');
		}

		if (imageTitle != '') {
			imageCaption += '<p class="title">' + imageTitle + '</p>';
		}

		if (imageElement.hasAttribute('data-location')) {
			imageCaption += '<p class="small location">' + imageElement.getAttribute('data-location') + '</p>';
		}

		//Add photo date/time
        imageSrc = getImageSrc(imageElement);
		if (imageSrc.search(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/) != -1) {		
			imageCaption += '<p class="small time">' + imageSrc.match(/\d{4}-\d{2}-\d{2}-\d{2}-\d{2}/)[0].replace(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/, "$1-$2-$3 $4:$5") + ' UTC</p>';	
		}
		//Add coordinates
		if (imageSrc.search(/N\d+-\d+E\d+-\d+/) != -1) {
			var Lat = parseFloat(imageSrc.match(/N\d+-\d+E\d+-\d+/)[0].replace(/N(\d+)-(\d+)E(\d+)-(\d+)/, "$1.$2"));
			var Long = parseFloat(imageSrc.match(/N\d+-\d+E\d+-\d+/)[0].replace(/N(\d+)-(\d+)E(\d+)-(\d+)/, "$3.$4"));
			var coordinates = Lat + ', ' + Long;
			
			imageCaption += '<p class="small coordinates"><a target="_blank" href="/map/?placemark=' + Lat + ',' + Long + '">' + Lat + ',&nbsp;' + Long + '</a></p>';
		}
		
        // Prepare image container elements
        var figure = create('figure');
        var image = create('img');
        var figcaption = create('figcaption');
        imageContainer.appendChild(figure);
		
		// Add loader element
        figure.innerHTML = '<div class="spinner"><div></div><div></div><div></div><div></div></div>';

		// Set callback function when image loads		
        image.onload = function() {
            // Remove loader element
            var spinner = document.querySelector('#baguette-img-' + index + ' .spinner');
			if (spinner) {
				figure.removeChild(spinner);
			}
			if(!options.async && callback)
                callback();
        };
        image.setAttribute('src', imageSrc);
		
        figure.appendChild(image);
        // Insert caption if available
        if(options.captions && imageCaption) {
            figcaption.innerHTML = imageCaption;
            figure.appendChild(figcaption);
        }
        // Run callback
        if(options.async && callback)
            callback();
    }

    // Get image source location, mostly used for responsive images
    function getImageSrc(image) {
        // Set default image path from href
        var result = imageElement.href;
        
		// Если есть отдлельно указанный путь к изображению
		// (когда используются разные Href для показа и открытия в новой вкладке)
		if (imageElement.hasAttribute("data-href")) {
			result = imageElement.getAttribute("data-href");
		}
      
		// If dataset is supported find the most suitable image
        if(image.dataset) {
            var srcs = [];
            // Get all possible image versions depending on the resolution
            for(var item in image.dataset) {
                if(item.substring(0, 3) === 'at-' && !isNaN(item.substring(3)))
                    srcs[item.replace('at-', '')] = image.dataset[item];
            }
            // Sort resolutions ascending
            keys = Object.keys(srcs).sort(function(a, b) {
                return parseInt(a) < parseInt(b) ? -1 : 1;
            });
            // Get real screen resolution
            var width = window.innerWidth * window.devicePixelRatio;
            // Find the first image bigger than or equal to the current width
            var i = 0;
            while(i < keys.length - 1 && keys[i] < width)
                i++;
            result = srcs[keys[i]] || result;
        }
        return result;
    }

    // Return false at the right end of the images
    function showNextImage() {
        var returnValue;
        // Check if next image exists
        if(currentIndex <= imagesElements.length - 2) {
            currentIndex++;
            updateOffset();
            preloadNext(currentIndex);
            returnValue = true;
        } else if(options.animation) {
            slider.classList.add('bounce-from-right');
            setTimeout(function() {
                slider.classList.remove('bounce-from-right');
            }, 400);
            returnValue = false;
        }
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
        return returnValue;
    }

    // Return false at the left end of the images
    function showPreviousImage() {
        var returnValue;
        // Check if previous image exists
        if(currentIndex >= 1) {
            currentIndex--;
            updateOffset();
            preloadPrev(currentIndex);
            returnValue = true;
        } else if(options.animation) {
            slider.classList.add('bounce-from-left');
            setTimeout(function() {
                slider.classList.remove('bounce-from-left');
            }, 400);
            returnValue = false;
        }
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
        return returnValue;
    }

    function updateOffset() {
        var offset = -currentIndex * 100 + '%';
        if(options.animation === 'fadeIn') {
            slider.style.opacity = 0;
            setTimeout(function() {
				/*jshint -W030 */
                supports.transforms ?
                    slider.style.transform = slider.style.webkitTransform = 'translate3d(' + offset + ',0,0)'
                    : slider.style.left = offset;
                slider.style.opacity = 1;
            }, 400);
        } else {
			/*jshint -W030 */
            supports.transforms ?
                slider.style.transform = slider.style.webkitTransform = 'translate3d(' + offset + ',0,0)'
                : slider.style.left = offset;
        }
    }

    // CSS 3D Transforms test
    function testTransformsSupport() {
        var div = create('div');
        return typeof div.style.perspective !== 'undefined' || typeof div.style.webkitPerspective !== 'undefined';
    }


    function preloadNext(index) {
        if(index - currentIndex >= options.preload)
            return;
        loadImage(index + 1, function() { preloadNext(index + 1); });
    }

    function preloadPrev(index) {
        if(currentIndex - index >= options.preload)
            return;
        loadImage(index - 1, function() { preloadPrev(index - 1); });
    }

    function bind(element, event, callback) {
        if(element.addEventListener)
            element.addEventListener(event, callback, false);
        else // IE8 fallback
            element.attachEvent('on' + event, callback);
    }

    function unbind(element, event, callback) {
        if(element.removeEventListener)
            element.removeEventListener(event, callback, false);
        else // IE8 fallback
            element.detachEvent('on' + event, callback);
    }

    function getByID(id) {
        return document.getElementById(id);
    }

    function create(element) {
        return document.createElement(element);
    }
	

    function destroyPlugin() {
        unbindEvents();
        unbindImageClickListeners();
        unbind(document, 'keydown', keyDownHandler);
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('baguetteBox-overlay'));
        currentIndex = 0;
        imagesMap.length = 0;
    }

    return {
        run: run,
        destroy: destroyPlugin,
        showNext: showNextImage,
        showPrevious: showPreviousImage
    };

}));

//Признак перемещения гелереи
galleryMoving = false;

/** end baguetteBox.js */
/** end baguetteBox.js */
/** end baguetteBox.js */
/** end baguetteBox.js */
/** end baguetteBox.js */


function subscribeSubmit () {
	var form = document.getElementById('subscribeform');
	
	form.addEventListener('submit', function (event) {
		document.getElementById('submit').disabled = true;
		
		event.preventDefault();
		
		function sendData() {
			var XHR = new XMLHttpRequest();
			var FD = new FormData(form);

			// Successful
			XHR.addEventListener("load", function(event) {
				console.log(event.target.responseText);
				alert(event.target.responseText);

				var inputs = form.querySelectorAll('input');
				for (var i = 0; i < inputs.length; i++) {
					inputs[i].setAttribute('disabled','');
				}
			});

			XHR.addEventListener("error", function(event) {
				alert('Oups! Something goes wrong.');
			});

			XHR.open("POST", "/a/interactive/subscribe.php");
			XHR.send(FD);
		}
	
		if (form.checkValidity() === true) {
			sendData();			
		}
	    
	});	
}	
	

function gallery () {
	
	/* Return pointer events */
	var pointerXY = function(e){
	  var out = {x:0, y:0};
	  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
		var touch = e.touches[0];
		out.x = touch.pageX;
		out.y = touch.pageY;
	  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
		out.x = e.pageX;
		out.y = e.pageY;
	  }
	  return out;
	};
	/* end pointer events */	
	
	var gallery = document.getElementById('gallery');
	var gChild = document.getElementById('gChild');		
	var images = document.querySelectorAll('.galleryPic');
	
/* ----- перетаскивание карусели мышкой -----*/			
	gallery.addEventListener('mousedown', mouseDown, false);
	gallery.addEventListener('touchstart', mouseDown, false);
	gallery.addEventListener('mouseup', mouseUp, false);
    gallery.addEventListener('mouseleave', mouseUp, false);
	gallery.addEventListener('touchend', mouseUp, false);
	
	var all_images_load = false;
	
	var lastMousePosition = 0;
	var startMousePosition = 0;
	
	function mouseDown (event) {			
		galleryMoving = false;//галерея пока ещё не перемещается
		
		gallery.classList.add('grabbing');
		
		var lastPos = parseInt(gChild.getAttribute('data-last-transformX'));
		lastMousePosition = lastPos ? lastPos : 0;		
		
		startMousePosition = parseInt(pointerXY(event).x);
		
		gallery.addEventListener('mousemove', mouseMove, false);
		gallery.addEventListener('touchmove', mouseMove, false);
		
		
		if (event.type == 'mousedown') {
			event.preventDefault();
			event.stopPropagation();
		}
		
		// Unlike in the `mousedown` event handler, we don't prevent defaults here,
		// because this would disable the dragging altogether. Instead, we prevent
		// it in the `touchmove` handler. Read more about touch events
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events#Handling_clicks
		if (event.type == 'touchstart') {
			event.stopPropagation();
		}
	}
	
	function mouseMove (event) {
		if (event.type == 'mousedown') {
			event.preventDefault();
		}
			
		var pageX = pointerXY(event).x;
		
		var eventType = event.type;
		if (eventType == 'mousemove') var drift = 2
		if (eventType == 'touchmove') var drift = 20;
		
		if (Math.abs(pageX - startMousePosition) > drift) {
			//а вот теперь галерея перемещается
			galleryMoving = true;
			var currentMousePosition = parseInt(pointerXY(event).x);
			
			var offset = currentMousePosition - startMousePosition;
			
			var newLeft = offset + lastMousePosition;
			var newRight = gChild.offsetWidth - gallery.offsetWidth + newLeft;
			
			var left = 0;
			var right = 'auto';
			var transform = newLeft;
			var dataTransform = newLeft;
			
			if (newLeft > 50) {
				left = '50px';
				right = 'auto';
				transform = 0;
				dataTransform = 0;
			}
			else if (newLeft > 0 && newLeft <= 50) {
				left = newLeft + 'px';
				right = 'auto';
				transform = 0;
				dataTransform = 0;
			}			
			
			if (newRight < -50) {
				var maxLeftTransform = 0 - (gChild.offsetWidth - gallery.offsetWidth);
				left = 'auto';
				right = '50px';
				transform = 0;
				dataTransform = maxLeftTransform;
			}	
			else if (newRight < 0 && newRight >= -50) {
				var maxLeftTransform = 0 - (gChild.offsetWidth - gallery.offsetWidth);
				left = 'auto';
				right = Math.abs(newRight) + 'px';
				transform = 0;
				dataTransform = maxLeftTransform;
			}
			
			gChild.style.left = left;
			gChild.style.right = right;
			gChild.style.transform = 'translateX(' + transform + 'px)';
			gChild.setAttribute('data-last-transformX', dataTransform);
		}
	}
	
	function mouseUp (event) {
		if (galleryMoving) {
			if (parseInt(gChild.style.left) > 0) {galleryAnimateToLeft();}
			if (parseInt(gChild.style.right) > 0) {galleryAnimateToRight();}
			
			//если ещё есть незагруженные изображения
			if (all_images_load != true) {
				showGalleryImages();
			}
		}
		gallery.classList.remove('grabbing');
		
		gallery.removeEventListener('mousemove', mouseMove, false);
		gallery.removeEventListener('touchmove', mouseMove, false);
	}
	
	function galleryAnimateToLeft() {
		gChild.classList.add('bounce-from-left');
		setTimeout(function() {
			gChild.classList.remove('bounce-from-left');
			gChild.style.left = 0;
		}, 500);
	}
	
	function galleryAnimateToRight() {
		gChild.classList.add('bounce-from-right');		
		setTimeout(function() {
			gChild.classList.remove('bounce-from-right');
			
			//предотвращение лага при доматывании до конца, но при не полностью загруженных изображениях
			gChild.style.right = 'auto';
			var maxLeftTransform = 0 - (gChild.offsetWidth - gallery.offsetWidth);
			gChild.style.transform = 'translateX(' + maxLeftTransform + 'px)';
			gChild.setAttribute('data-last-transformX', maxLeftTransform);
		}, 500);
	}
	
	
	//попадает ли изображение в область видимости
	function isInViewport(el){
		var rect = el.getBoundingClientRect();

		/*return (
			rect.bottom >= 0 && 
			rect.right >= 0 && 
			rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		);*/
		return (			
			rect.right >= 0 &&
			rect.left <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
	
/* ------ Загрузка изображений галереи, находящихся в области видимости */	
	function showGalleryImages () {
		//var images

		for (var i = 0; i < images.length; i++) {
			
			if(isInViewport(images[i])) {
			
				if (images[i].hasAttribute('data-src')) {
			
					images[i].addEventListener("load", function () {
						this.removeAttribute('data-src');
					});

					images[i].setAttribute('src', images[i].getAttribute('data-src'));
				}				
			}
		}
	}
	
	showGalleryImages();
	
	window.addEventListener("resize", function () {
		all_images_load = false;
		document.getElementById('gChild').style.transform = 'translateX(0)';
		showGalleryImages();
	});
}



// Открытие ссылок, начинающихся с 'http' в новой вкладке
function links_blank() {
	var links = document.getElementsByTagName("a"),
		index, link;

	for (index = 0; index < links.length; index++) {
		link = links[index];
		if (link.href && link.getAttribute('href').indexOf('http') !== -1) {
			link.setAttribute('target', '_blank');
		}
	}
}




//START
//START
//START
//START
//START
//START
//START
//START
//START
function ready() {
	if (document.querySelectorAll('.jpic').length > 0) {
		baguetteBox.run('.jpic');
	}
	
	if (document.querySelectorAll('.youtube').length > 0) {
		youtube();
	}
	
	if (document.querySelectorAll('#subscribeform').length > 0) {
		subscribeSubmit();
	}
	
	if (document.querySelectorAll('#gallery').length > 0) {
		gallery();
	}
	
	links_blank();
}

document.addEventListener("DOMContentLoaded", ready);