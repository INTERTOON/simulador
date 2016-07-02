// GLOBAL VARS
var JSONData = null;
var totalImagesToLoad = null;
var totalImagesLoaded = 0;
var globalImagesArray = null;
var imageBaseUrl = "";
var currentAmbiente = 0;
var currentSurface = 0;
var currentTile = 0;
var mainStage = null;
var mainImage = null;
var layers = null;
var tileListStatus = false;
var maskPlaceholder_id;
var ambiente;
var totalAmbImagesToLoad = null;
var totalAmbImagesLoaded = 0;
var selectedShapeTiles = null;
var appliedTiles = null;
var selectedAmbiente = 0;
var ambData = null;
var u = null;
var re = "";
var swipe = false;
var element = null;
var animate = 0;
// Fazer refresh ao menu central

function AmbienteObject(index,thumbUrl,imageUrl,surfaces,totalImg,title)
{
	this.surfaces = surfaces;
	this.thumb = thumbUrl;
	this.image = imageUrl;
	this.title = title;
	this.index = index;
	
	this.totalImages = totalImg;
	this.loadedImages = 0;
};

AmbienteObject.prototype.init = function ()
{
	
};

function ShapeObject(index,url,tiles)
{
	this.shape = url;
	this.index = index;
	this.tiles = tiles;

};
ShapeObject.prototype.init = function ()
{
	
};

function ConfigObject(index,thumbUrl,imageUrl,title)
{
	this.index = index;
	this.thumb = thumbUrl;
	this.image = imageUrl;
	this.title = title;
};
ConfigObject.prototype.init = function ()
{
	
};


// Categorias
function CategoriasObject(index,nombre,imageUrl,title)
{

	this.index = index;
	// this.thumb = thumbUrl;
	this.nombre = nombre;
	this.image = imageUrl;
	this.title = title;
	// this.categories = categories;
};
CategoriasObject.prototype.init = function ()
{
	
};

function menusize(){
	
	// $('.hscroll2').css({
	// 	'margin-bottom': '-262px'
	// });
	
	// if($('.hscroll2').width()<$(window).width()){
	// 	var width = $('.hscroll2').find('ol').width();
	// 	$('.hscroll2').css({
	// 		'left': '50%',
	// 		'margin-left': '-'+parseInt(width*0.5)+'px'
	// 	});
	// }
	
	$("#ambs").data("mobileIscrollview").refresh();
	
}


// Fazer chamada a ficheiro JSON para receber os ambientes
$(function(){
	$(document).ready(function(){
		init();
	});
});

// Parse JSON data RESPONSE
function parseJSONData(data)
{
	
	// console.log(data);
	
	var count = 0;
	var result = data.length;
  	JSONData = data;
  	var menu = "";
  
	for(var i=0; i<result; i++)
	{
  		// console.log(JSONData[i]);
		var item = "";
		item += '<li>';
		item += '<a href="#ambiente-detalhe?ambiente='+i+'" class="ambiente" data-transition="slide" data-amb="'+i+'">';
        // item += '<h1>'+JSONData[i]['title']+'</h1>';
		item += '<img class="loading" alt="loading" src="img/ajax-loader.gif" />';
		item += '<img alt="ambiente1" src="'+JSONData[i]['image']+'" />';
		item += '</a>';
		item += '</li>'; 
		menu+=item;	

	}
	$('#index #ambs ol').html(menu);
	
	
	$("#index").page();
	menusize();
	prepareAppLoading();

}

function updateAppliedTiles(){
    $('#applied-tiles').html('');
	for(var i = 0;i<appliedTiles.length;i++){
        var info = "";
        info += "<li>";
        // console.log(appliedTiles[i]);
        info += "<img src='"+appliedTiles[i].image.src+"' class='peca'/>";
        info += "<p>"+appliedTiles[i].title+"</p>"
        info += "</li>";
        $('#applied-tiles').append(info);
    }
}


function updateAppliedTiles2(x,s){
    $('#applied-tiles').html('');
    console.log(appliedTiles[x].title);
    console.log(appliedTiles[s].title);
	for(var i = 0;i<appliedTiles[x].title.length;i++){
        var info = "";
        info += "<li>";
        // console.log(appliedTiles[i]);
        // console.log(appliedTiles[x]);
        // console.log(appliedTiles[x].title[i]);
        info += "<img src='"+appliedTiles[x].title[i].tileImagedefaultImage.src+"' class='pecas'/>";
        info += "<p>"+appliedTiles[x].title[i].title+"</p>"
        info += "</li>";
        $('#applied-tiles').append(info);
    }
}

function updateLoadingImages(){
	totalImagesLoaded++;
	$("#loading h1").text('cargando...'+parseFloat((totalImagesLoaded*100)/totalImagesToLoad).toFixed(1)+'%');
	if(totalImagesLoaded==totalImagesToLoad){
		$('#loading').fadeOut(400);
		menusize();
	}
}

function prepareImageToLoad(url)
{
	var myImage = new Image();
		myImage.onload = updateLoadingImages;
		// myImage.crossOrigin = 'Anonymous';
		myImage.src = url;
		if(myImage.complete)
			updateLoadingImages();
	return myImage;
}

function prepareImageToLoadAmb(url)
{
	var myImage = new Image();
		myImage.onload = updateLoadedImages;
		// myImage.crossOrigin = 'Anonymous';
		// myImage.crossOrigin = "Anonymous";
		myImage.src = url;
		if(myImage.complete)
			updateLoadedImages();
	return myImage;
}

function updateLoadedImages(){
	globalImagesArray[currentAmbiente].loadedImages++;
	$('#percent p').text('cargando...'+parseFloat((globalImagesArray[currentAmbiente].loadedImages*100)/globalImagesArray[currentAmbiente].totalImages).toFixed(1)+'%');
	// console.log(globalImagesArray[currentAmbiente]);
	// console.log(globalImagesArray[currentAmbiente].totalImages);
	// console.log(parseFloat((globalImagesArray[currentAmbiente].loadedImages*100)/globalImagesArray[currentAmbiente].totalImages).toFixed(1));
	if(globalImagesArray[currentAmbiente].loadedImages==globalImagesArray[currentAmbiente].totalImages){
		$('a.ambiente img.loading').hide();
		$('#block').hide();
		$('#percent').hide();
		$('#percent p').text('cargando...');
		// console.log(u);
		// console.log(data);
		// console.log(data.options);
		showAmbiente( u, ambData.options );
	}
}

