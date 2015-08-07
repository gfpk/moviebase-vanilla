var load = {
	loadJSON:function(url, success, error)
	{
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function()
	    {
	    	console.log("xhr.readyState === 4");
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
	}

};




document.addEventListener("DOMContentLoaded", function(event) { 
	

	load.loadHTML('partials/list.html', function(data){
		
		document.getElementById('contentarea').innerHTML = data;
	});

	var x = function(data){};
	
});

