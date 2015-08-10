var load = {
	loadJSON:function(url, success, error)
	{
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	        if (xhr.readyState === 4 && xhr.status === 200) {
	             if (success)
	                    success(JSON.parse(xhr.responseText));
	            } else {
	                if (error)
	                    error(xhr);
	            }	        
	    };
	    xhr.open("GET", url, true);
	    xhr.send();
	},
	loadHTML:function(url, success, error)
	{
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	        if (xhr.readyState === XMLHttpRequest.DONE) {
	            if (xhr.status === 200) {
	                if (success)
	                    success(xhr.responseText);
	            } else {
	                if (error)
	                    error(xhr);
	            }
	        }
	    };
	    xhr.open("GET", url, true);
	    xhr.send();
	},
	populateData:function(htmlString, dataObj, context){
		var toBeReplaced = ['id', 'title', 'description', 'genre', 'rating', 'budget', 'audience', 'profits', 'trivia'];
		var newhtmlString = htmlString;
		for (var i = 0; i < toBeReplaced.length; i++) {
			var key = toBeReplaced[i];
			var expresion = '{{movie.' + toBeReplaced[i] + '}}';
			if(key == "description" && context == "list"){
				newhtmlString = newhtmlString.replace(new RegExp(expresion, 'g'), (dataObj[key].substring(0, 100) + "..."));
			}else{
				newhtmlString = newhtmlString.replace(new RegExp(expresion, 'g'), dataObj[key]);
			}				
		};			
		return newhtmlString
	},
};
storage = {};
renderRating = function(){
	var ratingElements = document.getElementsByClassName('rating');
	for (var i = 0; i < ratingElements.length; i++) {
		var r = parseInt(ratingElements[i].getAttribute('rating'));
		var ratingHtml = "rating: "
		for (var j = 1; j <= 5; j++) {
			if(j <= r){
				ratingHtml += "<i class='glyphicon glyphicon-star'></i>";
			}else{
				ratingHtml += "<i class='glyphicon glyphicon-star-empty'></i>";
			};
		};
		ratingElements[i].innerHTML = ratingHtml;		
	};
};
hideGallery = function(){
	var e = document.getElementById("canvas");
	var eInner = document.getElementById("canvasinner");
	eInner.innerHTML ="";
	e.className = ""; 
};
revealGallery = function(index){
	galleryLightBox(index);
	var e = document.getElementById("canvas");
	e.className = "active"; 
};
galleryLightBox =function(index){
	var canvas = document.getElementById("canvas");

	var galleryItem = document.getElementsByClassName("galleryItem")[index];
	var e = document.getElementById("canvasinner");
	var galleryHtml = "<img src='" + galleryItem.src +"'>";
	console.log(galleryItem);
	e.innerHTML = galleryHtml;
}
searchPhrase = '';
genreFilter = '';
document.addEventListener("DOMContentLoaded", function(event) { 
var contentdiv = document.getElementById('contentarea');
renderBadRoute=function(){
	load.loadHTML('partials/404.html', function(data){	
		contentdiv.innerHTML = data;
	});
};
renderList = function(){
	load.loadHTML('partials/list.html', function(data){	
		var htmlData = data;
		contentdiv.innerHTML = data;
		if(genreFilter != ""){
			var filtersHtml = "<p>filter: <span class='badge badge-important'>"+ genreFilter +" <a href='/'><i class='glyphicon glyphicon-remove-circle'></i></a></span></p>";
			var filterWrap = document.getElementById('filterwrap');
			filterWrap.innerHTML =filtersHtml;
		}
		load.loadJSON('data/movies.json', function(data){
			var jsonData = data;
			storage.htmlData = htmlData;
			storage.jsonData = jsonData;
			storage.jsonData = (searchPhrase != "")? searchMovies(searchPhrase) : jsonData;
			storage.jsonData = (genreFilter != "")? searchMoviesByGenre(genreFilter) : storage.jsonData;
			if(storage.jsonData[0]){
				load.loadHTML('partials/listitem.html', function(data){
					var htmlResult = ""; 
					var htmlData = data;
					for (var i = 0; i < storage.jsonData.length; i++) {
						htmlResult += load.populateData(htmlData, storage.jsonData[i], "list");
					};	
				var listEl = document.getElementById('list');
				
				listEl.innerHTML = htmlResult;
				renderRating();
				});
			}else{
				load.loadHTML('partials/noresults.html', function(data){	
				var listEl = document.getElementById('list');
				listEl.innerHTML = data;
				});
			}			
		});			
	});
}
renderDetailed = function(item){
	load.loadHTML('partials/detailed.html', function(data){	
		var htmlData = data;
		load.loadJSON('data/movies.json', function(data){
			if(data[item]){
				var jsonData = data;
				storage.jsonData = jsonData;			
				var	htmlResult = load.populateData(htmlData, storage.jsonData[item], "detail");			
				contentdiv.innerHTML = htmlResult;
				renderRating();
				galleryLightBox();
			}else{
				renderBadRoute();
			}			
		});		
	});
}
searchMovies = function(phrase){
	var results = [];
	for (var i = 0; i < storage.jsonData.length; i++) {
		if(storage.jsonData[i].title.toLowerCase().indexOf(phrase.toLowerCase()) > -1 ){
			results.push(storage.jsonData[i]);
		}
	};
	
	return results
};
searchMoviesByGenre = function(genre){
	var results = [];
	for (var i = 0; i < storage.jsonData.length; i++) {
		if(storage.jsonData[i].genre === genre){
			results.push(storage.jsonData[i]);
		}
	};
	return results
};
var router = function(){
	var route = window.location.href.replace(window.location.origin+"/#/",'');
	console.log(route);
	if(isNaN(route) == false){
		renderDetailed(route);
	}else if(isNaN(route) == true) {
		if(window.location.href.replace(window.location.origin+"/#/",'')==window.location.origin+"/"){
			renderList();
		}else{
			genreFilter = route;
			renderList();
		}		
	}else{
		renderBadRoute();
	};
};
router();
});

