// GLOBAL VARS
var JSONData = null;  // JSON DATA
var totalImagesToLoad = null; // Total imagenes para cargar
var totalImagesLoaded = 0; // Cantidad de imagenes cargadas
var globalImagesArray = null; // Array de imagenes
var imageBaseUrl = ""; // Url de imagenes
var currentAmbiente = 0; // Ambientes
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
	this.indexcat  = index;
	this.nombrecat = nombre;
	this.imagecat  = imageUrl;
	this.titlecat  = title;
	// this.categories = categories;
};
CategoriasObject.prototype.init = function ()
{
	
};


// Funcion para colocar el menu de imagenes
function menusize(){
	
	$('.hscroll2').css({
		'margin-bottom': '-262px'
	});
	
	if($('.hscroll2').width()<$(window).width()){
		var width = $('.hscroll2').find('ol').width();
		$('.hscroll2').css({
			'left': '50%',
			'margin-left': '-'+parseInt(width*0.5)+'px'
		});
	}
	
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
	
	console.log(data);
	// console.log(data.length);
	
	var count = 0;
	var result = data.length;
  	JSONData = data;
  	var menu = "";
  
  
	for(var i=0; i<result; i++)
	{
		var item = "";
		item += '<li>';
		item += '<a href="#ambiente-detalhe?ambiente='+i+'" class="ambiente" data-transition="slide" data-amb="'+i+'">';
        item += '<h1>'+JSONData[i]['title']+'</h1>';
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
    console.log(appliedTiles);
	for(var i = 0;i<appliedTiles.length;i++){
        var info = "";
        info += "<li>";
        info += "<img src='"+appliedTiles[i].image.src+"' class='peca'/>";
        info += "<p>"+appliedTiles[i].title+"</p>"
        info += "</li>";
        $('#applied-tiles').append(info);
    }
}


// Verifica la carga de porcentajes de los menus iniciales
function updateLoadingImages(){
	totalImagesLoaded++;
	$("#loading h1").text('Cargando...'+parseFloat((totalImagesLoaded*100)/totalImagesToLoad).toFixed(1)+'%');
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
		// myImage.src = 'http://www.biancogres.com.br/simulador/imageProxy.php?file='+url;
		myImage.src = url;
		if(myImage.complete)
			updateLoadingImages();
	return myImage;
}

// Carga imagenes internas de cada seccion marcando porcentajes
function prepareImageToLoadAmb(url)
{
	var myImage = new Image();
		myImage.onload = updateLoadedImages;
		// myImage.crossOrigin = 'Anonymous';
		myImage.src = url;
		if(myImage.complete)
			updateLoadedImages();
	return myImage;
}

// Carga de imagenes porcentaje de internos
function updateLoadedImages(){
	globalImagesArray[currentAmbiente].loadedImages++;
	$('#percent p').text('carregando...'+parseFloat((globalImagesArray[currentAmbiente].loadedImages*100)/globalImagesArray[currentAmbiente].totalImages).toFixed(1)+'%');
	// console.log(globalImagesArray[currentAmbiente].loadedImages);
	// console.log(globalImagesArray[currentAmbiente].totalImages);
	if(globalImagesArray[currentAmbiente].loadedImages==globalImagesArray[currentAmbiente].totalImages){
		$('a.ambiente img.loading').hide();
		$('#block').hide();
		$('#percent').hide();
		$('#percent p').text('carregando...');
		console.log(ambData);
		showAmbiente( u, ambData.options );
	}
}


// Muestra las imagenes obteniendo del array de las imagenes del menu inicial
function prepareAppLoading()
{
	
	prepareDataForLoading();
	var ambientes = globalImagesArray.length;
	// console.log(globalImagesArray);
	for(var i = 0; i<ambientes; i++)
	{
		// console.log(globalImagesArray[i].thumb);
		// console.log(globalImagesArray[i].image);
		globalImagesArray[i].thumb = prepareImageToLoad(globalImagesArray[i].thumb);
		globalImagesArray[i].image = prepareImageToLoad(globalImagesArray[i].image);
		globalImagesArray[i].loadedImages+=2;
	}
}


// Preparando imagenes pequeñas para carga interna
function prepareAmbLoading()
{
	$('#percent').show();
	var ambientes = globalImagesArray.length;
	
	// console.log(currentAmbiente); 0
	var surfacesTotal = globalImagesArray[currentAmbiente].surfaces.length;		
	for(var j = 0; j<surfacesTotal; j++)
	{
		// console.log('carregando...'+parseFloat((globalImagesArray[currentAmbiente].loadedImages*100)/globalImagesArray[currentAmbiente].totalImages).toFixed(1)+'%');
		// console.log(globalImagesArray[i].surfaces[j].shape);
		globalImagesArray[currentAmbiente].surfaces[j].shape = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].shape);
		var tilesTotal = globalImagesArray[currentAmbiente].surfaces[j].tiles.length;
		for(var k = 0; k<tilesTotal; k++)
		{
			var categoriesTotal = globalImagesArray[currentAmbiente].surfaces[j].tiles[k].titlecat.length;
			// console.log(categoriesTotal);
			globalImagesArray[currentAmbiente].surfaces[j].tiles[k].imagecat = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].imagecat);

			for (var w = 0; w >= categoriesTotal; w++) {
				globalImagesArray[currentAmbiente].surfaces[j].tiles[k].titlecat[w].thumb = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].titlecat[w].thumb);
				globalImagesArray[currentAmbiente].surfaces[j].tiles[k].titlecat[w].image = prepareImageToLoadAmb(globalImagesArray[currentAmbiente].surfaces[j].tiles[k].titlecat[w].image);
			};
		}
	}
	
	
}

