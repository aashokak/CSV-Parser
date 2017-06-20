To run the application, You need to open the "Train.html" 

This application allows user to upload the CSV file

	If any other file(which is not csv) is uploaded, it shows an error message

Summary: The CSV contains the train details which will be parsed and added to the HTML table dynamically  

Once you upload the csv file, the application display the data in a table format containing Train Line, Route Name, Operator ID, Run Number

	- All enteries are unique, no duplicate enteries are added to the table

	- Run Number is sorted in alphabetical order when displayed on the table

	- On Clicking on table header, it will sort the column(both ascending and descending based on the clicks)


Note: You often get "Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https, chrome-extension-resource" error message when you run this application in chrome. So it is adviced to run using safari or firefox.