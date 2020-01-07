## API Address Book
JavaScript based address book app that communicates with a third-party API to create an employee directory.

## Technologies
Javascript (Fetch API), HTML, CSS

## Screenshots
![image](https://raw.githubusercontent.com/onesoftwareengineer/techdegree-project-5/master/screenshot1.JPG)
*address book*

![image](https://raw.githubusercontent.com/onesoftwareengineer/techdegree-project-5/master/screenshot2.JPG)
*dynamic search feature*

![image](https://raw.githubusercontent.com/onesoftwareengineer/techdegree-project-5/master/screenshot3.JPG)
*modal with employee details*

## More on how it works
A Random User Generator API (https://randomuser.me/) is used to grab information for 12 random “employees,”. Fecthed data is used afterwards to build a prototype for an Awesome Startup employee directory.

A JSON object is requested from the API and parsed so that 12 employees are listed in a grid with their thumbnail image, full name, email, and location. Clicking the employee’s image or name will open a modal window with more detailed information, such as the employee’s birthday and address. Using arrow keys while modal is open, switches between employees.

A dynamic search feature is also added to the address book.
