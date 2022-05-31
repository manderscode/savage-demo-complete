var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");

Array.from(thumbUp).forEach(function(element) { //loop through and make sure every thumbs up is clickable - this line takes our nodelist and turns it into an array, we look through and we add a click event to each one
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText //"this" = the object of the event - whatever we clicked on to initate the action
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', { //when the user clicks on thumbs up, we want to make requests to the server side - fetch is the only way we've learned so far on how to talk to API's
          method: 'put', //we make a put request 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true) //what we are using to refresh the page - once we're done with thumbs up, we wouldn't be able to see unless it was refreshed/a new get request was sent from the server side
        })
      });
});
//THUMBS DOWN// 
Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('messagesDown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbDown
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText // grabbing the values and applying the method of delete
        const msg = this.parentNode.parentNode.childNodes[3].innerText // "this" = whatever your event listener is targetting - this = whatever was clicked 
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