function prepareAppLoading()
{
	
	prepareDataForLoading();
	var ambientes = globalImagesArray.length;
	console.log(globalImagesArray);
	for(var i = 0; i<ambientes; i++)
	{
		// console.log(globalImagesArray[i].loadedImages);
		globalImagesArray[i].thumb = prepareImageToLoad(globalImagesArray[i].thumb);
		globalImagesArray[i].image = prepareImageToLoad(globalImagesArray[i].image);
		globalImagesArray[i].loadedImages+=2;

		// var surfacesTotal = globalImagesArray[i].surfaces.length;		
		// for(var j = 0; j<surfacesTotal; j++)
		// {
			// // console.log(globalImagesArray[i].surfaces[j].shape);
			// globalImagesArray[i].surfaces[j].shape = prepareImageToLoad(globalImagesArray[i].surfaces[j].shape);
			// var tilesTotal = globalImagesArray[i].surfaces[j].tiles.length;
			// for(var k = 0; k<tilesTotal; k++)
			// {
				// globalImagesArray[i].surfaces[j].tiles[k].thumb = prepareImageToLoad(globalImagesArray[i].surfaces[j].tiles[k].thumb);
				// globalImagesArray[i].surfaces[j].tiles[k].image = prepareImageToLoad(globalImagesArray[i].surfaces[j].tiles[k].image);
			// }
		// }
	}
}

function prepareAmbLoading()
{
	$('#percent').show();
	var ambientes = globalImagesArray.length;
	// console.log(globalImagesArray[i].thumb);
	var surfacesTotal = globalImagesArray[currentAmbiente].surfaces.length;		
	for(var j = 0; j<surfacesTotal; j++)
	{
		// console.log('cargando...'+parseFloat((globalImagesArray[currentAmbiente].loadedImages*100)/globalImagesArray[currentAmbiente].totalImages).toFixed(1)+'%');
		// console.log(globalImagesArray[i].surfaces[j].shape);
		// console.log(globalImagesArray[currentAmbiente].surfaces[j].tiles.length);
		

		// console.log(prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].shape));


		// var tilesTotal = globalImagesArray[currentAmbiente].surfaces[j].tiles.length;

		globalImagesArray[currentAmbiente].surfaces[j].shape = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].shape);
		
		// console.log(globalImagesArray[currentAmbiente].surfaces[j].tiles);
		var tilesTotal = globalImagesArray[currentAmbiente].surfaces[j].tiles.length;
		for(var k = 0; k<tilesTotal; k++)
		{
			
			// console.log(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].image);
			globalImagesArray[currentAmbiente].surfaces[j].tiles[k].image = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].image);
			
			var titleTotal = globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title.length;

			for(var x = 0; x<titleTotal; x++)
			{
				// console.log(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title[x]);
				globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title[x].tileImage = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title[x].tileImage);
				globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title[x].tileImagedefaultImage = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].title[x].defaultImage);
			}
		}
	}
}

function prepareDataForLoading(){
	globalImagesArray = new Array();
	var stuff = JSONData.length;
	for(var i = 0; i<stuff; i++)
	{
		var ambienteImgs=0;
		var surfacesTotal = JSONData[i].surfaces.length;
		var surfaces = new Array();
		
		for(var j = 0; j<surfacesTotal; j++)
		{
			
			var tilesCategories = JSONData[i].surfaces[j].categories.length;
			var categories = new Array();
			console.log(JSONData[i]);
			for(var m = 0; m<tilesCategories; m++)
			{
				// console.log(JSONData[i].surfaces[j].categories[m].tiles);
				// console.log(JSONData[i].surfaces[j].categories[m].nombre);
				categories.push(new CategoriasObject(m,JSONData[i].surfaces[j].categories[m].nombre,JSONData[i].surfaces[j].categories[m].image,JSONData[i].surfaces[j].categories[m].tiles));
				ambienteImgs+=m+1;
				// totalImagesToLoad+=2;
				
				var tilesTotal = JSONData[i].surfaces[j].categories[m].tiles.length;
				var tiles = new Array();
				for(var k = 0; k<tilesTotal; k++)
				{
					tiles.push(new ConfigObject(k,JSONData[i].surfaces[j].categories[m].tiles[k].tileImage,JSONData[i].surfaces[j].categories[m].tiles[k].defaultImage,JSONData[i].surfaces[j].categories[m].tiles[k].title));
					ambienteImgs+=k+1;
					// totalImagesToLoad+=2;
				}

			}

			// console.log(JSONData[i].surfaces[j].shape+' --');
			surfaces.push(new ShapeObject(j,JSONData[i].surfaces[j].shape,categories));
			ambienteImgs++;
			// totalImagesToLoad++;
		}
		
		totalImagesToLoad+=2;
		ambienteImgs+=2;
		globalImagesArray.push(new AmbienteObject(i,JSONData[i].image,JSONData[i].imageBig,surfaces,ambienteImgs,JSONData[i].title));
	} 
}

