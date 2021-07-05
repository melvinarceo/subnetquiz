'use strict';

const ipAddDisplay = document.getElementById('ip-add-mask');

const subnetAddInput = document.getElementById('subnet-add-input');
const broadcastAddInput = document.getElementById('broadcast-add-input');
const subnetMaskInput = document.getElementById('subnet-mask-input');
const firstValidIpInput = document.getElementById('first-valid-ip-input');
const lastValidIpInput = document.getElementById('last-valid-ip-input');

const subnetAddShow = document.getElementById('subnet-add');
const broadcastAddShow = document.getElementById('broadcast-add');
const subnetMaskShow = document.getElementById('subnet-mask');
const firstValidIpShow = document.getElementById('first-valid-ip');
const lastValidIpShow = document.getElementById('last-valid-ip');

// ------------------ Label persistence when an input is detected ---------------------- //
// Using Event Delegation

document.querySelector('.ip-address__answers').addEventListener('input', function(e){
    e.preventDefault();

    if(e.target.classList.contains('ip-address__answers--input')){
        const id = e.target.getAttribute('href')
        document.querySelector(`${id}`).classList.remove('correct-answer');
        document.querySelector(`${id}`).classList.add('unhide');
    }
});

// -------------------- IP Address Generator -------------------- //


const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const ipAddGenerator = function(){
    let octetArr;
    let subnetMaskSlash;

    while (true) {
        octetArr = []
        for (let i=0; i<4; i++){
            const octetGenerator = random(1,256);
            octetArr.push(octetGenerator)
        }

        if (octetArr[0] >= 1 && octetArr[0] <= 126) {
            subnetMaskSlash = random(8, 31);
            break;
        } else if (octetArr[0] === 127) {
            continue;
        } else if (octetArr[0] >= 128 && octetArr[0] <= 191) {
            subnetMaskSlash = random(16, 31);
            break;
        } else if (octetArr[0] === 169 && octetArr[1] === 254){
            continue;
        } else if (octetArr[0] >= 192 && octetArr[0] <= 223) {
            subnetMaskSlash = random(24, 31);
            break;
        } else {
            continue;
        }
    } return [octetArr, subnetMaskSlash] ;
} 

const octetArr = ipAddGenerator()[0]; 
const subnetMaskSlash = ipAddGenerator()[1]; 


const displayOctets = [...octetArr].join('.') + ' /' + subnetMaskSlash;
ipAddDisplay.textContent = displayOctets;

// ------------------- Function to Get the Mask --------------------- //
const getMap = function(k){
    const octetMap = new Map([
        [1, 128],
        [2, 192],
        [3, 224],
        [4, 240],
        [5, 248],
        [6, 252],
        [7, 254],
        [8, 255] 
    ]);
    return octetMap.get(k)
}

// ------------------- Function to Get the Increment -------------------- //

const getincrementMap = function(k){
    const incrementMap = new Map([
        [1, 128],
        [2, 64],
        [3, 32],
        [4, 16],
        [5, 8],
        [6, 4],
        [7, 2],
        [8, 1]
    ]);
    return incrementMap.get(k)
}

// -------------------- Function to Calculate the Subnet Add -------------------- //
const subnetAddFunction = function(octetNum, k){
    let increment = getincrementMap(k)
    let q = Math.floor(octetArr[octetNum] / increment)
    let subnetOctet = q * increment
    return subnetOctet
}

// -------------------- Function To Calculate the Broadcast Add ------------------ //
const broadcastAddFunction = function(octetNum, k){
    let increment = getincrementMap(k)
    let broadcastOctet = ((subnetAddFunction(octetNum, k)) + increment) - 1
    return broadcastOctet
}

// -------------------- IP Address Parameters Calculations ----------------- //

let subnetAdd, broadcastAdd, subnetMaskLong, firstValidIP, lastValidIP 

