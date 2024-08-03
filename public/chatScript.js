let globalAvatar;
let globalNickname;
let globalRoomId;
let socket;

async function getAndSetInfo() {
    let response = await fetch('/info');
    response = await response.json();

    document.querySelector('.user').innerText = response.nickname;
    document.querySelector('.r_id').innerText = response.roomId;

    globalNickname = response.nickname;
    globalRoomId = response.roomId;

    //instantiate the object only after the required data is fetched
    socket = io({
        query: {

            //send handshake query parameters
            roomId: globalRoomId,
            nickname: globalNickname
        }
    });

    //after socket initialization intialize the even listeners
    initializeSocketEventListeners();
}
getAndSetInfo();

async function getAvatar() {
    const randomSeed = Math.floor(Math.random() * 1000000);
    let avatar = await fetch(`https://api.dicebear.com/9.x/thumbs/svg?seed=${randomSeed}`);
    avatar = await avatar.text();
    globalAvatar = avatar;

    let profilePic = document.querySelector('.profilePic');
    profilePic.innerHTML = avatar;

    return globalAvatar;
}

(async () => {
    const avatar = await getAvatar();
})();

let messageArea = document.querySelector('.msg-area');
let subForm = document.querySelector('.sendForm');
let input = document.querySelector('.inp');

//appends incoming messages to display them
function append(message, position, avatar) {
    let msgParentDiv = document.createElement('div');
    msgParentDiv.classList.add('message');
    msgParentDiv.classList.add(position);

    if (avatar) {
        let avatarSVG = document.createElement('svg');
        avatarSVG.innerHTML = avatar;
        const childSVG = avatarSVG.firstElementChild;
        childSVG.style.width = '30px';
        childSVG.style.height = '30px';
        childSVG.style.borderRadius = '50%';
        childSVG.style.marginRight = '15px';

        msgParentDiv.appendChild(avatarSVG);
    }

    let newMsg = document.createElement('p');
    newMsg.innerText = message;
    msgParentDiv.appendChild(newMsg);

    messageArea.appendChild(msgParentDiv);
}

function scrollToBottom() {
    const chatContainer = document.querySelector('.msg-area');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const copyBtn = document.querySelector('.cpyBtn');
copyBtn.addEventListener('click', () =>{

    // Get the text input element
    const textToCopy = document.querySelector('.r_id').innerText;
    console.log(textToCopy);
    
    // Copy the text
    navigator.clipboard.writeText(textToCopy);
    copyBtn.innerText = 'Copied';

    setInterval( () =>{ copyBtn.innerText = 'Copy'; }, 2000);
})

subForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        append(input.value, 'right');
        scrollToBottom();
        socket.emit('message', input.value, globalAvatar, globalNickname, globalRoomId);
        input.value = '';
    }
})

function initializeSocketEventListeners() {

    socket.on('new-user-joined', (nickname) => {
        console.log("This was executed !");
        append(`${nickname} has joined the chat`, 'left');
    })

    socket.on('message', (message, avatar) => {
        append(message, 'left', avatar);
        scrollToBottom();
    });

    socket.on('left-user', (nickname) => {
        append(`${nickname} has left the chat`, 'left');
    })
}