function init(){
	$.ajax({
		type:'GET',
		url:'js/data.json',
		dataType: 'json',
		crossDomain: false,
		success: parseJSONData
	});
	
	$(document).bind("pagebeforechange", function( e, data ) {
		ambData = data;
		// We only want to handle changePage() calls where the caller is
		// asking us to load a page by URL.
		if ( typeof data.toPage === "string" ) {
			// We are being asked to load a page by URL, but we only
			// want to handle URLs that request the data for a specific
			// category.
			u = $.mobile.path.parseUrl( data.toPage );
			re = /^#ambiente-detalhe/;
	
			if ( u.hash.search(re) !== -1 ) {
				
				currentAmbiente = parseInt(u.hash.replace( /.*ambiente=/, "" ));

				// We're being asked to display the items for a specific category.
				// Call our internal method that builds the content for the category
				// on the fly based on our in-memory category data structure.
				if(swipe){
					e.preventDefault();
					return false;
				}
				// console.log(globalImagesArray[currentAmbiente]);
				if(globalImagesArray[currentAmbiente] !== undefined){
					// console.log(globalImagesArray[currentAmbiente].totalImages);
					// console.log(globalImagesArray[currentAmbiente].loadedImages);
					if(globalImagesArray[currentAmbiente].totalImages > globalImagesArray[currentAmbiente].loadedImages){
						console.log('Cargando');
						$('a.ambiente').each(function(){
							// console.log($(this).data('amb'));
							if($(this).data('amb')==currentAmbiente){
								$(this).find('img.loading').show();
							}else{
								$(this).find('img.loading').hide();
							}
						});
						$('#block').show();
						prepareAmbLoading();
					}else{
						console.log(u);
						console.log(data);
						console.log(data.options);
						showAmbiente( u, data.options );
					}
					e.preventDefault();
					// Make sure to tell changePage() we've handled this call so it doesn't
					// have to do anything.
				}else{
					
					window.history.back();
				}
				
				
			}
			else if(u.hash == "#index"){
				// console.log(u); // TODO VOLTAR AO MENU INICIAL
				closeProducts();
				$("body").delay(800).fadeIn(1000,function(){
					$('#ambiente-detalhe #content div.amb').html('');
					$('#ambiente-detalhe div.footer ol').html('');
				});
			}
		}
	});
	
	$("body")
	.mousedown( function(e) {
	  element = e.target;
	  // console.log(element);
	})
	.mouseup( function(e) {
	  	if((element == e.target) && swipe){
	  		e.preventDefault();
			swipe = false;
		} 
	}).bind("MSPointerMove");
	
	$("body").on('touchstart', function(e) {
	  element = e.target;
	  // console.log(element);
	});
	
	$("body").on('touchend', function(e) {
	  	if((element == e.target) && swipe){
	  		e.preventDefault();
			swipe = false;
		} 
	}).on("swipeleft", function(e){
		// console.log('left');
		swipe = true;
	}).on("MSPointerMove", function(e){
		// console.log('move');
		swipe = true;
	});
	
	$('body').on( "swiperight", function(e){
		// console.log('right');
		swipe = true;
	}); 
	
	$('#landing').on( "touchend", function(e){
		$(this).fadeOut(500);
	});
	
	$('#landing').click(function(e){
		$(this).fadeOut(500);
	}); 
	
	$('a.fechar').click(function(e){
		e.preventDefault();
		$('#emaill').fadeOut(500);
		return false;
	})
	
	$('#ajuda').click(function(e){
		e.preventDefault();
		$('#landing').fadeIn(500);
		return false;
	})
	
    $('#materiais').click(function(e){
        e.preventDefault();
        if(!$(this).hasClass('active')){
            $(this).addClass('active');
            $('#applied-tiles').fadeIn(500);
        }
        else{
            $(this).removeClass('active');
            $('#applied-tiles').fadeOut(500);
        }
        return false;
	});
    
	$('#ajuda').on( "touchend", function(e){
		$('#landing').fadeIn(500);
	});
	
	$('#guardar').click(function(){
        /*
         * since the stage toDataURL() method is asynchronous, we need
         * to provide a callback
         */
        mainStage.toDataURL({
          	callback: function(dataUrl) {
	            /*
	             * here you can do anything you like with the data url.
	             * In this tutorial we'll just open the url with the browser
	             * so that you can see the result as an image
	             */
	            console.log('dataURL');
	            $('#emaill img.email').attr('src',dataUrl);
	            $('#formEmail #image').val(dataUrl);
	            imageData = dataUrl;
	            $('#emaill').fadeIn(500);
	            // window.open(dataUrl);
          	}
        });
        
        console.log('here');
    });
     
     $('#right').click(function(){
     	$("#tiles").iscrollview("scrollTo", 100, 0, 100, true);
     	console.log('right');
     });
     
     $('#left').click(function(){
     	$("#tiles").iscrollview("scrollTo", -100, 0, 100, true);
     	console.log('left');
     });
     
      $('a.setaScroll').click(function(e){
     	e.preventDefault();
     	$("#ambs").iscrollview("scrollTo", 500, 0, 100, true);
     	console.log('right yo');
     	return false;
     });
     
     $('a.setaScrollLeft').click(function(e){
     	e.preventDefault();
     	$("#ambs").iscrollview("scrollTo", -500, 0, 100, true);
     	console.log('left yo');
     	return false;
     });
     
    var formFree = true;
	$("#formEmail").submit(function(e){
		e.preventDefault();
		
		if(formFree)
		{
			$('#block').show();
			var valid = true;
			
			
			
			if(($("#formEmail #email").val() == "") || ($("#formEmail #email").val().search("@") == -1) || ($("#formEmail #email").val().search("[*.]") == -1))
	        {
				valid = false;
	        }
	        
	        if(valid)
	        {
	        	formFree = false;
	        	
	        	
	        	var aplicados = "";
	        	for(var i = 0;i<appliedTiles.length;i++){
	        		aplicados += appliedTiles[i].image.src+'==='+appliedTiles[i].title;
	        		if(i!=(appliedTiles.length-1)){
	        			aplicados += ';;';
	        		}
	        	}
	        	
	        	//var urlCall = "http://biancogres.viriatoeviriato.com.br/html/actions.php";
	        	var data = {
	        		email: $("#formEmail #email").val(),
	        		image: imageData,
	        		apl: aplicados
	        	};
	        	
	        	console.log(urlCall);
	        	
				$.ajax({
					url:urlCall,
					dataType:'html',
					type:"POST",
					data: data,
					async:true
				});
				
				// ,
					// success:function(response){
						// formFree = true;
						// // console.log(response['status']);
						// if(response){
							// if(response || response.indexOf( "1PHP Warning" ) != -1)
							// {
								// console.log('done');
            					$('#emaill').fadeOut(500);
            					$("#formEmail #email").val('');
								$('#block').hide();
								formFree = true;
							// }
						// } else{
							// console.log('fail');
						// }
					// }
	        }else{
	        	
	        }
	        return false;
		}
		
	});
	
}

function buildStage(){
	
	var imageOriginalSize = parseSize(JSONData[currentAmbiente].imageBigSize);
	var stageSize = {height:0, width:0};
	
	stageSize.height = $(window).height();
	stageSize.width = (imageOriginalSize.width * stageSize.height) / imageOriginalSize.height;
	mainStage = new Kinetic.Stage({
   		container: 'mainStage',
    	width: stageSize.width,
    	height: stageSize.height
  	});
  	
  	// console.log('buildStage');
  	configStage();
  	
}

