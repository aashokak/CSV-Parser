
// An Object which is set to false assuming none of the column are initially sorted
var ascSort = false;

// An Object which is set to false assuming none of the column are initially sorted
var descSort = false;

// JSON Object which will is initilaized to null
var uniqueJSON = null;

/*
	This function is called when user tries to upload csv file
	accepts file as an argument and on success process Data 
	and on failure returns an error message

	@param - file - File the user uploads
*/
var readFile = function(file){
	
	$(document).ready(function() {
	    $.ajax({
	        type: "GET",
	        url: file[0].name,
	        dataType: "text",
	        success: function(data) {processData(data);},
	        error: function() {displayErrorMessage(file[0].name);}
	     }); 
	}); 
}

/*
	Displays the error message when the CSV data cannot be read
	
	@param - file - File the user uploads
*/
function displayErrorMessage(file){
	var container = document.getElementById("csvTable");
	//Emptying the container innerhtml
	container.innerHTML = '';
	var messageElem = document.createElement("div");
	messageElem.innerHTML =  file + " cannot be parsed";
	if ($(messageElem).hasClass('error-message')){
		$(messageElem).removeClass('error-message')
	}
	else {
		$(messageElem).addClass('error-message')
	}
	container.appendChild(messageElem);
}

/*
	On successfully reading the file,This function process 
	the CSV data and convert intoJSON objects which is further 
	used to create a dynamic table

	@param - data - CSV Data
*/
function processData(data) {

	var lines=data.split("\n");

	var result = [];

	var headers=lines[0].split(",");

	for(var i=1;i<lines.length;i++){

		var obj = {};
		var currentline=lines[i].split(",");

		for(var j=0;j<headers.length;j++){
			obj[headers[j].trim()] = currentline[j];
		}
		if (obj.RUN_NUMBER.trim() !== ''){
			result.push(obj);
		}
	}
	//eliminates Duplicate JSON data
	uniqueJSON = eliminateDuplicates(result);

	//Create the table and JSON data to the table
	createTable(uniqueJSON);
}

/*
	As per the requirement, output should be sorted in
	Alphabetical Order by Run Number, this sort function
	sorts the column alphabetically on initial load

	@param  - a
	@param  - b

*/
function sortRunNumber(a, b) {
	if(a.RUN_NUMBER < b.RUN_NUMBER){
		return -1;
	}
	else if (a.RUN_NUMBER > b.RUN_NUMBER){
		return 1;
	}
	else {
		return 0;
	}
}

/*
	In order to have a unique set of enteries we call this
	function to eliminate the duplicate items from the JSON arr
	which returns an array of unique enteries

	@param - array
*/
function eliminateDuplicates(arr) {
    arr.sort(sortRunNumber);
    for(var i =1; i< arr.length; i++){
    	if(arr[i].RUN_NUMBER.trim() && (arr[i].RUN_NUMBER === arr[i-1].RUN_NUMBER)){
    		arr.splice(i,1);
    	}
    }
    return arr;
};

/*
	Sorts the column in ascending order

	@param - JSON List
	@param - column to be sorted
*/
function sortColAsc(list, col){
	list.sort(function (a, b) {
		if(a[col] < b[col]){
			return -1;
		}
		else if (a[col] > b[col]){
			return 1;
		}
		else {
			return 0;
		}
    });
    createTable(list);
}

/*
	Sorts the column in descending order

	@param - JSON List
	@param - column to be sorted
*/
function sortRowDesc(list, row) {
	list.sort(function (a, b) {
		if(a[row] < b[row]){
			return 1;
		}
		else if (a[row] > b[row]){
			return -1;
		}
		else {
			return 0;
		}
    });
    createTable(list);
}

/*
	Creates click handler when table header is clicked
*/
function createClickHandler(event) {
	//Will only createhandlers for table header
	if(event.target.tagName === "TH") {
		var clickedHeader = event.target.innerHTML;
		if(ascSort) {
			sortRowDesc(uniqueJSON, clickedHeader);
			descSort = true;
			ascSort = false;
		}
		else {
			sortColAsc(uniqueJSON, clickedHeader);
			ascSort = true;
			descSort = false;
		}
	}
}

/*
	Dynamically creates a table based on the JSON Data
	@param - JSON data read from the csv file

*/
function createTable(json) {
    var col = [];
    for (var i = 0; i < json.length; i++) {
        for (var key in json[i]) {
            if (col.indexOf(key) === -1) {
                    col.push(key);
            }
        }
    }

    var table = document.createElement("table");

    //Table Row
    var tr = table.insertRow(-1);

    for (var i = 0; i < col.length; i++) {
    	//Table Header
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // Add json data to the table as rows.
    for (var i = 0; i < json.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json[i][col[j]];
        }
    }

    //Creating a container and append the table to its child
    var divContainer = document.getElementById("csvTable");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    //dynamically  adding styles to the element
    $('table').addClass('csv-table');
    $('table tr th').addClass('tab-header');
    $('table.csv-table').attr('border', '2');
 };