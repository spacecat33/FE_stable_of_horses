// Model js folder to encapsulate the data

class Horse {
  static all = [] //static means 'class level'

  constructor(attr) {
    this.id = attr.id;
    this.name = attr.name;
    this.stable = attr.stable;
  }

  render() {
    // console.log(horse)
    // debugger
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let itsStable = document.createElement('p');
    let p = document.createElement("p");
    let deleteLink = document.createElement("a");
    let editLink = document.createElement("a");
    let horsesDiv = document.getElementById("horses");
    
    editLink.dataset.id = this.id;
    editLink.setAttribute("href", "#")
    editLink.innerText = "Edit"

    deleteLink.dataset.id = this.id;
    deleteLink.setAttribute("href", "#")
    deleteLink.innerText = "Delete"

    editLink.addEventListener("click", Horse.editHorse); //adding eventlistener when the linkloads (not when the page loads)
    
    deleteLink.addEventListener("click", deleteHorse)
    // debugger //is the pry of javascript
   
    h4.innerText = this.name;
    itsStable.innerText = `is boarded at ${this.stable.name}`;
    


    //the following is code for making them show up on page
    div.appendChild(h4);
    div.appendChild(itsStable);
    div.appendChild(editLink);
    div.appendChild(deleteLink);
  
    horsesDiv.appendChild(div);
  }



  //this pushes the instance of object
  save() {
    Horse.all.push(this) 
  }  
  //creates instance
  static create(attr) {
    let horse = new Horse(attr);
    horse.save();
    return horse;
  }



  //get into collection, create all horse objects and store them
  static createFromCollection(collection) {
   collection.forEach(data => Horse.create(data)) //the data then get passed up to the static create function, creates a new instance which then takes us higher up to the contructor function  which will then go to save and push the new instance into array which returns the object
  }






  /** Horse Templates **/

  static horsesTemplate() {
    return `
    <h3>List Of Horses</h3>
    <div id="horses"></div>
    `;
  }

  static formTemplate() {
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

  static editFormTemplate(horse) {
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


  /** renders **/

  static renderForm() {
    resetMain();
    main().innerHTML = Horse.formTemplate();
    form().addEventListener("submit", Horse.submitForm);
  }


  static renderEditForm(horse) {
    resetMain(); // reset the main div/clear it out
    main().innerHTML = Horse.editFormTemplate(horse); //display the form with the horse's information included in the fields
    form().addEventListener("submit", Horse.submitEditForm); // when click on submiteditform, takes us to submiteditform function
  }

  static renderHorses() {
    resetMain();
    main().innerHTML= Horse.horsesTemplate(); 

    Horse.all.forEach(horse => horse.render()); //instance method
  }



  static editHorse(e) {
    e.preventDefault();
    
    const id = e.target.dataset.id;
  
    const horse = Horse.all.find(function(horse) {
      return horse.id == id;
    })
  
    Horse.renderEditForm(horse)
  }


  static submitForm(e) {
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
      Horse.create(data);
      Horse.renderHorses();
    })
  }



  static submitEditForm(e) {
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
    .then(function(data) {
      //selects the horse out of the array
      let h = Horse.all.find(function(h) { // this code and below updates the frontend object to match the updated backend object (which was just updates with code above)
        return h.id == data.id;  
    })
  // gets the index of the selected horse
    let idx = Horse.all.indexOf(h);

   //updates the index value with the newly updated horse but note that the id is the same
    Horse.all[idx] = new Horse(data); // this takes the old object and updates it 
    
    //renders the array of horses to page
    Horse.renderHorses();
  })
}

}


  
//     static all = []
  
//     constructor(attr) {
//       this.id = attr.id;
//       this.name = attr.name;
//       this.stable = attr.stable;
//     }
  
//     render() {
//       let div = document.createElement("div");
//       let h4 = document.createElement("h4");
//       let itsStable = document.createElement('p'); 
//       let p = document.createElement("p");
//       let deleteLink = document.createElement("a");
//       let editLink = document.createElement("a");
//       let horsesDiv = document.getElementById("horses");
    
//       editLink.dataset.id = this.id;
//       editLink.setAttribute("href", "#")
//       editLink.innerText = "Edit"
      
//       deleteLink.dataset.id = this.id
//       deleteLink.setAttribute("href", "#")
//       deleteLink.innerText = "Delete"
    
