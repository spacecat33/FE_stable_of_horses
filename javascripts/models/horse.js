// Model js folder to encapsulate the data

class Horse {
  static all = [] //static means 'class level'

  constructor(attr) {
    this.id = attr.id;
    this.name = attr.name;
    this.stable = attr.stable;
    // console.log ("in the constructors section")
  }

  render() {
    // console.log(horse)
    // debugger
    let div = document.createElement("div");
    let h4 = document.createElement("h4");
    let itsStable = document.createElement('p');
    // let neighbours = document.createElement('p');
    let h1 = document.createElement("h1");
    let deleteLink = document.createElement("a");
    let editLink = document.createElement("a");
    // let horsesDiv = document.getElementById("horses");
    let stablesDiv = document.getElementById("stables");
    // const h4 = document.querySelector('h4');
   
      // h5.innerHTML = stable.name;
      // h5.appendChild(h1);
    
    editLink.dataset.id = this.id;
    editLink.setAttribute("href", "#")
    editLink.innerText = "Edit"

    deleteLink.dataset.id = this.id;
    deleteLink.setAttribute("href", "#")
    deleteLink.innerText = "Delete"

    editLink.addEventListener("click", Horse.editHorse); //adding eventlistener when the linkloads (not when the page loads)
    
    deleteLink.addEventListener("click", Horse.deleteHorse)
    // debugger //is the pry of javascript
   
    h4.innerText = this.name;
    // itsStable.innerText = `is boarded at ${stable}`;
    // h1.innerText = stables.horse.name // needs to show horse names 
    // neighbours.innerText = `along with these other horses ${this.stable.horse}`
    

    //the following is code for making them show up on page
    div.appendChild(h4);
    div.appendChild(itsStable);
    div.appendChild(editLink);
    div.appendChild(deleteLink);
    div.appendChild(h1);
  
    // horsesDiv.appendChild(div);
    // console.log ("listing horses")

    stablesDiv.appendChild(div);
    // console.log ("listing stables")

    // console.log ("in render function in horse.js - rendering page with event listeners and buttons etc)")
  }

/** STATIC FUNCTIONS **/

  //this pushes the instance of object
  save() {
    Horse.all.push(this) 
  }  


  //creates instance
  static create(attr) {
    let horse = new Horse(attr);
    horse.save();
    // console.log ("in the create(attr) function, used it to create new horse and saved it")
    return horse;
  }

  //get into collection, create all horse objects and store them
  static createFromCollection(collection) {
    // console.log ("in the createfromcollection function - collected data from fetch and iterated over it to create js models")
   collection.forEach(data => Horse.create(data)) //the data then get passed up to the static create function, creates a new instance which then takes us higher up to the contructor function  which will then go to save and push the new instance into array which returns the object
  }






  /** Templates **/

  static horsesTemplate() {
    return `
    <h3>List Of Horses</h3>
    <div id="horses"></div>
    `;
  }

  static stablesTemplate() {
    return `
    <h3>List Of Stables</h3>
    <div id="stables"></div>
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
    main().innerHTML= Horse.stablesTemplate(); 
    console.log ("in the renderhorses function - uses horsesTemplate and then shows the list of horses")
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
    Api.post("/horses", strongParams)
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
      }
    }
    const id = e.target.dataset.id;

    Api.patch("/horses/" + id, strongParams)
      .then(function(data) {
        //selects the horse out of the array
      let h = Horse.all.find((h) => h.id == data.id) // this code and below updates the frontend object to match the updated backend object (which was just updates with code above)
      
      // gets the index of the selected horse
      let idx = Horse.all.indexOf(h);

      //updates the index value with the newly updated horse but note that the id is the same
      Horse.all[idx] = new Horse(data); // this takes the old object and updates it 
      
      //renders the array of horses to page
      Horse.renderHorses();
    })
}


static async getHorses() { //new
  //fetch to the rails api, horses index. Grab the horses
  // populate the main div with the horses
  const stables = await Api.get("/stables");
  console.log ("in the getHorses function - successfully fetched data")
  // debugger;
  // const h4 = document.querySelector('h4');
    stables.map(stable => {
      const div = document.createElement ('div')
      const h1 = document.createElement ('h1');
        h1.innerText = stable.name;
        
      div.appendChild(h1);
        // console.warn(stable.name) // add method here 
      stable.horses.map(horse => {
        const p = document.createElement('p');
        p.innerText = horse.name
        div.appendChild(p);
        // console.log(horse.name) // add method here 
    })
    main().appendChild(div);

  })
  // Horse.createFromCollection(stables)
  // Horse.renderHorses();
}


static async deleteHorse(e) {
  e.preventDefault();

  let id = e.target.dataset.id;

  const data = await Api.delete("/horses/" + id); //if you forget the await, it would immediately go to the next line and so will not have info from the await response to continue
  //this goes to backend controller destroy action
  Horse.all = Horse.all.filter(function(horse){
    return horse.id !== data.id;
  })

  Horse.renderHorses();
}

}