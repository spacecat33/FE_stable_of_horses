function resetFormInputs() { //if had multiple forms then recommend moving this to Horse class.
    nameInput().value = "";
    ("in reset form inputs function in index.js")
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
      Horse.renderHorses();
    });
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    // Horse.gethorses();
    console.log("in document.addeventlistener function in index.js")
    Horse.getHorses();  //this will send an asynchronous request i.e. will fetch code but whilst waiting will carry on with other lines of code
    // console.log("d")
    // renderForm();
    formLinkEvent();
    horsesLinkEvent();
  });
  