function configStage(){
	
	$('#download').click(saveImage); 
	
	$('div.containing').css({
     	'width': (mainStage.width())+'px',
     	'margin-left': '-'+(mainStage.width()/2)+'px'
    });
    
    // $('div.amb').css({
     	// 'left': '50%',
     	// 'margin-left': '-'+(mainStage.width()/2)+'px'
    // });
    
    var produtos_aplicados = '<div class="prod_apl">';
    produtos_aplicados += '<h3>Produtos Aplicados:</h3>';
    produtos_aplicados += '<ul id="prod_apl">';
    
    // produtos_aplicados += '<li>';
    // produtos_aplicados += '<img alt="tile" src="http://biancogres.viriatoeviriato.com.br/img/tab3/size-2/marmo-imperatore-53x106-1394129958.jpg"/>';
    // produtos_aplicados += '<p>Marmo Calacata Bianco 53x106<p/>';
    // produtos_aplicados += '</li>';
    // produtos_aplicados += '<li>';
    // produtos_aplicados += '<img alt="tile" src="http://biancogres.viriatoeviriato.com.br/img/tab3/size-2/marmo-imperatore-53x106-1394129958.jpg"/>';
    // produtos_aplicados += '<p>Marmo Imperatore 53x106<p/>';
    // produtos_aplicados += '</li>';
    
    produtos_aplicados += '</ul>';
    produtos_aplicados += '</div>';
    
    $('div.containing').append(produtos_aplicados);
    
	$(".amb").panzoom({
		minScale: 1,
		increment: 0.5,
		maxScale: 10,
		contain: 'invert'
	});
		
	$(".amb").panzoom("reset");
	
	var iniZoom = 1;
	
	$(".amb").on('panzoomend', function(e, panzoom, matrix, changed) {
		
		if (changed) 
		{
			
			if(matrix[0] == 1)
			{
				
		    	$(this).panzoom("resetPan");
		    }
		}
		else 
		{
		}
	});
	
	$('div.ambiente').on('mousewheel', function(event) {
	    // console.log(event.deltaX, event.deltaY, event.deltaFactor);
	    
	    if(event.deltaY>0){
	    	$(this).find('.amb').panzoom("zoom");
	    	
	    }else{
	    	$(this).find('.amb').panzoom("zoom",true);
	    }
	    
	    var matrix = $(this).find('.amb').panzoom("getMatrix");
	    
	    matrix[4] = 0;
	    matrix[5] = 0;
	    
	    if(matrix[0]==1){
	    	console.log("here");
	    	$(this).find('.amb').panzoom("reset");
	    }
	    
	});
	
	$("div.footer h1").click(closeProducts).bind('touchend');
}


function prepareImageToStage(img,size,originalSize,type){
	
	var oSize = {x:0, y:0, width:mainStage.width(), height:mainStage.height()};
	
	if(size!=null){
		oSize = size;
	}
	if(originalSize!=null)
	{
		oSize.height = (size.height * mainStage.height())/originalSize.height;
		oSize.width = (size.width * mainStage.width())/originalSize.width;
		oSize.x = (size.x * mainStage.width())/originalSize.width;
		oSize.y = (size.y * mainStage.height())/originalSize.height;
		
	}
	if(type)
	   	return new Kinetic.Image({
			image: img,
	      	x: oSize.x,
	      	y: oSize.y,
	      	width: oSize.width,
	    	height: oSize.height,
	    	opacity:0,
	    	blurRadius: 40
	    });
	else
		return new Kinetic.Image({
			image: img,
	      	x: oSize.x,
	      	y: oSize.y,
	      	width: oSize.width,
	    	height: oSize.height
	    });
}

function closeProducts(){

	if(tileListStatus)
	{
		currentSurface = -1;
		tileListStatus = false;
		TweenLite.to($("#tiles"),0.5,{css:{height: 0}, ease: Expo.easeOut});
		TweenLite.to($("#tilesx"),0.5,{css:{height: 0}, ease: Expo.easeOut});
		$('img.seta').fadeOut(500);
		
		$('#right').fadeOut(500);
		$('#left').fadeOut(500);
		return false;
	}
}

function shapeClicked(){
	if(!swipe){
		// console.log(swipe);
		if(currentSurface!=this._index)
		{
			// console.log(tileListStatus);
			if(tileListStatus)
			{
				tileListStatus = false;
				var shapeId = this._index;
				// console.log(shapeId);
				// alert('Dentro del click');
				TweenLite.to($("#tiles"),0.5,{css:{height: 0}, ease: Expo.easeOut, onComplete: categories, onCompleteParams: [this._index]});
				return false;
			}
			// alert('EN cero');
			// console.log(this._index);
			
			// buildTileList(this._index);
			categories(this._index);

		}
	}
}

function shapeOver(){
	// console.log('over');
	var i = this._index;
	layers[4].children[i].play();
	// layers[3].layer.draw();
	$('#mainStage').css('cursor','pointer');
}

function shapeOut(){
	// console.log('out');
	var i = this._index;
	layers[4].children[i].reverse();
	$('#mainStage').css('cursor','default');
}

function categories(shape){
	// console.log("Open Shape");
	// console.log(shape);
	currentSurface = shape;

	var totalTiles = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles.length;
	// console.log(totalTiles);
	$("#tileList").html('');
	$("#tiles").css("display","block");
	$("#tilesx").css("display","none");
	var li = 0;
	// xx= globalImagesArray;
	var a = 0;
	for(var i = 0; i<totalTiles; i++)
	{
		var htm = "<li><a class='subcat' onclick='detail_arr("+i+","+currentSurface+")' data-peca='"+i+"' href='#'>";
		htm += "<input type='hidden' name='cat' class='id_cat' value='"+i+"'>";
		htm += "<img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].image.src+"' class='pecax'/></a><p>";
		htm += globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].nombre+"</p>";
		htm += "</li>";
		$("#tileList").append(htm);
		li = null;
		a = null;
	}
	
	// $(document).on('click',"a.subcat", function(){
	// });


	$("#tiles").data("mobileIscrollview").refresh();
	TweenLite.to($("#tiles"),0.5,{height: 130, ease: Expo.easeOut});
		$("#tiles").iscrollview("scrollToElement", "a.peca:first-child");
	$('#right').fadeIn(500);
	$('#left').fadeIn(500);
	$('img.seta').fadeIn(500,function(){
		$("#tiles").iscrollview("scrollToElement", "a.active");
	});
	tileListStatus = true;
}

