// main.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 800 }, debug: false }
    },
    scene: { preload, create, update }
  };
  
  const game = new Phaser.Game(config);
  
  let lizard, cursors, lanes = [200, 400, 600], laneIndex = 1;
  
  function preload() {
    this.load.image('lizard', 'assets/lizard.png');
    this.load.image('bg', 'assets/background.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.audio('coinSound', 'assets/coin.mp3');
    this.load.audio('jumpSound', 'assets/jump.mp3');
    this.load.audio('gameOverSound', 'assets/gameover.mp3');

  }

  function hitObstacle(lizard, obstacle) {
  this.physics.pause();
  lizard.setTint(0xff0000);
  this.sound.play('gameOverSound');

  this.add.text(300, 250, 'Game Over', { fontSize: '40px', fill: '#fff' });
}


  
 function create() {
  this.bg = this.add.tileSprite(400, 300, 800, 600, 'bg');

  // Create lizard first
  lizard = this.physics.add.sprite(lanes[laneIndex], 500, 'lizard').setScale(0.5);
  lizard.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  // Score
  this.score = 0;
  this.scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '24px',
    fill: '#fff'
  });

  // Obstacles
  this.obstacles = this.physics.add.group();
  this.time.addEvent({
    delay: 1500,
    callback: addObstacle,
    callbackScope: this,
    loop: true
  });
  this.physics.add.collider(lizard, this.obstacles, hitObstacle, null, this);

  // Coins
  this.coins = this.physics.add.group();
  this.time.addEvent({
    delay: 2000,
    callback: addCoin,
    callbackScope: this,
    loop: true
  });
  this.physics.add.overlap(lizard, this.coins, collectCoin, null, this);
}


function addCoin() {
  const randomLane = Phaser.Math.Between(0, 2);
  const x = lanes[randomLane];
  const coin = this.coins.create(x, -50, 'coin').setScale(0.5);
  coin.setVelocityY(200);
}

function collectCoin(lizard, coin) {
  coin.destroy();
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score);
  
  // Play coin sound
  this.sound.play('coinSound');
}



function addObstacle() {
  const randomLane = Phaser.Math.Between(0, 2);
  const x = lanes[randomLane];
  const obstacle = this.obstacles.create(x, -50, 'obstacle').setScale(0.5);
  obstacle.setVelocityY(200);
  obstacle.setImmovable(true);
}

function hitObstacle(lizard, obstacle) {
  this.physics.pause();
  lizard.setTint(0xff0000);
  // Optional: show "Game Over" text
  this.add.text(300, 250, 'Game Over', { fontSize: '40px', fill: '#fff' });
}
  
  function update() {
    this.bg.tilePositionY -= 5;
  
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && laneIndex > 0) {
      laneIndex--;
      lizard.x = lanes[laneIndex];
    }
    if (Phaser.Input.Keyboard.JustDown(cursors.right) && laneIndex < 2) {
      laneIndex++;
      lizard.x = lanes[laneIndex];
    }
  
    if (cursors.up.isDown && lizard.body.touching.down) {
      lizard.setVelocityY(-400);
    }
  
    // Move obstacles, check collisions...
    this.obstacles.children.iterate(function (child) {
  if (child && child.y > 650) {
    child.destroy();
  }
});

if (cursors.up.isDown && lizard.body.touching.down) {
  lizard.setVelocityY(-400);
  this.sound.play('jumpSound');
}


  }
  