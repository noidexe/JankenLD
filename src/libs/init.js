//(function () {

//  Create your Phaser game and inject it into the gameContainer div.
//  We did it in a window.onload event, but you can do it anywhere (requireJS load, 
//anonymous function, jQuery dom ready, - whatever floats your boat)
var game;

function initPhaser(renderer) {
    document.removeEventListener('mousedown', selectRenderer);
    var click2canvas = document.getElementById('gameContainer');
    click2canvas.parentNode.removeChild(click2canvas);
    
    game = new Phaser.Game(800,450, renderer || Phaser.AUTO, '');

    game.persistent = {
        numdeaths : 0,  //how many times has the character died
        curLvl : 1, //Current Level. Starts with lvl 1
        totalLvls: 9, //Total amount of levels. 
        lvlTime: 0 //Time to finish the level 
    };

    //  You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
    game.state.add('Game', Janken.Game);

    //  Now start the Boot state.
    game.state.start('Game');
}

function selectRenderer(e) {
    initPhaser(Phaser.CANVAS);
    clearTimeout(timer);
}

document.addEventListener('mousedown', selectRenderer);
var timer = window.setTimeout(initPhaser, 10 /*1500*/);
//}());