// Creando y almacenando datos en el array general
function prepareDataForLoading(){
	globalImagesArray = new Array();  // Inicializando el array por primera vez
	var stuff = JSONData.length;
	for(var i = 0; i<stuff; i++)
	{
		var ambienteImgs=0;  //// Inicializando ambientesImgs
		var surfacesTotal = JSONData[i].surfaces.length;
		var surfaces = new Array();  // Inicializando Superficies
		
		for(var j = 0; j<surfacesTotal; j++)
		{
			var categories = new Array()
			var categoriesTotal = JSONData[i].surfaces[j].categories.length;
			for (var x = 0; x < categoriesTotal; x++) {
				var tiles = new Array(); // Inicia Tiles
				var tilesTotal = JSONData[i].surfaces[j].categories[x].tiles.length;
				for(var k = 0; k<tilesTotal; k++)
				{
					// ConfigObject(index,thumbUrl,imageUrl,title)
					tiles.push(new ConfigObject(k,JSONData[i].surfaces[j].categories[x].tiles[k].tileImage,JSONData[i].surfaces[j].categories[x].tiles[k].defaultImage,JSONData[i].surfaces[j].categories[x].tiles[k].title));
					// ambienteImgs++;
					
				}
				
				// CategoriasObject(index,nombre,imageUrl,title)
				categories.push(new CategoriasObject(x,JSONData[i].surfaces[j].categories[x].nombre,JSONData[i].surfaces[j].categories[x].image,tiles));
				// ambienteImgs++;
				ambienteImgs++;
			};
				// ShapeObject(index,url,tiles)
				surfaces.push(new ShapeObject(j,JSONData[i].surfaces[j].shape,categories));
				// ambienteImgs++;
				ambienteImgs++;

			
		}
		
		totalImagesToLoad+=2;
		// ambienteImgs+=2;
		// console.log(totalImagesToLoad);
		// console.log(ambienteImgs);
		// console.log(surfaces);

		// AmbienteObject(index,thumbUrl,imageUrl,surfaces,totalImg,title)
		globalImagesArray.push(new AmbienteObject(i,JSONData[i].image,JSONData[i].imageBig,surfaces,ambienteImgs,JSONData[i].title));
	} 
}

