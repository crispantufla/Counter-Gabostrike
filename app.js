document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('.player');
    const gameDisplay = document.querySelector('.game-container');

    let playerLeft = 120;
    let playerBotton = 60;
    let gravity = 1.5;
    let isGameOver = false;

    function startGame() {
        if (playerBotton > -3) playerBotton -= gravity;
        player.style.bottom = playerBotton + 'px';
        player.style.left = playerLeft + 'px';
    }
    let gametimerId = setInterval(startGame, 20)

    const enemysInScreen = []

    function generateEnemy() {
        let enemyLeft = 1200;
        let enemyBottom = 150;
        const enemy = document.createElement('div');
        if (!isGameOver) enemy.classList.add('enemy');
        gameDisplay.appendChild(enemy);
        enemy.style.left = enemyLeft + 'px';
        enemy.style.bottom = enemyBottom + 'px';
        enemysInScreen.push(enemy);

        function moveEnemy() {
            enemyLeft -= 2;
            enemy.style.left = enemyLeft + 'px';

            if (enemyLeft === -60) {
                clearInterval(timerId);
                gameDisplay.removeChild(enemy);
            }
            
            if (enemyLeft < 170 && enemyLeft > 60 && playerBotton < 80) {
                gameOver();
                clearInterval(timerId);
            }

            if (!enemysInScreen.includes(enemy)) clearInterval(timerId);
        }
        let timerId = setInterval(moveEnemy, 20);
        if (!isGameOver) {
            setTimeout(generateEnemy, 3000)
        }
    }
    generateEnemy();

    const bulletInScreen = []

    function shoot() {
        if (bulletInScreen.length == 5) {
            console.log("hola")
            //ruido de arma vacia poner aqui
            return
        }
        let bulletLeft = playerLeft + 50;
        let bulletBottom = playerBotton + 180;
        const bullet = document.createElement('div');
        if (!isGameOver) bullet.classList.add('bullet');
        gameDisplay.appendChild(bullet);
        bulletInScreen.push(bullet);

        function moveBullet() {
            bulletLeft += 2;
            bullet.style.left = bulletLeft + 'px';
            if (bulletBottom < 145) {
                clearInterval(moveBulletInterval);
                bulletExplode(bullet)
            } 
            bulletBottom -= 0.1;
            bullet.style.bottom = bulletBottom + 'px';

            if (enemysInScreen.length > 0) {
                let actualBullet = parseInt(bullet.style.left);
                let actualBulletBottom = parseInt(bullet.style.bottom);
                let actualEnemy = parseInt(enemysInScreen[0].style.left);
                let actualEnemyBottom = parseInt(enemysInScreen[0].style.bottom);
                if (actualBullet - 15 > actualEnemy - 30 && actualBullet < actualEnemy + 30 &&  actualBulletBottom < actualEnemyBottom + 110) {
                    clearInterval(moveBulletInterval);
                    bulletExplode(bullet);
                    gameDisplay.removeChild(enemysInScreen[0]);
                    enemysInScreen.shift();
                }
            }
        }
        let moveBulletInterval = setInterval(moveBullet, 20);
    }
    document.addEventListener('click', shoot);

    function bulletExplode(bullet) {
        const boom = document.createElement('div');
        boom.classList.add('boom');
        gameDisplay.appendChild(boom);
        boom.style.left = bullet.style.left;
        boom.style.bottom = bullet.style.bottom;
        setTimeout(()=> gameDisplay.removeChild(boom), 300);
        bulletInScreen.shift();
        gameDisplay.removeChild(bullet);
    }
    
    function jump(e) {
        if (e.keyCode === 32) {
            if (playerBotton < 0) playerBotton += 180 
            player.style.bottom = playerBotton + 'px';
        }
    }
    document.addEventListener('keyup', jump);

    function gameOver() {
        clearInterval(gametimerId);
        isGameOver = true;
        document.removeEventListener('keyup', jump);
        console.log("game over");
    }
})