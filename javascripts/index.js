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
  
      Horse.renderForm();
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
 
  




  
  async function deleteHorse(e) {
    e.preventDefault();

    let id = e.target.dataset.id;

    const resp = await fetch(baseUrl + "/horses/" + id, { //if you forget the await, it would immediately go to the next line and so will not have info from the await response to continue
      method: "DELETE" //this goes to backend controller destroy action
    })
    const data = await resp.json();

    Horse.all = Horse.all.filter(function(horse){
      return horse.id !== data.id;
    })

    Horse.renderHorses();
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
  




  

    
//alternative way to fetch - using 'async and await:
async function getHorses() {
  const resp = await fetch(baseUrl + '/horses')
  console.log("b")
  const data = await resp.json();
  console.log("c")
  // horses = data
  Horse.createFromCollection(data)
  Horse.renderHorses();
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
  
  

    document.addEventListener("DOMContentLoaded", function () {
      // Horse.gethorses();
      console.log("a")
      getHorses();  //this will send an asynchronous request i.e. will fetch code but whilst waiting will carry on with other lines of code
      console.log("d")
      // renderForm();
      formLinkEvent();
      horsesLinkEvent();
    });
  