function init(){
	
	$.ajax({
		type:'GET',
		url:'js/data.json',
		// url:'http://biancogres.viriatoeviriato.com.br/getJsonp',
		dataType: 'json',
		crossDomain: true,
		success: parseJSONData
	});
	
	$(document).bind("pagebeforechange", function( e, data ) {
		
		ambData=data;
		// Sólo queremos manejar changePage () llama a la persona que llama es donde
		// Nos pide que cargue una página URL.
		if ( typeof data.toPage === "string" ) {
			
			// Se nos pide para cargar una página por URL, pero sólo nos
			// Querer manipular las URLs que solicitan los datos para una específica
			// Categoría.
			u = $.mobile.path.parseUrl( data.toPage );
			re = /^#ambiente-detalhe/;
	
			if ( u.hash.search(re) !== -1 ) {
				
				currentAmbiente = parseInt(u.hash.replace( /.*ambiente=/, "" ));
				// Nos piden que mostrar los elementos de una categoría específica.
				// Llama a nuestro método interno que se basa el contenido de la categoría
				// Sobre la marcha sobre la base de nuestra estructura de categorías de datos en memoria.
				if(swipe){
					e.preventDefault();
					return false;
				}
				console.log(globalImagesArray);
				// console.log(currentAmbiente);
				if(globalImagesArray[currentAmbiente] !== undefined){
					if(globalImagesArray[currentAmbiente].totalImages>globalImagesArray[currentAmbiente].loadedImages){
						console.log('carregar');
						$('a.ambiente').each(function(){
							if($(this).data('amb')==currentAmbiente){
								$(this).find('img.loading').show();
							}else{
								$(this).find('img.loading').hide();
							}
						});
						$('#block').show();
						prepareAmbLoading();
					}else{
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
	        	
	        	var urlCall = "http://biancogres.viriatoeviriato.com.br/html/actions.php";
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
								console.log('done');
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

// Ordenando las latitudes de la imagen
function buildStage(){
	console.log(JSONData[currentAmbiente].imageBigSize);
	var imageOriginalSize = parseSize(JSONData[currentAmbiente].imageBigSize);
	var stageSize = {height:0, width:0};
	
	stageSize.height = $(window).height();
	stageSize.width = (imageOriginalSize.width * stageSize.height) / imageOriginalSize.height;
	mainStage = new Kinetic.Stage({
   		container: 'mainStage',
    	width: stageSize.width,
    	height: stageSize.height
  	});
  	
  	console.log('buildStage');
  	configStage();
  	
}

// Menu superior config
function configStage(){
	
	$('#download').click(saveImage); 
	
	$('div.containing').css({
     	'width': (mainStage.width())+'px',
     	'margin-left': '-'+(mainStage.width()/2)+'px'
    });
    
    var produtos_aplicados = '<div class="prod_apl">';
    produtos_aplicados += '<h3>Produtos Aplicados:</h3>';
    produtos_aplicados += '<ul id="prod_apl">';
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
	    	// console.log("here");
	    	$(this).find('.amb').panzoom("reset");
	    }
	    
	    // console.log($(this).find('.amb').width());
	    // console.log($(this).find('.amb').panzoom("getMatrix"));
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
		$('img.seta').fadeOut(500);
		
		$('#right').fadeOut(500);
		$('#left').fadeOut(500);
		return false;
	}
}

function shapeClicked(){
	if(!swipe){
		if(currentSurface!=this._index)
		{
			if(tileListStatus)
			{
				tileListStatus = false;
				var shapeId = this._index;
				TweenLite.to($("#tiles"),0.5,{css:{height: 0}, ease: Expo.easeOut, onComplete: buildTileList, onCompleteParams: [this._index]});
				
				return false;
			}
			buildTileList(this._index);
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


function buildTileList(shape){
	console.log("Open Shape");
	currentSurface = shape;
	var totalTiles = globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles.length;
	$("#tileList").html('');
	$("#tiles").css("display","block");
	var li = 0;
	var a = 0;
	for(var i = 0; i<totalTiles; i++)
	{
		if(selectedShapeTiles[currentSurface] == i){
			// li = $("<li></li>");
			// a = $("<a class='peca active' data-peca='"+i+"' href='#'></a>");
			// li.append(a);
			// globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb.class = 'peca';
			// a.append(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb);
			// li.append("<p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title+"</p>");
			$("#tileList").append("<li><a class='peca active' data-peca='"+i+"' href='#'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb.src+"' class='peca'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title+"</p></li>");
		}else{
			// li = $("<li></li>");
			// a = $("<a class='peca' data-peca='"+i+"' href='#'></a>");
			// li.append(a);
			// globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb.class = 'peca';
			// a.append(globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb);
			// li.append("<p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title+"</p>");
			$("#tileList").append("<li><a class='peca' data-peca='"+i+"' href='#'><img src='"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].thumb.src+"' class='peca'/></a><p>"+globalImagesArray[currentAmbiente].surfaces[currentSurface].tiles[i].title+"</p></li>");
		}
		li = null;
		a = null;
	}
	$("a.peca").on('click', tileClicked)
	
	$("#tiles").data("mobileIscrollview").refresh();
	TweenLite.to($("#tiles"),0.5,{height: 175, ease: Expo.easeOut});
		$("#tiles").iscrollview("scrollToElement", "a.peca:first-child");
	$('#right').fadeIn(500);
	$('#left').fadeIn(500);
	$('img.seta').fadeIn(500,function(){
		$("#tiles").iscrollview("scrollToElement", "a.active");
	});
	tileListStatus = true;
}

function tileClicked()
{
	if(!swipe){
		$('a.peca').removeClass('active');
		$(this).addClass('active');
		var tileId = parseInt($(this).data("peca"));
		currentTile = tileId; 
		layers[2].children[currentSurface].destroy();
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
    
	layers[0].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].image,null,null));
	layers[0].layer.add(layers[0].children[0]);
	
	var totalSurfaces = globalImagesArray[currentAmbiente].surfaces.length;
	
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	layers.push({ layer : new Kinetic.Layer(), children: new Array()});
	
	
	$("#tiles").height(0);
	
	for(var i = 0;i<totalSurfaces; i++){
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
	
        
		// TODO
		
		layers[2].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[i].tiles[0].titlecat[0].image, parseSize(JSONData[currentAmbiente].surfaces[i].size), parseSize(JSONData[currentAmbiente].imageBigSize)));
		layers[2].layer.add(layers[2].children[i]);
		layers[2].children[i].listening(false);
		
		console.log(globalImagesArray[currentAmbiente].surfaces[i].tiles[0].titlecat[0].thumb);
         appliedTiles.push({
            index: i,
            image: globalImagesArray[currentAmbiente].surfaces[i].tiles[0].titlecat[0].thumb,
            title: globalImagesArray[currentAmbiente].surfaces[i].tiles[0].titlecat[0].title
        });
        
		layers[3].children.push(prepareImageToStage(globalImagesArray[currentAmbiente].surfaces[i].shape, parseSize(JSONData[currentAmbiente].surfaces[i].size), parseSize(JSONData[currentAmbiente].imageBigSize), true));
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
	}
	
	layers[1].layer.drawHit();

	console.log(layers);
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


// Separando las cordenadas del size
function parseSize(unparsedSize){
	var tempArray = unparsedSize.split(';');
	var tempString = tempArray.join('=');
	tempArray = tempString.split('=');
	return {x:tempArray[1], y:tempArray[3], width:tempArray[5], height:tempArray[7]};
}

function placeBackgroundImage(imgUrl, size){
	return	"<img class='big' data-name='Back' data-width='"+size.width+"' data-height='"+size.height+"' src='http://biancogres.viriatoeviriato.com.br/"+imgUrl+"' />";
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
		responseArray.push("<img id='maskedTilePlaceholder-"+masks[i].id+"' class='maskedTilePlaceholder' data-width='"+size.width+"' data-height='"+size.height+"' data-x='"+size.x+"' data-y='"+size.y+"' src='http://biancogres.viriatoeviriato.com.br/"+masks[i].tiles[0].defaultImage+"'/>");
		// amb +=	"<img class='p' data-mask='"+id_mask+"' data-peca='"+id_peca+"' data-formato='"+1+"' src='http://biancogres.viriatoeviriato.com.br/"+peca+"' />";
		
	}	
	// console.log(responseArray.join());
	return responseArray;
}

function placeMasks(masks){
	
	
	var totalMasks = masks.length;
	var responseArray = null;
	for(var i = 0;i<totalMasks;i++)
	{
		
		if(i==0){
			responseArray = new Array();
		}
		var size = parseSize(masks[i].size);
		responseArray.push("<img id='maskPlaceholder-"+masks[i].id+"' class='maskPlaceholder' data-mask='"+i+"' data-width='"+size.width+"' data-height='"+size.height+"' data-x='"+size.x+"' data-y='"+size.y+"' src='http://biancogres.viriatoeviriato.com.br/"+masks[i].shape+"'/>");
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
				
		responseArray.push("<li><a class='peca' data-peca='"+id_peca+"' href='#'><img class='peca' src='http://biancogres.viriatoeviriato.com.br/"+tile+"'/></a></li>");
		
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
							'opacity': 0
						});
					}
				
				});
				
				formato_id="";
				peca_id="";
			}
			
			return false;
		});
		
}