function detail_arr(i,currentSurface){
	// console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title.length);
	var totalTiles2 = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title.length;
	$('#cabecera').text(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].nombre);
	$("#tileListx").html('');
	$("#tiles").css("display","none");
	$("#tilesx").css("display","block");
	
	var li = 0;
	var a = 0;

	for(var x = 0; x<totalTiles2; x++){
		 console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].tileImage.src);
		if(selectedShapeTiles[currentSurface] == x){
			$("#tileListx").append("<li><a class='pecax active' data-pecax='"+x+"' href='javascript:tileClicked("+i+","+x+");void(0);'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].tileImage.src+"' class='pecax'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].title+"</p></li>");
		}else{
			$("#tileListx").append("<li><a class='pecax' data-pecax='"+x+"' href='javascript:tileClicked("+i+","+x+");void(0);'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].tileImage.src+"' class='pecax'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].title+"</p></li>");
		}
		li = null;
		a = null;
	}

	 //tileClicked(i);
	
	$("#tilesx").data("mobileIscrollview").refresh();
	TweenLite.to($("#tilesx"),0.5,{height: 130, ease: Expo.easeOut});
		$("#tilesx").iscrollview("scrollToElement", "a.pecax:first-child");
	$('#right').fadeIn(500);
	$('#left').fadeIn(500);
	$('img.seta').fadeIn(500,function(){
		$("#tilesx").iscrollview("scrollToElement", "a.active");
	});
	tileListStatus = true;
}


function buildTileList_lst(shape,xx){
	currentSurface = shape;
	// console.log(globalImagesArray);

	var totalTiles2 = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[shape].title.length;

	$("#tileListx").html('');
	$("#tilesx").css("display","none");
	setTimeout(function(){ 
		$("#tiles").css("display","none");
		$("#tilesx").css("display","block");
	}, 3000)
	
	var li = 0;
	var a = 0;

	for(var x = 0; x<totalTiles2; x++){
		alert('a');
		console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[xx].title[x].tileImage.src);
		$("#tileListx").append("<li><a class='pecax' href='#'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[xx].title[x].tileImage.src+"' class='peca'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[xx].title[x].title+"</p></li>");
		li = null;
		a = null;
	}
	
	// $("a.peca").on('click', tileClicked)
	
	$("#tilesx").data("mobileIscrollview").refresh();
	TweenLite.to($("#tilesx"),0.5,{height: 130, ease: Expo.easeOut});
		$("#tilesx").iscrollview("scrollToElement", "a.pecax:first-child");
	$('#right').fadeIn(500);
	$('#left').fadeIn(500);
	$('img.seta').fadeIn(500,function(){
		$("#tilesx").iscrollview("scrollToElement", "a.active");
	});
	tileListStatus = true;
}

function tileClicked(z,s)
{
	console.log("tileClicked");
	if(!swipe){
		//$('a.pecax').removeClass('active');
		//$(this).addClass('active');
		//var tileId = parseInt($(this).data("pecax"));
		//currentTile = tileId; 
		currentTile = s;
		currentTileZ = z; 
		layers[2].children[currentSurface].destroy();
		$('#cabecera').text(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTileZ].nombre+"/"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTileZ].title[currentTile].title);
		// console.log($(this).data("peca"));
		console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles);
		console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTileZ].title[currentTile].defaultImage);
		
		layers[2].children[currentSurface] = prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTileZ].title[currentTile].tileImagedefaultImage, parseSize(JSONData[currentAmbiente].surfaces[currentSurface].size), parseSize(JSONData[currentAmbiente].imageBigSize));
		layers[2].children[currentSurface].listening(false);
		layers[2].layer.add(layers[2].children[currentSurface]);
		layers[2].layer.draw();
		selectedShapeTiles[currentSurface] = currentTile;
        /*
        console.log(s);
        console.log(appliedTiles);
        console.log(appliedTiles[currentTile].title.length);
        for(var i = 0;i<appliedTiles[currentTile].title.length;i++){
            if(appliedTiles[i].index == currentSurface){
                appliedTiles[i].image = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile].tileImagedefaultImage, 
                appliedTiles[i].title = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile].title 
            }
        }*/
         // alert(i);
        updateAppliedTiles2(z,s);
        
	}
	
}



// -----
function buildTileList(shape){
	console.log("Open Shape");
	// console.log(currentAmbiente);
	currentSurface = shape;
	// console.log(globalImagesArray);
	var totalTiles = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles.length;
	// console.log(totalTiles);
	$("#tileList").html('');
	$("#tiles").css("display","block");
	var li = 0;
	var a = 0;
	for(var i = 0; i<totalTiles; i++)
	{
		var totalTiles2 = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title.length;
		for(var x = 0; x<totalTiles2; x++){
			if(selectedShapeTiles[currentSurface] == x){
				$("#tileList").append("<li><a class='peca active' data-peca='"+i+"' href='#'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].tileImage.src+"' class='peca'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].title+"</p></li>");
			}else{
				$("#tileList").append("<li><a class='peca' data-peca='"+i+"' href='#'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].tileImage.src+"' class='peca'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title[x].title+"</p></li>");
			}
			li = null;
			a = null;
		}
	}
	$("a.peca").on('click', tileClicked)
	
	$("#tiles").data("mobileIscrollview").refresh();
	TweenLite.to($("#tiles"),0.5,{height: 130, ease: Expo.easeOut});
		$("#tiles").iscrollview("scrollToElement", "a.peca:first-child");
	$('#right').fadeIn(500);
	$('#left').fadeIn(500);
	$('img.seta').fadeIn(500,function(){
		$("#tiles").iscrollview("scrollToElement", "a.active");
	});
	tileListStatus = true;
}

function tileClickedx()
{
	if(!swipe){
		$('a.pecax').removeClass('active');
		$(this).addClass('active');
		var tileId = parseInt($(this).data("pecax"));
		currentTile = tileId; 
		layers[2].children[currentSurface].destroy();
		console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles);
		console.log($(this));
		console.log(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile]);
		layers[2].children[currentSurface] = prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile].image, parseSize(JSONData[currentAmbiente].surfaces[currentSurface].size), parseSize(JSONData[currentAmbiente].imageBigSize));
		layers[2].children[currentSurface].listening(false);
		layers[2].layer.add(layers[2].children[currentSurface]);
		layers[2].layer.draw();
		selectedShapeTiles[currentSurface] = currentTile;
        
        for(var i = 0;i<appliedTiles.length;i++){
            if(appliedTiles[i].index == currentSurface){
                appliedTiles[i].image = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile].thumb, 
                appliedTiles[i].title = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[currentTile].title 
            }
        }
        
        updateAppliedTiles();
        
	}
	
}