if (subnetMaskSlash === 8) {
    subnetAdd = `${octetArr[0]}.0.0.0`;
    broadcastAdd = `${octetArr[0]}.255.255.255`;
    subnetMaskLong = '255.0.0.0';
    firstValidIP = `${octetArr[0]}.0.0.1`;
    lastValidIP = `${octetArr[0]}.255.255.254`;
} else if (subnetMaskSlash > 8 && subnetMaskSlash <16) {
    const k = subnetMaskSlash - 8;
    subnetAdd = `${octetArr[0]}.${subnetAddFunction(1, k)}.0.0`;
    broadcastAdd = `${octetArr[0]}.${broadcastAddFunction(1, k)}.255.255`;
    subnetMaskLong = `255.${getMap(k)}.0.0`;
    firstValidIP = `${octetArr[0]}.${subnetAddFunction(1, k)}.0.1`;
    lastValidIP = `${octetArr[0]}.${broadcastAddFunction(1, k)}.255.254`;
} else if (subnetMaskSlash === 16) {
    subnetAdd = `${octetArr[0]}.${octetArr[1]}.0.0`;
    broadcastAdd = `${octetArr[0]}.${octetArr[1]}.255.255`;
    subnetMaskLong = '255.255.0.0'; 
    firstValidIP = `${octetArr[0]}.${octetArr[1]}.0.1`;
    lastValidIP = `${octetArr[0]}.${octetArr[1]}.255.254`;
} else if (subnetMaskSlash > 16 && subnetMaskSlash <24) {
    const k = subnetMaskSlash - 16;
    subnetAdd = `${octetArr[0]}.${octetArr[1]}.${subnetAddFunction(2, k)}.0`;
    broadcastAdd = `${octetArr[0]}.${octetArr[1]}.${broadcastAddFunction(2, k)}.255`;
    subnetMaskLong = `255.255.${getMap(k)}.0`;
    firstValidIP = `${octetArr[0]}.${octetArr[1]}.${subnetAddFunction(2, k)}.1`;
    lastValidIP = `${octetArr[0]}.${octetArr[1]}.${broadcastAddFunction(2, k)}.254`;
} else if (subnetMaskSlash === 24) {
    subnetAdd = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.0`;
    broadcastAdd = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.255`;
    subnetMaskLong = '255.255.255.0';
    firstValidIP = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.1`;
    lastValidIP = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.254`;
} else if (subnetMaskSlash > 24) {
    const k = subnetMaskSlash - 24;
    subnetAdd = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.${subnetAddFunction(3, k)}`
    broadcastAdd = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.${broadcastAddFunction(3, k)}`;
    subnetMaskLong = `255.255.255.${getMap(k)}`;
    firstValidIP = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.${subnetAddFunction(3, k) + 1}`
    lastValidIP = `${octetArr[0]}.${octetArr[1]}.${octetArr[2]}.${broadcastAddFunction(3, k) - 1}`;
}

const btnCheck = document.querySelector('.btn-check');
const answersShow = document.querySelectorAll('.ip-address__answers--input')
const btnNext = document.querySelector('.btn-next');

const revealAnswer = () => {
    for(let input of answersShow) { 
        input.nextElementSibling.classList.remove('correct-answer')
        input.nextElementSibling.classList.add('unhide')
    }
    subnetAddShow.textContent = subnetAdd
    broadcastAddShow.textContent = broadcastAdd
    subnetMaskShow.textContent = subnetMaskLong
    firstValidIpShow.textContent = firstValidIP
    lastValidIpShow.textContent = lastValidIP

    const correctArr = [subnetAdd, broadcastAdd, subnetMaskLong, firstValidIP, lastValidIP]
    const studentAnswerArr = [subnetAddInput, broadcastAddInput, subnetMaskInput, firstValidIpInput, lastValidIpInput]
    
    for (let i = 0; i < 5; i++) {
        if (studentAnswerArr[i].value !== correctArr[i]) {
            studentAnswerArr[i].style.backgroundColor = '#FF616D';
            studentAnswerArr[i].style.color = 'white';
        } else {
            studentAnswerArr[i].style.backgroundColor = '#66DE93';
        }
    }
    
}
btnCheck.addEventListener('click', revealAnswer);
btnNext.addEventListener('click', function(e) { 
    e.preventDefault();
    location.reload();
});