//       editLink.addEventListener("click", Horse.editHorse);
//       deleteLink.addEventListener("click", Horse.deleteHorse)
    
//       h4.innerText = this.name;
//       itsStable.innerText = `By: ${this.stable.name}`;
//       p.innerText = this.location; //check this works
    
//       div.appendChild(h4);
//       div.appendChild(itsStable);
//       div.appendChild(p);
//       div.appendChild(editLink);
//       div.appendChild(deleteLink);
    
//       horsesDiv.appendChild(div);
//     }
    
//     save() {
//       Horse.all.push(this)
//     }
  
//     static create(attr) {
//       let horse = new Horse(attr);
//       horse.save();
//       return horse;
//     }
  
//     static createFromCollection(collection) {
//       collection.forEach(data => Horse.create(data))
//     }
  
//     /** Horse Templates **/
  
//     static horsesTemplate() {
//       return `
//       <h3>List Of Horses</h3>
//       <div id="horses"></div>
//       `;
//     }
  
//     static formTemplate() {
//       return `
//       <h3>Create Horse</h3>
//       <form id="form">
//         <div class="input-field">
//           <label for="name">Name</label>
//           <input type="text" name="name" id="name" />
//         </div>
//         <div class="input-field">
//           <label for="stable">Stable</label>
//           <input type="text" name="stable" id="stable" />  
//           <div class="input-field">
//           <label for="location">location</label><br />
//           <input type="text" name="location" id="location" />
//         </div>
//         <input type="submit" value="Create Horse" />
//       </form>
//       `;
//     }
  
//     static editFormTemplate(horse) {
//       return `
//       <h3>Edit Horse</h3>
//       <form id="form" data-id="${horse.id}">
//         <div class="input-field">
//           <label for="name">Name</label>
//           <input type="text" name="name" id="name" value="${horse.name}" />
//         </div>
//         <input type="submit" value="Edit Horse" />
//       </form>
//       `;
//     }
  
//     /** renders **/
  
//     static renderForm() {
//       resetMain();
//       main().innerHTML = Horse.formTemplate();
//       form().addEventListener("submit", Horse.submitForm);
//     }
  
//     static renderEditForm(horse) {
//       resetMain();
//       main().innerHTML = Horse.editFormTemplate(horse);
//       form().addEventListener("submit", Horse.submitEditForm);
//     }
  
//     static renderHorses() {
//       resetMain();
//       main().innerHTML = Horse.horsesTemplate();
    
//       Horse.all.forEach(horse => horse.render());
//     }
  
//     static editHorse(e) {
//       e.preventDefault();
//       const id = e.target.dataset.id;
      
//       const horse = Horse.all.find(function(horse) {
//         return horse.id == id;
//       })
    
//       Horse.renderEditForm(horse)
//     }
  
//     static submitForm(e) {
//       e.preventDefault();
    
//       let strongParams = {
//         horse: {
//           name: nameInput().value,
//           stable_attributes: stableInput().value
//         }
//       }
    
//       // send data to the backend via a post request
//       Api.post('/horses', strongParams)
//         .then(function(data) {
//           Horse.create(data);
//           Horse.renderHorses();
//         })
//     }
  
//     static submitEditForm(e) {
//       e.preventDefault();
    
//       let strongParams = {
//         horse: {
//           name: nameInput().value,
//         }
//       }
    
//       const id = e.target.dataset.id;
      
//       Api.patch("/horses/" + id, strongParams)
//         .then(function(data) {
//           // selects the horse out of the array
//           let h = Horse.all.find((h) => h.id == data.id);
      
//           // gets the index of the horse selected
//           let idx = Horse.all.indexOf(h);
      
//           // updates the index value with the newly updated horse
//           Horse.all[idx] = new Horse(data);
          
//           // renders the array of horses to page
//           Horse.renderHorses();
//         })
    
//     }
  
//     static async getHorses() {
//       // fetch to the rails api, horses index. Grab the horses
//       // populate the main div with the horses
    
//       const data = await Api.get("/horses");
      
//       Horses.createFromCollection(data)
//       Horses.renderHorses();
//     }
  
//     static async deleteHorse(e) {
//       e.preventDefault();
    
//       let id = e.target.dataset.id;
    
//       const data = await Api.delete(Api.baseUrl + "/horses/" + id);
    
//       Horse.all = Horse.all.filter(function(horse){
//         return horse.id !== horse.id;
//       })
    
//       Horse.renderHorses();
//     }
//   }
 