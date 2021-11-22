var cards = ['2','3','4','5','6','7','8','9','10','A','K','Q','J'];
var cardsMap = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]};
var isStand = false;
var turnsOver = false;
var win = 0;
var loss = 0;
var draw = 0;
var YOU = {
    'score': 0,
    'box': '#yourBox',
    'result': '#yourBlackJackResult'
}
var DEALER = {
    'score': 0,
    'box': '#dealerBox',
    'result': '#dealerBlackJackResult'
}

var hitSound = new Audio('sounds/swish.m4a');
var winnigSound = new Audio('sounds/cash.mp3');
var losingSound = new Audio('sounds/aww.mp3');

document.querySelector('#jackHitButton').addEventListener('click',blackJackHit);

function blackJackHit(){
    if(isStand == false){
        showCard(YOU);
    }
}

function showCard(PLAYER){
    if(PLAYER['score']<21){
        var yourImage = document.createElement('img');
        var randomCard = cards[Math.floor(Math.random()*13)];
        console.log(randomCard);
        // console.log(typeof(randomCard));
        yourImage.src = 'images/' + randomCard + '.png';
        document.querySelector(PLAYER['box']).appendChild(yourImage);
        hitSound.play();  
        updateScore(PLAYER, randomCard); 
    }
}

document.querySelector('#jackDealButton').addEventListener('click',blackJackDeal);

function blackJackDeal(){
    if(turnsOver == true){
        var yourImageArray = document.querySelector(YOU['box']).querySelectorAll('img');
        for(i=0; i<yourImageArray.length; i++){
            yourImageArray[i].remove();
        }
        YOU['score'] = 0;
        document.querySelector(YOU['result']).textContent = 0;
        document.querySelector(YOU['result']).style.color = 'white';
        var dealerImageArray = document.querySelector(DEALER['box']).querySelectorAll('img');
        for(i=0; i<dealerImageArray.length; i++){
            dealerImageArray[i].remove();
        }
        DEALER['score'] = 0;
        document.querySelector(DEALER['result']).textContent = 0;
        document.querySelector(DEALER['result']).style.color = 'white';
        document.querySelector('#blackJackResult').textContent = "Let's play";
        document.querySelector('#blackJackResult').style.color = 'Black';   
    } 
    turnsOver = false;
    isStand = false;
}

function updateScore(PLAYER, randomCard){
    // console.log(cardsMap[randomCard]);
    if(randomCard=='A'){
        if(PLAYER['score']<=10){
            PLAYER['score'] += 11;
        }else{
            PLAYER['score'] += 1;
        }
        document.querySelector(PLAYER['result']).textContent = PLAYER['score'];
    }else{
        PLAYER['score'] += cardsMap[randomCard];
        if(PLAYER['score']>21){
            document.querySelector(PLAYER['result']).textContent = 'BUST!';
            document.querySelector(PLAYER['result']).style.color = 'red';  
        }else{
            document.querySelector(PLAYER['result']).textContent = PLAYER['score'];
        }
    }
}

document.querySelector('#jackStandButton').addEventListener('click',blackJackStand);

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackJackStand(){
    isStand = true;
    while(DEALER['score'] < 16){
        showCard(DEALER);
        await sleep(1000);
    }
    decideWinner();
    turnsOver = true;
}

function decideWinner(){
    var winner;
    if(YOU['score'] <= 21){
        if(DEALER['score'] < YOU['score'] || DEALER['score'] > 21){
            document.querySelector('#blackJackResult').textContent = 'You Won!';
            document.querySelector('#blackJackResult').style.color = 'Green';
            winner = YOU;
        }else if(YOU['score'] < DEALER['score']){
            document.querySelector('#blackJackResult').textContent = 'You Lost!';
            document.querySelector('#blackJackResult').style.color = 'Red';
            winner = DEALER;
        }else if(YOU['score'] == DEALER['score']){
            document.querySelector('#blackJackResult').textContent = 'You Drew!';
            document.querySelector('#blackJackResult').style.color = 'Yellow';
            winner = 'No one';
        }
    } 
    if(YOU['score'] > 21){
        if(DEALER['score'] > 21){
            document.querySelector('#blackJackResult').textContent = 'You Drew!';
            document.querySelector('#blackJackResult').style.color = 'Yellow';
            winner = 'No one';
        }else{
            document.querySelector('#blackJackResult').textContent = 'You Lost!';
            document.querySelector('#blackJackResult').style.color = 'Red';
            winner = DEALER;
        }
    }
    if(winner == YOU){
        winnigSound.play();
        win++;
        document.querySelector('#wins').textContent = win;
    }else if( winner == DEALER){
        losingSound.play();
        loss++;
        document.querySelector('#losses').textContent = loss;
    }else{
        draw++;
        document.querySelector('#draws').textContent = draw;
    }
}
