let horses = [];

const baseUrl = "http://localhost:3000"

const main = () => document.getElementById("main");
const nameInput = () => document.getElementById("name");
const stableInput = () => document.getElementById("stable");
const form = () => document.getElementById("form");
const formLink = () => document.getElementById("form-link");
const horsesLink = () => document.getElementById("horses-link");



function resetFormInputs() {
    nameInput().value = "";
    stableInput().value = "";
  }
  
  function resetMain() {
    main().innerHTML = "";
  }
  
  function formLinkEvent() {
    formLink().addEventListener("click", function (e) {
      e.preventDefault();
  
      renderForm();
    });
  }
  
  function horsesLinkEvent() {
    horsesLink().addEventListener("click", function (e) {
      e.preventDefault();
      console.log(this);
      Horse.renderHorses();
    });
  }
  
  

  // new
  //rendering
  function renderForm() {
    resetMain();
    main().innerHTML = formTemplate();
    form().addEventListener("submit", submitForm);
  }

  function renderHorses() {
    resetMain();
    main().innerHTML= horsesTemplate();

    horses.forEach(function (horse) {
      renderHorse(horse);
    });
  }

  function renderHorse(horse) {
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let p = document.createElement("p");
    let horsesDiv = document.getElementById("horses");

    h4.innerText = horse.name;
    itsStable.innerText = 'at ${horse.stable.name}';
    // p.innerText = horse.stable; //check whether this works?

    div.appendChild(h4);
    div.appendChild(itsStable);

    horsesDiv.appendChild(div);

  }

  function submitForm(e) {
    e.preventDefault();
    
    let strongParams = {
      horse: {
        name: nameInput().value,
        stable_attributes: stableInput().value
      }
    }
    // send data to the backend via a post request
    fetch(baseUrl + '/horses', {
      // this will point to a JS object and represent our strong params
      headers: {
        // this is how we want to send and receive our requests
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(strongParams),
      method: "POST"
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      horses.push(data)
      renderHorses();
    })

    
  }

    

  function getHorses(){
    // console.log('a')
    //fetch to the rails api, horses index. Grab the horses
    // populate the main div with the horses
   fetch(baseUrl + '/horses')  
    .then(function(resp) {   //this is a callback function
      // if(resp.status !== 200) {
      //   throw new Error('Oops something went wrong');
      // }
      // console.log('b')
      return resp.json();
    })
    .then(function(data) {
    //  console.log('c', data)
      horses = data

     renderHorses();
   })
  //  .catch(function(errors) {
  //   console.log('errors', errors)  // this ensures user experience is better (errors in the devtools rather than on user's screen)
  //  })
  //  console.log('d')
  }


    /** Horse Templates **/
  
   function horsesTemplate() {
      return `
      <h3>List Of Horses</h3>
      <div id="horses"></div>
      `;
    }
  
    function formTemplate() {
      return `
      <h3>Create Horse</h3>
      <form id="form">
        <div class="input-field">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div class="input-field">
          <label for="stable">Stable</label>
          <input type="text" name="stable" id="stable" />
        </div>
        <input type="submit" value="Create Horse" />
      </form>
      `;
    }
  
    function editFormTemplate(horse) {
      return `
      <h3>Edit Horse</h3>
      <form id="form" data-id="${horse.id}">
        <div class="input-field">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" value="${horse.name}" />
        </div>
        <input type="submit" value="Edit Horse" />
      </form>
      `;
    }
  


    document.addEventListener("DOMContentLoaded", function () {
      // Horse.gethorses();
      getHorses();  //this will send an asynchronous request
      renderForm();
      formLinkEvent();
      horsesLinkEvent();
    });
  