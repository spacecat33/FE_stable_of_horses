// Model js folder to encapsulate the data

class Stable {
  static all = [] //static means 'class level'

  constructor(attr) {
    this.id = attr.id;
    this.name = attr.name;
    // this.horses_attributes = attr.horses_attributes; //fix this
    // this.horses = attr.horses;
    // console.log ("in the constructors section")
  }

  render() {
    console.log("render")
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

    editLink.addEventListener("click", Stable.editHorse); //adding eventlistener when the linkloads (not when the page loads)
    
    deleteLink.addEventListener("click", Stable.deleteHorse)
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
    console.log("end of render")
    // console.log ("in render function in horse.js - rendering page with event listeners and buttons etc)")
  }

/** STATIC FUNCTIONS **/

  //this pushes the instance of object
  save() {
    console.log("save")
    Stable.all.push(this) 
  }  


  //creates instance
  static create(attr) {
    // debugger;
    console.log("create")
    let stable = new Stable(attr);
    stable.save();
    console.log ("in the create(attr) function, used it to create new stable and saved it")
    return stable
    }

  //get into collection, create all horse objects and store them
  static createFromCollection(collection) {
    console.log ("in the createfromcollection function - collected data from fetch and iterated over it to create js models")
   collection.forEach(data => Stable.create(data)) //the data then get passed up to the static create function, creates a new instance which then takes us higher up to the contructor function  which will then go to save and push the new instance into array which returns the object
  }






  /** Templates **/

  static horsesTemplate() {
    return `
    <h3>List Of Horses</h3>
    <div id="horses"></div>
    `;
  }

  static stablesTemplate() {
    console.log("stablesTemplate")
    return `
    <h3>List Of Stables</h3>
    <div id="stables"></div>
    `;
  }

  static formTemplate() {
    console.log("formTemplate")
    return `
    <h3>Create Stable and horse</h3>
    <form id="form">
      <div class="input-field">
        <label for="name"> Stable Name</label>
        <input type="text" name="name" id="name" />
      </div>
      <div class="input-field">
        <label for="horse">Horse name</label>
        <input type="text" name="horse" id="horse" />
      </div>
      <input type="submit" value="Create Stable" />
    </form>
    `;
  }

  static editFormTemplate(stable) {
    return `
    <h3>Edit Stable</h3>
    <form id="form" data-id="${stable.id}"> 
      <div class="input-field">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" value="${stable.name}" />
      </div>
      <input type="submit" value="Edit Stable" />
    </form>
    `;
  } //the data-id with stable.id interpolated let's grab the form plus the specific id. This is needed for the request.


  /** renders **/

  static renderForm() {
    console.log("renderForm function")
    resetMain();
    main().innerHTML = Stable.formTemplate();
    form().addEventListener("submit", Stable.submitForm);
  }


  static renderEditForm(stable) {
    resetMain(); // reset the main div/clear it out
    main().innerHTML = Stable.editFormTemplate(stable); //display the form with the horse's information included in the fields
    form().addEventListener("submit", Stable.submitEditForm); // when click on submiteditform, takes us to submiteditform function
  }

  static renderHorses() {
    resetMain();
    main().innerHTML= Stable.stablesTemplate(); 
    console.log ("in the renderhorses function - uses stablesTemplate")
    Stable.all.forEach(horse => horse.render()); //instance method
  }



  static editHorse(e) {
    e.preventDefault();
    
    const id = e.target.dataset.id;
  
    const stable = Stable.all.find(function(stable) {
      return stable.id == id;
    })
  
    Stable.renderEditForm(stable)
  }


  static submitForm(e) {
    e.preventDefault();
    console.log("submitForm")
    debugger;
    let strongParams = {
      stable: {
        name: nameInput().value,
        // horse: horseInput().value, //fix this
        horses_attributes: {name: horseInput().value} //this ensures the horse ul displays
      }
    }
    debugger;
    // send data to the backend via a post request
    Api.post("/stables", strongParams)
      .then(function(data) {
        Stable.create(data);
        Stable.renderHorses();
      })
  }



  static submitEditForm(e) {
    e.preventDefault();
    console.log("submitEditForm")
    let strongParams = {
      stable: {
        name: nameInput().value,
        horses_attributes: {name: horseInput().value} //fix this
      }
    }
    const id = e.target.dataset.id;

    Api.patch("/stables/" + id, strongParams)
      .then(function(data) {
        //selects the horse out of the array
      let h = Stable.all.find((h) => h.id == data.id) // this code and below updates the frontend object to match the updated backend object (which was just updates with code above)
      
      // gets the index of the selected horse
      let idx = Stable.all.indexOf(h);

      //updates the index value with the newly updated horse but note that the id is the same
      Stable.all[idx] = new Stable(data); // this takes the old object and updates it 
      
      //renders the array of horses to page
      Stable.renderHorses();
    })
}


static async getHorses() { //new
  //fetch to the rails api, horses index. Grab the horses
  // populate the main div with the horses
  const stables = await Api.get("/stables/");
  console.log ("in the getHorses function - successfully fetched data")
  debugger;
  // const h4 = document.querySelector('h4');
    stables.map(stable => {
      const div = document.createElement ('div')
      const h3 = document.createElement ('h3');
        h3.innerText = stable.name;
        
      div.appendChild(h3);
        // console.warn(stable.name) // add method here 
      stable.horses.map(horse => {
        const li = document.createElement('li');
        li.innerText = horse.name
        div.appendChild(li);
        console.log(horse.name) // add method here 
    })
    main().appendChild(div);

  })
  Stable.createFromCollection(stables)
  Stable.horses;
}


static async deleteHorse(e) {
  e.preventDefault();
  console.log("deleteHorses")
  let id = e.target.dataset.id;

  const data = await Api.delete("/stables/" + id); //if you forget the await, it would immediately go to the next line and so will not have info from the await response to continue
  //this goes to backend controller destroy action
  Stable.all = Stable.all.filter(function(stable){
    return stable.id !== data.id;
  })

  Stable.renderHorses();
}

}