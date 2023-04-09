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
  
  document.addEventListener("DOMContentLoaded", function () {
    // Horse.gethorses();
    console.log("a")
    Horse.getHorses();  //this will send an asynchronous request i.e. will fetch code but whilst waiting will carry on with other lines of code
    console.log("d")
    // renderForm();
    formLinkEvent();
    horsesLinkEvent();
  });
  