function saveImage(e)
{
	// $("#downloaded").fadeIn(500);
	// e.preventDefault();
	// mainStage.toDataURL({
      // callback: function(dataUrl) {
        // /*
         // * here you can do anything you like with the data url.
         // * In this tutorial we'll just open the url with the browser
         // * so that you can see the result as an image
         // */
        // $('#downloadImage').attr('src',dataUrl);
        // $('#downloaded img.loading').hide();
        // $('#downloadImage').show();
      // }
   // });
	return false;
}
// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
function showAmbiente( urlObj, options )
{
	selectedShapeTiles = new Array();
	layers = new Array();
    appliedTiles = new Array();
	var pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	var $page = $(pageSelector);
	
	buildStage();
	currentSurface = -1;
	
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	
	$('h1.amb-title').text('');
	$('h1.amb-title').text(globalImagesArray[currentAmbiente].title);
    // console.log(globalImagesArray[currentAmbiente]);
    // console.log(prepareImageToStage(globalImagesArray[currentAmbiente]));
	layers[0].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].image,null,null));
	layers[0].layer.add(layers[0].children[0]);
	
	var totalSurfaces = globalImagesArray[currentAmbiente].surfaces.length;
	
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	
    // console.log(layers[0]);
    // console.log(layers[1]);
    // console.log(layers[2]);
	$("#tiles").height(0);
	
	for(var i = 0;i<totalSurfaces; i++){
		// console.log(globalImagesArray[currentAmbiente].surfaces[i].tiles.length);
		var tileTotal = globalImagesArray[currentAmbiente].surfaces[i].tiles.length;
			// console.log(globalImagesArray[currentAmbiente].surfaces[i]);
			layers[1].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[i].shape, parseSize(JSONData[currentAmbiente].surfaces[i].size), parseSize(JSONData[currentAmbiente].imageBigSize)));
			layers[1].layer.add(layers[1].children[i]);
			layers[1].children[i].cache();
			layers[1].children[i]._index = i;
			layers[1].children[i].drawHitFromCache();
			layers[1].children[i].on('click',shapeClicked);
			layers[1].children[i].on('touchend',shapeClicked);
			layers[1].children[i].on('mouseover',shapeOver);
			layers[1].children[i].on('mouseout',shapeOut);
			selectedShapeTiles.push(0);
			
	       
		
	        // monkey.on('mouseout', function() {
	          // this.opacity(0.2);
	        	// layer.draw();
	        // });
	        

		// for(var c = 0;c<tileTotal; c++){

			// TODO
			
			layers[2].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[i].tiles[0].title[0].tileImagedefaultImage, parseSize(JSONData[currentAmbiente].surfaces[i].size), parseSize(JSONData[currentAmbiente].imageBigSize)));
			layers[2].layer.add(layers[2].children[i]);
			layers[2].children[i].listening(false);
			
	        appliedTiles.push({
	            index: i,
	            image: globalImagesArray[currentAmbiente].surfaces[i].tiles[0].title[0].tileImagedefaultImage,
	            title: globalImagesArray[currentAmbiente].surfaces[i].tiles[0].title
	        });
	        
			// console.log(globalImagesArray[currentAmbiente].surfaces[i].shape);
			layers[3].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[i].tiles[0].title[0].tileImagedefaultImage, parseSize(JSONData[currentAmbiente].surfaces[i].size), parseSize(JSONData[currentAmbiente].imageBigSize), true));
			layers[3].layer.add(layers[3].children[i]);
			var tween = new Kinetic.Tween({
	          node: layers[3].children[i], 
	          duration: 0.5,
	          opacity: 0.3,
	          easing: Kinetic.Easings.EaseInOut
	        });
			layers[3].children[i].listening(false);
			layers[4].children.push(tween);
			// TODO
			
		// }

	}
	
	layers[1].layer.drawHit();


	for(var i = 0; i<layers.length; i++){
		mainStage.add(layers[i].layer);
	}
	
	var logo = new Kinetic.Layer();

	var imageObj = new Image();
	imageObj.onload = function() {
	    var smallLogo = new Kinetic.Image({
			x: 20,
			y: ($(window).height() - 84),
			image: imageObj,
			width: 57,
			height: 64
	    });
	    // add the shape to the layer
		logo.add(smallLogo);
		// add the layer to the stage
	    mainStage.add(logo);
	    
        updateAppliedTiles();
        
	    $page.page();
	
		options.dataUrl = urlObj.href;
		
		$.mobile.changePage( $page, options );
	};
	
	imageObj.src = 'img/biancogres-small-logo.png';
	  
	
	
}

function parseSize(unparsedSize){
	var tempArray = unparsedSize.split(';');
	var tempString = tempArray.join('=');
	tempArray = tempString.split('=');
	return {x:tempArray[1], y:tempArray[3], width:tempArray[5], height:tempArray[7]};
}

function placeBackgroundImage(imgUrl, size){
	return	"<img class='big' data-name='Back' data-width='"+size.width+"' data-height='"+size.height+"' src='"+imgUrl+"' />";
}

function placeMaskedTiles(masks){
	
	// console.log('maskedTiles');
	var totalMasks = masks.length;
	var responseArray = null;
	for(var i = 0;i<totalMasks;i++)
	{
		
		if(i==0){
			responseArray = new Array();
		}
		var size = parseSize(masks[i].size);
		responseArray.push("<img id='maskedTilePlaceholder-"+masks[i].id+"' class='maskedTilePlaceholder' data-width='"+size.width+"' data-height='"+size.height+"' data-x='"+size.x+"' data-y='"+size.y+"' src='"+masks[i].tiles[0].defaultImage+"'/>");
		// amb +=	"<img class='p' data-mask='"+id_mask+"' data-peca='"+id_peca+"' data-formato='"+1+"' src='http://biancogres.viriatoeviriato.com.br/"+peca+"' />";
		
	}	
	// console.log(responseArray.join());
	return responseArray;
}

function placeMasks(masks){
	alert('masks');
	console.log(masks);
	var totalMasks = masks.length;
	var responseArray = null;
	for(var i = 0;i<totalMasks;i++)
	{
		
		if(i==0){
			responseArray = new Array();
		}
		var size = parseSize(masks[i].size);
		responseArray.push("<img id='maskPlaceholder-"+masks[i].id+"' class='maskPlaceholder' data-mask='"+i+"' data-width='"+size.width+"' data-height='"+size.height+"' data-x='"+size.x+"' data-y='"+size.y+"' src='"+masks[i].shape+"'/>");
		// amb +=	"<img class='p' data-mask='"+id_mask+"' data-peca='"+id_peca+"' data-formato='"+1+"' src='http://biancogres.viriatoeviriato.com.br/"+peca+"' />";
		
	}	
	
	return responseArray;
}

