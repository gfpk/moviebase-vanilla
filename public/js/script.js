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

	errorlog:function(xhr){
		console.error(xhr);
	},

	successlog:function(data){
		console.log(data );
	},

	populateData:function(htmlString, dataObj){
		var toBeReplaced = ['id', 'title', 'description', 'genre', 'rating'];
		var newhtmlString = htmlString;
		for (var i = 0; i < toBeReplaced.length; i++) {
			var key = toBeReplaced[i]
			var expresion = '{{movie.' + toBeReplaced[i] + '}}';
			newhtmlString = newhtmlString.replace(new RegExp(expresion, 'g'), dataObj[key]);		
		};	
		
		return newhtmlString
	},

};

storage = {};


searchPhrase = '';

document.addEventListener("DOMContentLoaded", function(event) { 
var contentdiv = document.getElementById('contentarea');
renderList = function()
	{
		load.loadHTML('partials/list.html', function(data){	
			var htmlData = data;
			contentdiv.innerHTML = data;
			load.loadJSON('data/movies.json', function(data){
				var jsonData = data;
				storage.htmlData = htmlData;
				storage.jsonData = jsonData;
				storage.jsonData = (searchPhrase != "")? searchMovies(searchPhrase) : jsonData;
				if(storage.jsonData[0]){
					load.loadHTML('partials/listitem.html', function(data){
						var htmlResult = ""; 
						var htmlData = data;
						for (var i = 0; i < storage.jsonData.length; i++) {
							htmlResult += load.populateData(htmlData, storage.jsonData[i]);
						};	
					var listEl = document.getElementById('list');
					listEl.innerHTML = htmlResult;
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
renderList();	

renderDetailed = function(item){
	load.loadHTML('partials/detailed.html', function(data){	
			var htmlData = data;
			load.loadJSON('data/movies.json', function(data){
				var jsonData = data;
				storage.htmlSingleView = htmlData;
				storage.jsonData = jsonData;			
				var	htmlResult = load.populateData(htmlData, storage.jsonData[item]);			
				contentdiv.innerHTML = htmlResult;		
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
}

});

