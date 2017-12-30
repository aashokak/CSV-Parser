
// An Object which is set to false assuming none of the column are initially sorted
let ascSort = false;

// An Object which is set to false assuming none of the column are initially sorted
let descSort = false;

// JSON Object which will is initilaized to null
let uniqueJSON = null;

const FILE_CANNOT_BE_PARSED_ERROR = ' cannot be parsed'

/*
	This function is called when user tries to upload csv file
	accepts file as an argument and on success process Data 
	and on failure returns an error message

	@param - file - File the user uploads
*/
const readFile = function(file){
	
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
	let container = document.getElementById("csvTable");
	//Emptying the container innerhtml
	container.innerHTML = '';
	let messageElem = document.createElement("div");
	messageElem.innerHTML =  file + FILE_CANNOT_BE_PARSED_ERROR;
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

	let lines=data.split("\n");

	let result = [];

	let headers=lines[0].split(",");

	lines.filter((line, idx) => {
		if (idx > 0) {
			let obj = {};
			let currentline = line.split(',');

			headers.forEach((header, idx) => {
				obj[header.trim()] = currentline[idx];
			});
			if (obj.RUN_NUMBER.trim() !== '') {
				result.push(obj);
			}
		}
	});
	//eliminates Duplicate JSON data
	uniqueJSON = result.length ? eliminateDuplicates(result) : [];

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
	return a.RUN_NUMBER < b.RUN_NUMBER ? -1 : 1
}

/*
	In order to have a unique set of enteries we call this
	function to eliminate the duplicate items from the JSON arr
	which returns an array of unique enteries

	@param - array
*/
function eliminateDuplicates(arr) {
	if (arr.length) {
		arr.sort(sortRunNumber);
		return arr.filter((item, idx, array) => {
			if (idx > 0) {
				return array.indexOf(item.RUN_NUMBER) === idx;
			}
		});
	}
};

/*
	Sorts the column in ascending order

	@param - JSON List
	@param - column to be sorted
*/
function sortColAsc(list, col){
	list.sort(function (a, b) {
		return a[col] < b[col] ? -1 : 1;
    });
    createTable(list);
}

/*
	Sorts the column in descending order

	@param - JSON List
	@param - column to be sorted
*/
function sortColDesc(list, row) {
	list.sort(function (a, b) {
		return a[row] < b[row] ? 1 : -1;
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
			sortColDesc(uniqueJSON, clickedHeader);
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
    if (json.length) {
    	let col = [];
    	json.forEach((data) => {
	    	for (let key in data) {
	            if (col.indexOf(key) === -1) {
	                    col.push(key);
	            }
	        }
	    });

	    let table = document.createElement("table");

	    //Table Row
	    let tr = table.insertRow(-1);
	    col.forEach((cItem) => {
	    	let th= document.createElement("th");
	    	th.innerHTML = cItem;
	        tr.appendChild(th);
	    });

	    // Add json data to the table as rows.
	    json.forEach((data) => {
	    	tr = table.insertRow(-1);
	    	col.forEach((cItem) => {
	    		let tabCell = tr.insertCell(-1);
	            tabCell.innerHTML = data[cItem];
	    	});
	    });

	    //Creating a container and append the table to its child
	    let divContainer = document.getElementById("csvTable");
	    divContainer.innerHTML = "";
	    divContainer.appendChild(table);

	    //dynamically  adding styles to the element
	    $('table').addClass('csv-table');
	    $('table tr th').addClass('tab-header');
	    $('table.csv-table').attr('border', '2');
    }
    else {
    	let  = document.createElement("div");
		messageElem.innerHTML =  file + FILE_CANNOT_BE_PARSED_ERROR;
    }
 };