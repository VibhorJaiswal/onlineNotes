// console.log('scriptForMsg.js');

//To check if user have loged in or not...........
function checkUser(){
    if(localStorage.getItem('id') == null){

        window.location.assign('/');
    }else{
        loadMsg();
    }
}



function addNote() {
    let title = document.getElementById('title').value;
    let note = document.getElementById('note').value;
    let d = new Date().toLocaleString();

    fetch('/addnote', {

        method: 'POST',

        body: JSON.stringify({
            id: localStorage.getItem('id'),
            userTitle: title,
            userNote: note,
            time: d
        }),

        headers: {
            'Content-type': 'application/json'
        }
    }).then((res) => {
        return res.text();
    }).then((data) => {
        if (data == false) {
            document.getElementById('msginfo').style = 'color: red'
            document.getElementById('msginfo').innerHTML = 'Cannot add note'
        } else {
            localStorage.setItem('message', data);
            
            document.getElementById('note').value = '';
            document.getElementById('title').value = '';
            loadMsg();
        }
    })
}

//To load msg in html............
function loadMsg() {
    let html = "";
    let messages = JSON.parse(localStorage.getItem('message'));

    if (messages.length == 0) {
        document.getElementById('noteArea').innerHTML = `<div style="color: green; font-size: larger;">Let's start with your first note......</div>`
    }
    else {

        messages.forEach((element, index) => {

            html += `
        <div class="card my-2 mx-4" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${element.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted" style="font-size: xx-small;">${element.dateAndTime}</h6>
          <p class="card-text" style="font-family: 'Roboto', sans-serif;">${element.note}</p>
          <button type="button" class="btn btn-danger" id='${index}' onclick="delSelection(this.id)">Delete</button>        
        </div>
      </div>`
        });

        document.getElementById('noteArea').innerHTML = html;
    }
}


//To delete selected note..........
function delSelection(index) {

    let messages = JSON.parse(localStorage.getItem('message'));
    // console.log(messages[index]);
    fetch('/api/del', {

        method: 'POST',

        body: JSON.stringify({
            id: localStorage.getItem('id'),
            note: messages[index].note,
            title: messages[index].title,
            time: messages[index].dateAndTime
        }),

        headers: {
            'Content-type': 'application/json'
        }
    }).then((res) => {
        return res.text();
    }).then((data) => {
        localStorage.setItem('message', data);
        loadMsg();
    });
}