function resetFormInputs() {
    titleInput().value = "";
    contentInput().value = "";
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
      console.log(this);
      Horse.renderHorses();
    });
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    Horse.gethorses();
    formLinkEvent();
    horsesLinkEvent();
  });