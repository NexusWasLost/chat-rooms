let nickname = document.querySelector('.nicknameInp');
let roomId = document.querySelector('.roomid');
let mainForm = document.querySelector('.mainForm');
let hostbtn = document.querySelector('.hostButton');
let joinbtn = document.querySelector('.joinButton');

hostbtn.addEventListener('click', (e) =>{
    roomId.value = '';
    
    if(!nickname.value){
        e.preventDefault();
        alert("Nickname is required !");
        return;
    }
})

joinbtn.addEventListener('click', (e) =>{
    if(!nickname.value){
        e.preventDefault();
        alert("Nickname is required !");
        return;
    }

    if(!roomId.value){
        e.preventDefault();
        alert("Room is required !");
        return;
    }
})