function placeTiles(masks){
	
	
	var totalPecas = masks.length;
	var responseArray = null;
	for(var i = 0; i<totalPecas; i++){				
		if(i==0){
			responseArray = new Array();
		}
		var id_mask = masks[i]['id_surface'];
		var id_peca = masks[i]['position'];
		var tile = masks[i]['tileImage'];
				
		responseArray.push("<li><a class='peca' data-peca='"+id_peca+"' href='#'><img class='peca' src='"+tile+"'/></a></li>");
		
	}
	
	return responseArray; 
}

function setAmbiente()
{
	var zoom = false;
	
	var myScroll;
	
	var maxImgWidth;
	var maxImgHeight;
	
	var windowHeight;
	
	var i = 1;
	
	var amb = $('div.ambiente');
	
	maxImgWidth = amb.find('div.amb img.big').data('width');
    maxImgHeight = amb.find('div.amb img.big').data('height');
    
    amb.find('div.amb img.maskedTilePlaceholder').each(function(){
     	var width = $(this).data('width');
     	var height = $(this).data('height');
     	var x = $(this).data('x');
     	var y = $(this).data('y');
     	var mask = $(this).data('mask');
     	
     	width = width*100/maxImgWidth;
     	
     	x = x*100/maxImgHeight;
     	y = y*100/maxImgWidth;
     	
     	$(this).css({
     		'width':width+'%',
     		'height': 'auto',
     		'left':x+'%',
     		'top':y+'%'
     	});
     	
     	// amb.find('div.amb img.p').each(function(){
     		// if($(this).data('mask')==mask){
     			// $(this).css({
		     		// 'width':width+'%',
		     		// 'height': 'auto',
		     		// 'left':y+'%',
		     		// 'top':x+'%'
		     	// });
     		// }
     		// if($(this).data('peca')==1){
     			// $(this).css({
					// 'opacity': 1
				// });
     		// }
     	// });
     	
     });
     
     amb.find('div.amb img.maskPlaceholder').each(function(){
     	var width = $(this).data('width');
     	var height = $(this).data('height');
     	var x = $(this).data('x');
     	var y = $(this).data('y');
     	var mask = $(this).data('mask');
     	
     	width = width*100/maxImgWidth;
     	
     	x = x*100/maxImgHeight;
     	y = y*100/maxImgWidth;
     	
     	$(this).css({
     		'width':width+'%',
     		'height': 'auto',
     		'left':x+'%',
     		'top':y+'%'
     	});
     	
     });
     
     windowHeight = $(window).height();
     var ambWidth = $(window).width();
     
     i++;
     
     if(Math.ceil(maxImgHeight*ambWidth/maxImgWidth)>windowHeight){
     	var widthAjust = parseInt(Math.ceil(maxImgWidth*windowHeight)/maxImgHeight);
     	amb.find('div.amb').css({
     		'width': widthAjust+'px',
     		'left': '50%',
     		'margin-left': '-'+(widthAjust/2)+'px'
     	});
     }else{
     	// console.log()
     	amb.find('div.amb').css({
     		'top': '50%',
     		'margin-top': '-'+Math.ceil(maxImgHeight*ambWidth/maxImgWidth)/2+'px'
     	});
     }
	     
	
	var maxWidth  = $('div.amb').width();
	var maxHeight = $('div.amb').height();
	
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
}

