window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 720;


    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.font = '40px Bangers';
    ctx.textAlign = 'center';

    class Player {
        constructor(game) {
            this.game = game;
            // t be in the middle
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
            this.speedModifier = 5;
            this.spriteWidth = 255;
            this.spriteHeight = 255;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = 0;
            this.image = document.getElementById('bull');

        }

        restart() {
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 100;

        }

        draw(context) {
            context.drawImage(this.image,
                this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight,
                this.spriteX, this.spriteY,
                this.width, this.height)

            if (this.game.debug) {
                context.beginPath();
                // x,y, radius, start angel of radiants , end angel of radiants
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                context.beginPath();
                context.moveTo(this.collisionX, this.collisionY);
                context.lineTo(this.game.mouse.x, this.game.mouse.y);
                context.stroke();
            }


        }


        update() {

            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const angel = Math.atan2(this.dy, this.dx)

            if (angel < -2.74 || angel > 2.74) this.frameY = 6;
            else if (angel < -1.96) this.frameY = 7;
            else if (angel < -1.17) this.frameY = 0;
            else if (angel < -0.39) this.frameY = 1;
            else if (angel < 0.39) this.frameY = 2;
            else if (angel < 1.17) this.frameY = 3;
            else if (angel < 1.96) this.frameY = 4;
            else if (angel < 2.74) this.frameY = 5;

            const distance = Math.hypot(this.dy, this.dx);


            if (distance > this.speedModifier) {
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;

            }
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;

            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 100;

            // horizontal boundaries
            if (this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius;
            else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;

            // vertical boundaries
            if (this.collisionY < this.game.topMargn + this.collisionRadius) this.collisionY = this.game.topMargn + this.collisionRadius;
            else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;


            this

            this.game.obstacles.forEach(obstacle => {
                let [collision, distance, sumOfRadi, dx, dy] = this.game.checkCollision(this, obstacle);
                // let collision1 = game.checkCollision(this, obstacle)[0];
                // let distance1 = game.checkCollision(this, obstacle)[1];

                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collisionX = obstacle.collisionX + (sumOfRadi + 1) * unit_x;
                    this.collisionY = obstacle.collisionY + (sumOfRadi + 1) * unit_y;
                }

            })


        }
    }

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 40;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 70;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);

        }

        draw(context) {
            // -, -,select specefic image, -,-, 
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                this.spriteWidth, this.spriteHeight,
                this.spriteX, this.spriteY, this.width, this.height);

            if (this.game.debug) {
                context.beginPath();
                // x,y, radius, start angel of radiants , end angel of radiants
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }


        }

        update() {

        }
    }

    class Egg {
        constructor(game) {
            this.game = game;
            this.collisionRadius = 40;
            this.margin = this.collisionRadius * 2;
            this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2));
            this.collisionY = this.game.topMargn + (Math.random() * (this.game.height - this.game.topMargn - this.margin));
            this.image = document.getElementById('egg');
            this.spriteWidth = 110;
            this.spriteHeight = 135;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 5000;
            this.markedForDeletion = false;


        }

        draw(context) {
            context.drawImage(this.image, this.spriteX, this.spriteY);


            if (this.game.debug) {
                context.beginPath();
                // x,y, radius, start angel of radiants , end angel of radiants
                context.arc(this.collisionX, this.collisionY,
                    this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                const displayTimer = (this.hatchTimer * 0.001).toFixed(0);
                context.fillText(displayTimer, this.collisionX, this.collisionY, this.collisionRadius * 2.5)
            }
        }

        update(deltaTime) {
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 30;

            // collisions
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies, ...this.game.hatchlings];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadi, dx, dy] =
                    this.game.checkCollision(this, object);

                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;

                    this.collisionX = object.collisionX + (sumOfRadi + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadi + 1) * unit_y;
                }

            });

            // hatching
            if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargn) {
                this.game.hatchlings.push(new larva(this.game, this.collisionX, this.collisionY, 'yellow'));

                const jumpSound = document.getElementById('jumpSound');
                if (jumpSound && jumpSound.readyState >= 2 && !this.game.gameOver && !this.game.isMute) {
                    jumpSound.play();
                }


                this.markedForDeletion = true;
                this.game.removeGameObjects();

            } else {
                this.hatchTimer += deltaTime;
            }


        }
    }

    class larva {
        constructor(game, x, y) {
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.collisionRadius = 30;
            this.image = document.getElementById('larva');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.speedY = 1 + Math.random() * 2
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 2);
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

            if (this.game.debug) {
                context.beginPath();
                // x,y, radius, start angel of radiants , end angel of radiants
                context.arc(this.collisionX, this.collisionY,
                    this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }

        update() {
            this.collisionY -= this.speedY;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 100;

            // move to safety
            if (this.collisionY < this.game.topMargn) {
                this.markedForDeletion = true;
                this.game.removeGameObjects();
                if (!this.game.gameOver) this.game.score++;

                const reachedSound = document.getElementById('reachedSound');
                if (reachedSound && reachedSound.readyState >= 2 && !this.game.isMute) {
                    reachedSound.play();
                }

                for (let i = 0; i < 3; i++) {
                    this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'))
                }
            }

            // collision with Objects
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadi, dx, dy] =
                    this.game.checkCollision(this, object);

                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;

                    this.collisionX = object.collisionX + (sumOfRadi + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadi + 1) * unit_y;
                }

            });

            // collision with enemies
            this.game.enemies.forEach(enemy => {
                if (this.game.checkCollision(this, enemy)[0] && !this.game.gameOver) {
                    this.markedForDeletion = true;
                    this.game.removeGameObjects();
                    this.game.lostHatchlings++;

                    const eatenSound = document.getElementById('eatenSound');
                    // Check if the audio element exists and is loaded
                    if (eatenSound && eatenSound.readyState >= 2 && !this.game.isMute) {
                        // Play the sound
                        eatenSound.play();
                    }
                    for (let i = 0; i < 5; i++) {
                        this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'red'))
                    }

                }
            })
        }

    }


    class Enemy {
        constructor(game) {
            this.game = game;
            this.collisionRadius = 30;
            this.speedX = Math.random() * 3 + 0.5;
            this.image = document.getElementById('toads');
            this.spriteWidth = 140;
            this.spriteHeight = 260;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
            this.collisionY = this.game.topMargn + (Math.random() * (this.game.height - this.game.topMargn));
            this.spriteX;
            this.spriteY;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 4);


        }
        draw(context) {
            context.drawImage(this.image,
                this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight,
                this.spriteX, this.spriteY, this.width, this.height);

            if (this.game.debug) {
                context.beginPath();
                // x,y, radius, start angel of radiants , end angel of radiants
                context.arc(this.collisionX, this.collisionY,
                    this.collisionRadius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
            }
        }



        update() {
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height + 40;
            this.collisionX -= this.speedX;
            if (this.spriteX + this.width < 0 && !this.game.gameOver) {
                this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
                this.collisionY = this.game.topMargn + (Math.random() * (this.game.height - this.game.topMargn));

                this.frameY = Math.floor(Math.random() * 4);

            }


            let collisionObjects = [this.game.player, ...this.game.obstacles];
            collisionObjects.forEach(object => {
                let [collision, distance, sumOfRadi, dx, dy] =
                    this.game.checkCollision(this, object);

                if (collision) {
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;

                    this.collisionX = object.collisionX + (sumOfRadi + 1) * unit_x;
                    this.collisionY = object.collisionY + (sumOfRadi + 1) * unit_y;
                }

            })

        }

    }

    class Particle {
        constructor(game, x, y, color) {
            this.game = game;
            this.collisionX = x;
            this.collisionY = y;
            this.color = color;
            this.radius = Math.floor(Math.random() * 10 + 5);
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 2 + 0.5;
            this.angel = 0;
            this.va = Math.random() * 0.1 + 0.01;
            this.markedForDeletion = false;
        }

        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.restore();
        }
    }

    class Firefly extends Particle {

        update() {
            this.angel += this.va;
            this.collisionX += Math.cos(this.angel) * this.speedX;
            this.collisionY -= this.speedY;
            if (this.collisionY < 0 - this.radius) {
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }


        }

    }

    class Spark extends Particle {
        update() {
            this.angel += this.va * 0.5;
            this.collisionX -= Math.sin(this.angel) * this.speedX;
            this.collisionY -= Math.cos(this.angel) * this.speedY;

            if (this.radius > 0.1) this.radius -= 0.05;
            if (this.radius < 0.2) {
                this.markedForDeletion = true;
                this.game.removeGameObjects();
            }
        }

    }

    class Game {

        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargn = 260;
            this.debug = true;
            this.isMute = true;
            this.player = new Player(this);
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000 / this.fps;
            this.eggTimer = 0;
            this.eggInterval = 1000;
            this.numberOfObstacles = 10;
            this.maxEggs = 5;
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.gameObjects = [];
            this.score = 0;
            this.winningScore = 10;
            this.gameOver = false;
            this.lostHatchlings = 0;
            this.mouse = {
                x: this.width * .2,
                y: this.height * 0.5,
                pressed: false
            }


            canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;

            });

            canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;

            });

            canvas.addEventListener('mousemove', (e) => {

                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;

                }

            });
            const right = document.getElementById('r');
            const left = document.getElementById('l');
            const top = document.getElementById('t');
            const down = document.getElementById('d');

            right.addEventListener('touchstart', () => {
                this.mouse.x += 50;
                this.mouse.pressed = true;
            });

            right.addEventListener('touchend', () => {
                this.mouse.x +=  50;
                this.mouse.pressed = false;
            });
        

            left.addEventListener('touchstart', () => {
                this.mouse.x -= 100 ;
                this.mouse.pressed = true;
            });

            left.addEventListener('touchend', () => {
                this.mouse.x -= 100;
                this.mouse.pressed = false;
            });
        

            top.addEventListener('touchstart', () => {
                this.mouse.y -= 50;
                this.mouse.pressed = true;
            });

            top.addEventListener('touchend', () => {
                this.mouse.y -=  50;
                this.mouse.pressed = false;
            });
        

            down.addEventListener('touchstart', () => {
                this.mouse.y += 50;
                this.mouse.pressed = true;
            });

            down.addEventListener('touchend', () => {
                this.mouse.y += 50;
                this.mouse.pressed = false;
            });
        
            

            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();

                const touch = e.touches[0];
                console.log('ttsss', touch);

                if (touch) {
                    this.mouse.x = touch.clientX;
                    this.mouse.y = touch.clientY;
                    this.mouse.pressed = true;
                }
            });

            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();

                const touch = e.touches[0];
                console.log('tteee', touch);

                if (touch) {
                    this.mouse.x = touch.clientX;
                    this.mouse.y = touch.clientY;
                    this.mouse.pressed = false;
                }

            });


            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();

                const touch = e.touches[0];
                if (touch) {
                    const rect = canvas.getBoundingClientRect();

                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;

                    if (this.mouse.pressed) {
                        this.mouse.x = x;
                        this.mouse.y = y;
                    }
                }
            });


            window.addEventListener('keydown', (e) => {
                if (e.key == 'd') this.debug = !this.debug;
                else if (e.key == 'r') this.restart();
            });


            let lastTouch = 0;
            const doubleTapDelay = 300; // Adjust the delay (in milliseconds) for your double-tap detection

            canvas.addEventListener('touchstart', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTouch;

                if (tapLength < doubleTapDelay && tapLength > 0) {
                    // This is a double-tap event
                    // Handle the double-tap event here
                    this.restart();
                    e.preventDefault(); // Prevent the default touchstart behavior
                }

                lastTouch = currentTime;
            })

        }
        render(context, deltaTime) {
            if (this.timer > this.interval) {
                context.clearRect(0, 0, this.width, this.height);

                this.gameObjects = [this.player, ...this.eggs, ...this.obstacles,
                ...this.enemies, ...this.hatchlings, ...this.particles];

                // sort by vertical position
                this.gameObjects.sort((a, b) => {
                    return a.collisionY - b.collisionY
                });

                this.gameObjects.forEach(object => {
                    object.draw(context)
                    object.update(deltaTime);
                });

                this.timer = 0;

            }
            this.timer += deltaTime;

            // add eggs periodically
            if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver) {
                this.addEgg();
                this.eggTimer = 0;
            } else {
                this.eggTimer += deltaTime;
            }

            // draw status text
            context.save();
            context.textAlign = 'left';
            context.fillText('Score: ' + this.score, 25, 50);

            if (this.debug) {
                context.fillText('Lost: ' + this.lostHatchlings, 25, 100);
            }

            context.restore();

            // win / lose message
            if (this.score >= this.winningScore || this.lostHatchlings === 5) {
                this.gameOver = true;
                context.save();
                context.fillStyle = 'rgba(0,0,0,0.5)';
                context.fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowColor = 'black';
                let message1;
                let message2;
                let overImage;
                let gameOverSound;



                if (this.lostHatchlings < 5) {
                    message1 = "Bullseye!!"
                    message2 = "You bullied the bullies!!!"
                    overImage = document.getElementById('win');
                    gameOverSound = document.getElementById('winSound');
                } else {
                    message1 = "Bullocks!!"
                    message2 = "You lost " + this.lostHatchlings + " hatchlings, don't be a pushover. Press 'R' or double touch to try again";
                    overImage = document.getElementById('toad')
                    gameOverSound = document.getElementById('loseSound');

                }

                if (gameOverSound && gameOverSound.readyState >= 2 && !this.isMute) {
                    // Play the sound
                    gameOverSound.play();
                }

                context.font = '130px Bangers';
                context.drawImage(overImage, 150, 150);
                context.fillText(message1, this.width * 0.5, this.height * 0.5 - 20);
                context.font = '40px Bangers';
                context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
                // context.drawImage(overImage, 150, 150 );
                context.fillText("Final Score " + this.score + ". Press 'R'  or double click to but heads again!", this.width * 0.5, this.height * 0.5 + 80);

                context.restore();
            }

        }

        checkCollision(a, b) {
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            const sumOfRadi = a.collisionRadius + b.collisionRadius;
            return [(distance < sumOfRadi), distance, sumOfRadi, dx, dy];


        }


        addEgg() {
            this.eggs.push(new Egg(this))
        }


        addEnemy() {
            this.enemies.push(new Enemy(this));
        }

        removeGameObjects() {
            this.eggs = this.eggs.filter(object => !object.markedForDeletion)
            this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion)
            this.particles = this.particles.filter(object => !object.markedForDeletion)
        }

        restart() {
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            };
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.init();

        }

        init() {
            const backgroundSound = document.getElementById('backgroundSound');
            // Check if the audio element exists and is loaded
            if (backgroundSound && backgroundSound.readyState >= 2 && !this.gameOver && !this.isMute) {
                backgroundSound.play();
            }

            const isMuteBtn = document.getElementById('muteButton');

            const muteBtn = `<span class="material-symbols-outlined muteButton"  id="muteButton"> volume_off </span>`
            const unMuteBtn = `<span class="material-symbols-outlined muteButton"  id="muteButton"> volume_up </span>`

            const addMuteIcon = () => {
                if (this.isMute) {
                    isMuteBtn.innerHTML = muteBtn;
                } else {
                    isMuteBtn.innerHTML = unMuteBtn;
                }

            }

            addMuteIcon();


            isMuteBtn.addEventListener('click', () => {
                this.isMute = !this.isMute;
                addMuteIcon();
                backgroundSound.muted = this.isMute;
                eatenSound.muted = this.isMute;
                reachedSound.muted = this.isMute;
                winSound.muted = this.isMute;
                loseSound.muted = this.isMute;
                jumpSound.muted = this.isMute;

            })

            // backgroundSound.muted = this.isMute;

            for (let i = 0; i < 8; i++) {
                this.addEnemy();

            }

            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles
                && attempts < 500) {
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 150;
                    const sumOfRadi = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
                    if (distance < sumOfRadi) {
                        overlap = true;
                    }

                });
                const margin = testObstacle.collisionRadius * 3;
                if (!overlap &&
                    testObstacle.spriteX > 0 &&
                    testObstacle.spriteX < this.width - testObstacle.width &&
                    testObstacle.collisionY > this.topMargn + margin &&
                    testObstacle.collisionY < this.height - margin

                ) {
                    this.obstacles.push(testObstacle);
                }
                attempts++;

            }

        }
    }


    const game = new Game(canvas);
    game.init();

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.render(ctx, deltaTime);

        window.requestAnimationFrame(animate);
    }

    animate(0);
})