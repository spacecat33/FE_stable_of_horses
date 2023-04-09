let horses = [];

const baseUrl = "http://localhost:3000"

const main = () => document.getElementById("main");
const nameInput = () => document.getElementById("name");
// const stableInput = () => document.getElementById("stable"); 
const form = () => document.getElementById("form");
const formLink = () => document.getElementById("form-link");
const horsesLink = () => document.getElementById("horses-link");



function resetFormInputs() {
    nameInput().value = "";
    // stableInput().value = "";
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
      // console.log(this);
      renderHorses();
    });
  }
  
  

  // new
  //rendering
  function renderForm() {
    resetMain();
    main().innerHTML = formTemplate();
    form().addEventListener("submit", submitForm);
  }

  function renderEditForm(horse) {
    resetMain(); // reset the main div/clear it out
    main().innerHTML = editFormTemplate(horse); //display the form with the horse's information included in the fields
    form().addEventListener("submit", submitEditForm); // when click on submiteditform, takes us to submiteditform function
  }




  function submitEditForm(e) {
    e.preventDefault();

    let strongParams = {
      horse: {
        name: nameInput().value,
        // stable: stableInput().value
      }
    }
    
    const id = e.target.dataset.id;

    fetch(baseUrl + "/horses/" + id, {
      // this will point to a JS object and represent our strong params
      method: "PATCH",
      headers: {
        // this is how we want to send and receive our requests
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(strongParams), //stringifying the JSON to look like a string. it's still an object.
    }) //then goes to update action in backend horses_controller
    .then(function(resp) {
      return resp.json();
    })
    .then(function(horse) {
      //selects the horse out of the array
      let h = horses.find(function(h) { // this code and below updates the frontend object to match the updated backend object (which was just updates with code above)
        return h.id == horse.id;  
    })
  // gets the index of the selected horse
    let idx = horses.indexOf(h);

   //updates the index value with the newly updated horse but note that the id is the same
    horses[idx] = horse; // this takes the old object and updates it 
    
    //renders the array of horses to page
    renderHorses();
  })
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
    // let itsStable = document.createElement('p');
    let p = document.createElement("p");
    let deleteLink = document.createElement("a");
    let editLink = document.createElement("a");
    let horsesDiv = document.getElementById("horses");
    
    editLink.dataset.id = horse.id;
    editLink.setAttribute("href", "#")
    editLink.innerText = "Edit"

    deleteLink.dataset.id = horse.id;
    deleteLink.setAttribute("href", "#")
    deleteLink.innerText = "Delete"

    editLink.addEventListener("click", editHorse); //adding eventlistener when the linkloads (not when the page loads)
    
    deleteLink.addEventListener("click", deleteHorse)
    // debugger //is the pry of javascript
   
    h4.innerText = horse.name;
    // itsStable.innerText = 'at ${horse.stable}';
    p.innerText = horse.stable; //check whether this works?


    //the following is code for making them show up on page
    div.appendChild(h4);
    // div.appendChild(itsStable);
    div.appendChild(p);
    div.appendChild(editLink);
    div.appendChild(deleteLink);
    
    horsesDiv.appendChild(div);

  }

  async function deleteHorse(e) {
    e.preventDefault();

    let id = e.target.dataset.id;

    const resp = await fetch(baseUrl + "/horses/" + id, { //if you forget the await, it would immediately go to the next line and so will not have info from the await response to continue
      method: "DELETE" //this goes to backend controller destroy action
    })
    const data = await resp.json();

    horses = horses.filter(function(horse){
      return horse.id !== data.id;
    })

    renderHorses();
  }
  // function deleteHorse(e) {
  //   e.preventDefault(); //this prevents default GET request when a link is clicked

  //   let id = e.target.dataset.id; //grabs the deleteLink's dataset (set above: deleteLink.dataset.id = horse.id)

  //   fetch(baseUrl + "/horses/" + id, {
  //    method: "DELETE" //this goes to backend controller destroy action
  //   })
  //   .then(function(resp) {
  //     return resp.json();
  //   })
  //   .then(function(data) {
  //     // debugger;
  //     horses = horses.filter(function(horse){
  //       return horse.id !== data.id;
  //     })

  //     renderHorses();
  //   })
  // }
    // debugger;
  


function editHorse(e) {
  e.preventDefault();
  
  const id = e.target.dataset.id;

  const horse = horses.find(function(horse) {
    return horse.id == id;
  })

  renderEditForm(horse)
}

  function submitForm(e) {
    e.preventDefault();
    
    let strongParams = {
      horse: {
        name: nameInput().value,
        // stable: stableInput().value
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

    
//alternative way to fetch - using 'async and await:
  async function getHorses() {
    const resp = await fetch(baseUrl + '/horses')
    console.log("b")
    const data = await resp.json();
    console.log("c")
    horses = data
    renderHorses();
  }
    // console.log('a')
    //fetch to the rails api, horses index. Grab the horses
    // populate the main div with the horses
  //  fetch(baseUrl + '/horses')  
    // .then(function(resp) {   //this is a callback function
    //   // if(resp.status !== 200) {
    //   //   throw new Error('Oops something went wrong');
    //   // }
    //   // console.log('b')
    //   return resp.json();
    // })
  //   .then(function(data) {
  //   //  console.log('c', data)
  //     horses = data

  //    renderHorses();
  //  })
  //  .catch(function(errors) {
  //   console.log('errors', errors)  // this ensures user experience is better (errors in the devtools rather than on user's screen)
  //  })
  //  console.log('d')
  // }


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
    } //the data-id with horse.id interpolated let's grab the form plus the specific id. This is needed for the request.
  


    document.addEventListener("DOMContentLoaded", function () {
      // Horse.gethorses();
      console.log("a")
      getHorses();  //this will send an asynchronous request i.e. will fetch code but whilst waiting will carry on with other lines of code
      console.log("d")
      // renderForm();
      formLinkEvent();
      horsesLinkEvent();
    });
  