function done(){

	var amb;
	var mask_id;
	var peca_id;
	var formato_id;
	var loading = true;

	$("body")
	.mousedown( function(e) {
	  element = e.target;
	})
	.mouseup( function(e) {
	  if((element == e.target) && swipe){
			e.preventDefault();
			swipe = false;
		} 
	}).bind("MSPointerMove");
	
	$("*:not(.amb)")
	.click( function(e) {
		if($('html').hasClass('no-touch')){
		  if(swipe){
		  	e.preventDefault();
		  }
		 }
	});
	
	$('body').on("swipeleft", function(e){
		swipe = true;
	});
	
	$('body').on("MSPointerMove", function(e){
		swipe = true;
	});
	
	$('body').on( "swiperight", function(e){
		swipe = true;
	});
	
	$('#index a').hover( function(e){
		$('#index a').css({
			"opacity":"0.5"
		});
		$(this).css({
			"opacity":"1"
		});
	},
	function(e){
		$('#index a').css({
			"opacity":"1"
		});
	}
	);
	
	$('#index a').on("touchstart", function(e){
		$('#index a').css({
			"opacity":"0.5"
		});
		$(this).css({
			"opacity":"1"
		});
	});
	$('#index a').on("touchend", function(e){
		$('#index a').css({
			"opacity":"1"
		});
		
	});
	
	$("#footer h1").click(function(e){
		//  plugin call
		// console.log('here'+mask_id);
		if(mask_id!=""){
			$('#ambiente-detalhe div.pecas').each(function(){
				if($(this).data('mask')==mask_id){
					if($(this).css('display')=="block"){
						$(this).slideUp('fast');
					}else{
						$(this).slideDown('fast');
					}
				}else{
					$(this).slideUp('fast');
				}
			});
	 	}
	   
	}).bind('touchend');
		
	var swipe = false;
	var element;
	var scaleIni;
	var scale;
	
	menusize();
	scaleIni = scale/1.5;
	
	$(window).resize(menusize);
	
	/// TODO PAGEINIT
	
	// $(document).bind('pageinit', function(){
	
	    $(".amb").panzoom({
			minScale: 1,
			increment: 0.5,
			maxScale: 10
		});
		
		$(".amb").panzoom("reset");
		
		if($('html').hasClass('no-touch')){
			
			$('div.amb').dblclick(function() {
				if(!zoom){
					$(this).panzoom("zoom", 5, {
					  animate: true
					});
			  		zoom=true;
				}else{
					$(this).panzoom("zoom", 1, {
					  animate: true
					});
					zoom=false;
					$(this).panzoom("reset");
				}
			});
			
			$('div.ambiente').on('mousewheel', function(event) {
			    // console.log(event.deltaX, event.deltaY, event.deltaFactor);
			    
			    if(event.deltaY>0){
			    	$(this).find('.amb').panzoom("zoom");
			    }else{
			    	$(this).find('.amb').panzoom("zoom",true);
			    }
			    
			    var matrix = $(this).find('.amb').panzoom("getMatrix");
			    
			    matrix[4] = 0;
			    matrix[5] = 0;
			    
			    if(matrix[0]==1){
			    	// console.log("here");
			    	$(this).find('.amb').panzoom("reset");
			    }
			    
			    // console.log($(this).find('.amb').panzoom("getMatrix"));
			});
		}
		
		var tap = true;

		var iniZoom = 1;
		
		$(".amb").on('panzoomend', function(e, panzoom, matrix, changed) {
		  if (changed) {
		    // deal with drags or touch moves
		    // console.log(matrix[0]);
		    
		    if(matrix[0] == 1){
		    	$(this).panzoom("resetPan");
		    }
		    
		  } else {
		  		if($('html').hasClass('touch')){
		  			var element = e.target;
		  		
			  		var hit = $(element).hitTestPoint({"x":e.pageX,"y":e.pageY, "transparency":false});
					
					if(!hit && $(element).data('mask')!=undefined && $(element).hasClass('mask')){
						
						maskPlaceholder_id = $(element).data('mask');
						
						$('#ambiente-detalhe div.pecas').each(function(){
							if($(this).data('mask')==mask_id){
								
								$(this).slideDown('fast');
							
							}else{
								$(this).slideUp('fast');
							}
							
						});
						
						$('#ambiente-detalhe div.formatos').slideUp('fast');
						
						$('#ambiente-detalhe div.pecas').each(function(){
							if($(this).data('mask') == mask_id){
								if($(this).css('display')=='none'){
									$(this).slideDown('fast');
								}
								
							}
						});
				 	
				 	}else{
				 		
				 		maskPlaceholder_id = "";
				 		$('#ambiente-detalhe div.pecas').slideUp('fast');
						$('#ambiente-detalhe div.formatos').slideUp('fast');
				    }
		  		}
		  		
		  }
		});

		
		
		$('div.pecas').slideUp('fast');
		$('div.formatos').slideUp('fast');
		// $( "#slider-10" ).change(function() {
		  // var val = $( "#slider-10" ).val();
			// $('div.amb').css({
		    	// '-moz-transform': 'scale(' + (parseFloat(val)+parseFloat(scaleIni)) + ')',
		    	// '-webkit-transform': 'scale(' + (parseFloat(val)+parseFloat(scaleIni)) + ')',
		    	// '-ms-transform': 'scale(' + (parseFloat(val)+parseFloat(scaleIni)) + ')',
		    	// 'transform': 'scale(' + (parseFloat(val)+parseFloat(scaleIni)) + ')'
		    // });
		    // $('.iscroll-scroller').iscrollview("refresh");
		// });
		
			$("body").on('mousemove',function(e){
				var hit = $(e.target).hitTestPoint({"x":e.pageX,"y":e.pageY, "transparency":true});
				if(hit && $(e.target).data('mask')!=undefined && $(e.target).hasClass('maskPlaceholder')){
					$('img.maskPlaceholder').css({
						'opacity':'0',
						'cursor':'default'
					});
					$(e.target).css({
						'opacity':'0.3',
						'cursor':'pointer'
					});
					
			 	}else if(!hit && $(e.target).data('mask')!=undefined && $(e.target).hasClass('maskPlaceholder')){
			 		$(e.target).css({
						'opacity':'0',
						'cursor':'default'
					});
			    }else{
			    	$('img.maskPlaceholder').css({
						'opacity':'0',
						'cursor':'default'
					});
			    }
			});
			
			
			$("div.amb").on('click', function(e){
				//  plugin call
				
				var hit = $(e.target).hitTestPoint({"x":e.pageX,"y":e.pageY, "transparency":true});
				
				if(hit && $(e.target).data('mask')!=undefined && $(e.target).hasClass('maskPlaceholder')){
					
					maskPlaceholder_id = $(e.target).data('mask');
					
					var tiles = JSONData[ambiente].surfaces[maskPlaceholder_id].tiles;
					tiles = placeTiles(tiles).join('');
					
					console.log();
					
					$('#ambiente-detalhe div.pecas').slideUp('fast',function(){
						$('#ambiente-detalhe #footer ol').html('');
						$('#ambiente-detalhe #footer ol').append( tiles );
						$("#ambiente-detalhe div.pecas").data("mobileIscrollview").refresh();
						$(this).slideDown('fast');
					});
					// $('#ambiente-detalhe div.pecas').each(function(){
						// if($(this).data('mask')==mask_id){

							// $(this).delay('fast').slideDown('fast');

						// }else{
							// $(this).slideUp('fast');
						// }

					// });

					// $('#ambiente-detalhe div.pecas').each(function(){
						// if($(this).data('mask') == mask_id){
							// if($(this).css('display')=='none'){
								// $(this).slideDown('fast');
							// }

						// }
					// });
					
					console.log('here');
			 	}else{
			 		
			 		maskPlaceholder_id = "";
			 		$('#ambiente-detalhe div.pecas').slideUp('fast');
			    }
			   
			});
			
		
		
		
		$('#ambiente-detalhe div.pecas a.peca').click(function(e){
			
			var img = $(this).find('img').attr('src');
			peca_id = $(this).data('peca');
			formato_id = $(this).data('formato');
			
			if(!$(this).hasClass('active')){
				
				$('#ambiente-detalhe div.amb img.p').each(function(){
					
					if(($(this).data('mask') == mask_id) && ($(this).data('peca') == peca_id) && ($(this).data('formato') == formato_id)){
						$(this).css({
							'opacity': 1
						});
					}
					else if(($(this).data('mask') == mask_id) && ($(this).data('peca') != peca_id) || ($(this).data('formato') != formato_id)){
						$(this).css({
							'opacity': 0
						});
					}
				
				});
				
				$('#ambiente-detalhe div.pecas').each(function(){
					
					if($(this).data('mask')==mask_id){
						
						$(this).find("a.peca").each(function(){
							if($(this).data("peca")==peca_id){
								$(this).addClass('active');
							}else{
								$(this).removeClass('active');
							}
						});
					}
					
				});
				
			}else{
				$('#ambiente-detalhe div.pecas').each(function(){
				
					if($(this).data('mask')==mask_id){
						
						$(this).find("a.peca").removeClass('active');
					
					}
					
				});
				
				$('#ambiente-detalhe div.amb img.p').each(function(){
					
					if(($(this).data('mask') == mask_id) && ($(this).data('peca') == peca_id)){
						$(this).css({
							'opacity': 0.5
						});
					}
				
				});
				
				formato_id="";
				peca_id="";
			}
			
			return false;
		});
		
	// });
}