//building references to elements on the page
const people = document.getElementById('gallery');
const search = document.querySelector('.search-container');
let fetchedContactsArray = [];


//FETCHING DATA
//fetching and displaying data for 12 users
fetch('https://randomuser.me/api/?results=12')
    .then(checkStatus)
    .then(response => response.json(response))
    .then(data => {
        //fetched users array is saved in fetchedContactsArray
        fetchedContactsArray = data.results; 
        displayContacts(fetchedContactsArray);
        addSearchFunctionality();
    })
    .catch(err => console.log(err));

//function that handles error if the request isn't successfull 
function checkStatus (response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject( Error('ups, there was an error') );
    }
};


//FUNCTIONS
//function that displays contacts, takes an array of people as argument when it's called
function displayContacts(contactsArray) {
        let peopleHtmlToPrint = "";
        if (contactsArray.length > 0) {
            contactsArray.forEach(element => {
                peopleHtmlToPrint += `
                <div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${element.picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${element.name.first} ${element.name.last}</h3>
                        <p class="card-text">${element.email}</p>
                        <p class="card-text cap">${element.location.city}, ${element.location.state}</p>
                    </div>
                </div>
                `;
            });
        }
        //handling case when person not found
        else {
            peopleHtmlToPrint = "<h2>No contact found. Try again.</h2>";
        }
        people.innerHTML = peopleHtmlToPrint;
};

// function that adds search elements and functionality to the page
function addSearchFunctionality() {
    search.innerHTML = `
        <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `; 
    document.getElementById('search-input').addEventListener('input', (event)=>{
        displayContacts(searchForContacts(event.target.value));
    });
};   

//function that searches the fetchedContactsArray for certain names, returns array of matched people, takes a string as an argument when it is called
function searchForContacts(searchString) {
    searchString = searchString.toLowerCase();
    let matchedPeople = fetchedContactsArray.filter(element => {
        const firstName = element.name.first.toLowerCase(); 
        const lastName = element.name.last.toLowerCase();
        const fullName = firstName + ' ' + lastName;
        const lastFirst = lastName + ' ' + firstName;
        return firstName.includes(searchString) || lastName.includes(searchString) || fullName.includes(searchString) || lastFirst.includes(searchString);
    });
    return matchedPeople;
};

//function that display a modal over the results, takes person as an argument when it is called
function displayModal(person) {
    const indexOfClickedPerson = searchForPerson(person);
    const clickedPerson = fetchedContactsArray[indexOfClickedPerson];    
    const modal = document.createElement("div");
    modal.className = "modal-container";
    modal.innerHTML = `
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container"></div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>    
    `;
    document.querySelector('body').appendChild(modal);
    displayPersonInModal(clickedPerson);
    //event listener that closes modal when x sign is clicked
    document.querySelector('#modal-close-btn').addEventListener('click', () => document.querySelector('.modal-container').remove());
    // event listener that triggers modal click on next or previous person 
    document.querySelector('#modal-next').addEventListener('click', () => displayNextPersonInModal('next') );
    document.querySelector('#modal-prev').addEventListener('click', () => displayNextPersonInModal('prev') );
    // event listener that triggers modal next or prev person depending on left and right arrow keys from keyboard
    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 39 && document.querySelector('#modal-next').style.display !== 'none') {
            displayNextPersonInModal('next');
        }
        else if(e.keyCode === 37 && document.querySelector('#modal-prev').style.display !== 'none') {
            displayNextPersonInModal('prev');
        }
    });
};

// function that displays next or prev person in modal, it takes 'next' or 'prev' as an argument when it is called
function displayNextPersonInModal(next) {
    const currentName = document.querySelector('.modal-name').innerText;
    let currentNameIndex = searchForPerson(currentName);
    //if user clicked on next button next person index is incremented otherwise it means user clicked on prev so it's decremented
    // const nextPersonIndex = next === 'next' ? currentNameIndex + 1 : currentNameIndex - 1;
    // if(nextPersonIndex < fetchedContactsArray.length && nextPersonIndex >= 0) {
    //     displayPersonInModal(fetchedContactsArray[nextPersonIndex]);
    // }
    // //shows or hides next button depending if it's the last user or not
    // if(nextPersonIndex === fetchedContactsArray.length) {
    //     document.querySelector('#modal-next').style.display = 'none';
    // }
    // else if(document.querySelector('#modal-next').style.display === 'none') {
    //     document.querySelector('#modal-next').style.display = 'inline-block';
    // }
    // //shows or hides prev button depending if it's the first user or not
    // if(nextPersonIndex === 1) {
    //     document.querySelector('#modal-prev').style.display = 'none';        
    // }
    // else {
    //     document.querySelector('#modal-prev').style.display = 'inline-block';
    // }

    //checks if user clicked on next button from modal and if curent person index if different from last element of people array
    if(next === 'next' && currentNameIndex !== fetchedContactsArray.length ) {
        const nextPersonIndex = currentNameIndex + 1;
        displayPersonInModal(fetchedContactsArray[nextPersonIndex]);
        currentNameIndex = nextPersonIndex;
    }
    //checks if user clicked on prev button from modal and if current person index is different from zero
    else if(next === 'prev' && currentNameIndex !== 0 ) {
        const prevPersonIndex = currentNameIndex - 1;
        displayPersonInModal(fetchedContactsArray[prevPersonIndex]);
        currentNameIndex = prevPersonIndex;
    }
    //checks weather to hide prev or next or show both
    if(currentNameIndex === 0) {
        document.querySelector('#modal-prev').style.display = 'none';
    }
    else if(currentNameIndex === (fetchedContactsArray.length - 1) ) {
        document.querySelector('#modal-next').style.display = 'none';
    }
    else {
        document.querySelector('#modal-prev').style.display = 'inline-block';        
        document.querySelector('#modal-next').style.display = 'inline-block';
    }
};

// function that returns index in the fetchedContactsArray of the searched person, takes a persons full name (first and last) as an argument when it is called 
function searchForPerson(personFullName) {
    let indexOfPerson;
    fetchedContactsArray.forEach( (element,index) => {
        const elementFullName = element.name.first + ' ' + element.name.last;
        if( elementFullName === personFullName) indexOfPerson = index;
    });
    return indexOfPerson;
};

//function that displays a certain person in the already opened modal, it takes a person object as an argument when it is called
function displayPersonInModal(person) {
    const date = new Date (person.dob.date);
    const modal = document.querySelector('.modal-info-container');
    modal.innerHTML = `
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.country}</p>
                <hr>
                <p class="modal-text">${person.phone}</p>
                <p class="modal-text">${person.location.street.name} ${person.location.street.number}, 
                ${person.location.city}, ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear() + person.dob.age+1}</p>
            `;
};


// EVENT LISTENERS
// event listener that triggers modal
gallery.addEventListener('click', (event) => {
    if(event.target.className === 'card') {
        displayModal(event.target.children[1].children[0].innerText);
    }
});