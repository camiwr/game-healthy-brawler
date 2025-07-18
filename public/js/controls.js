const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    space: { pressed: false, hold: false },
    h: { pressed: false, hold: false }
};

window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    switch (key) {
        case "w":
        case "arrowup":
            keys.w.pressed = true;
            player.lastKeyPressed = "w";
            break;
        case "a":
        case "arrowleft":
            keys.a.pressed = true;
            player.lastKeyPressed = "a";
            break;
        case "s":
        case "arrowdown":
            keys.s.pressed = true;
            player.lastKeyPressed = "s";
            break;
        case "d":
        case "arrowright":
            keys.d.pressed = true;
            player.lastKeyPressed = "d";
            break;
        case " ":
        case "z":
            keys.space.pressed = true;
            break;
        case "h":
            keys.h.pressed = true;
            break;
    }
});

window.addEventListener("keyup", e => {
    const key = e.key.toLowerCase();

    switch (key) {
        case "w":
        case "arrowup":
            keys.w.pressed = false;
            break;
        case "a":
        case "arrowleft":
            keys.a.pressed = false;
            break;
        case "s":
        case "arrowdown":
            keys.s.pressed = false;
            break;
        case "d":
        case "arrowright":
            keys.d.pressed = false;
            break;
        case " ":
        case "z":
            keys.space.pressed = false;
            keys.space.hold = false;
            break;
        case "h":
            keys.h.pressed = false;
            keys.h.hold = false;
            break;
    }
});

function handleControls() {
    if (jogoTravado) return;
    const speed = 3.4;
    player.velocity.x = 0;
    player.velocity.y = 0;

    let moving = false;

    if (player.isAttacking) return;

    if (keys.w.pressed) {
        player.velocity.y = -speed;
        player.facing = "up";
        player.setSprite("walk_up");
        moving = true;
    } else if (keys.s.pressed) {
        player.velocity.y = speed;
        player.facing = "down";
        player.setSprite("walk_down");
        moving = true;
    }

    if (keys.a.pressed) {
        player.velocity.x = -speed;
        player.facing = "left";
        player.setSprite("walk_left");
        moving = true;
    }
    if (keys.d.pressed) {
        player.velocity.x = speed;
        player.facing = "right";
        player.setSprite("walk_right");
        moving = true;
    }

     // 🧱 Impede que o jogador ultrapasse os limites do mapa
    const frameWidth = player.image.width / player.totalSpriteFrames;
    const playerWidth = frameWidth * player.scale;
    const playerHeight = player.image.height * player.scale;

    const MAP_LEFT = 0;
    const MAP_RIGHT = MAP_WIDTH;
    const MAP_TOP = MAP_Y_MIN || 0;
    const MAP_BOTTOM = MAP_Y_MAX || canvas.height - playerHeight;

    // Bordas horizontais
    if (player.position.x + player.velocity.x < MAP_LEFT) {
        player.velocity.x = 0;
    }
    if (player.position.x + playerWidth + player.velocity.x > MAP_RIGHT) {
        player.velocity.x = 0;
    }

    // Bordas verticais
    if (player.position.y + player.velocity.y < MAP_TOP) {
        player.velocity.y = 0;
    }
    if (player.position.y + playerHeight + player.velocity.y > MAP_BOTTOM) {
        player.velocity.y = 0;
    }

    // Atualiza câmera lateral
    cameraOffsetX = player.position.x - canvas.width / 2;
    cameraOffsetX = Math.max(0, Math.min(cameraOffsetX, MAP_WIDTH - canvas.width));

    // Idle se não estiver andando
    if (!moving) {
        const idleDirection = player.facing || "down";
        player.setSprite(`idle_${idleDirection}`);
    }

    // 🎯 Disparo
    if (keys.space.pressed && !keys.space.hold) {
        keys.space.hold = true;

        const direction = player.facing || "right";

        const velocity = {
            x: direction === "left" ? -1 : direction === "right" ? 1 : 0,
            y: direction === "up" ? -1 : direction === "down" ? 1 : 0
        };

        const fireballWidth = 6;
        const fireballHeight = 6;

        let x = player.position.x + player.width / 8 - fireballWidth / 4;
        let y = player.position.y + player.height / 6 - fireballHeight / 4;

        const fireball = new Projectile({
            position: { x, y },
            velocity
        });

        projectiles.push(fireball);
        console.log("🔥 Projétil criado:", fireball);
    }

    // Simula dano manual
    if (keys.h.pressed && !keys.h.hold) {
        simularDano();
        keys.h.hold = true;
    }
}
