/* ~~~~~~~~~~~~ Counter Logic ~~~~~~~~~~~~ */
const createNumberSlot = values => `
	<div class="horizontalLines">
		<div class="line ${values[0] ? "visible" : ""}"></div>
		<div class="line ${values[1] ? "visible" : ""}"></div>
		<div class="line ${values[2] ? "visible" : ""}"></div>
	</div>
	<div class="verticalLeftLines">
		<div class="line ${values[3] ? "visible" : ""}"></div>
		<div class="line ${values[4] ? "visible" : ""}"></div>
	</div>
	<div class="verticalRightLines">
		<div class="line ${values[5] ? "visible" : ""}"></div>
		<div class="line ${values[6] ? "visible" : ""}"></div>
	</div>
`;

const numberToSlotValues = {
	0: [1, 0, 1, 1, 1, 1, 1],
	1: [0, 0, 0, 0, 0, 1, 1],
	2: [1, 1, 1, 0, 1, 1, 0],
	3: [1, 1, 1, 0, 0, 1, 1],
	4: [0, 1, 0, 1, 0, 1, 1],
	5: [1, 1, 1, 1, 0, 0, 1],
	6: [1, 1, 1, 1, 1, 0, 1],
	7: [1, 0, 0, 0, 0, 1, 1],
	8: [1, 1, 1, 1, 1, 1, 1],
	9: [1, 1, 1, 1, 0, 1, 1],
};

const strToSlotValues = str => {
	let index = parseInt(str);

	if (isNaN(index) || index < 0 || index > 9) index = 0;

	return numberToSlotValues[index];
};

let aiPaddle, player, ball;
let slot1, slot2, slot3, slot4, aiCounter = 0, playerCounter = 0;

const resetGame = () => {
	aiCounter     = 0;
	playerCounter = 0;
	
	ball?.resetPosition();
	player?.resetPosition();
	aiPaddle?.resetPosition();
	
	updateAICounter();
	updatePlayerCounter();
};

const updateCounter = (leftSlot, rightSlot, counter = 0) => {
	if (counter >= 99) {
		resetGame();
	}

	const addZeroIfNeeded = str => (str + "").length === 1 ? "0" + str : str + "";

	const [left, right] = addZeroIfNeeded(counter);

	leftSlot.innerHTML  = createNumberSlot(strToSlotValues(left));
	rightSlot.innerHTML = createNumberSlot(strToSlotValues(right));
};

const updateAICounter     = () => updateCounter(slot1, slot2, aiCounter);
const updatePlayerCounter = () => updateCounter(slot3, slot4, playerCounter);

window.addEventListener("load", () => {
	slot1 = document.querySelector(".numberSlot0");
	slot2 = document.querySelector(".numberSlot1");
	slot3 = document.querySelector(".numberSlot2");
	slot4 = document.querySelector(".numberSlot3");

	updateAICounter();
	updatePlayerCounter();
});

/* ~~~~~~~~~~~~ Game Logic ~~~~~~~~~~~~ */

const Vector2        = (x = 0, y = x) => ({ x, y });
const paddlesPadding = 30;
const randomIVector2 = () => Vector2(Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1);

const areColliding = (position1, size1, position2, size2) => {
	const origin1 = Vector2(position1.x + (size1.x / 2), position1.y + (size1.y / 2));
	const origin2 = Vector2(position2.x + (size2.x / 2), position2.y + (size2.y / 2));

	const distanceX = Math.abs(origin1.x - origin2.x);
	const distanceY = Math.abs(origin1.y - origin2.y);

	const intersectX = distanceX < ((size1.x / 2) + (size2.x));
	const intersectY = distanceY < ((size1.y / 2) + (size2.y));

	return intersectX && intersectY;
}

class Paddle {
	constructor(positionX = 0) {
		this.speed     = 6;
		this.size      = Vector2(13, 75);
		this.position  = Vector2(positionX, (height / 2) - (this.size.y / 2));
	}

	resetPosition() {
		this.position.y = (height / 2) - (this.size.y / 2);
	}

	limitMovement() {
		const topLimit    = 0;
		const bottomLimit = height - this.size.y;

		if (this.position.y < topLimit) this.position.y    = topLimit;
		if (this.position.y > bottomLimit) this.position.y = bottomLimit;
	}
}

class Player extends Paddle {
	constructor() {
		super();

		this.position.x = width - paddlesPadding - this.size.x;
		this.direction  = 0;
	}

	update() {
		this.position.y += this.speed * this.direction;

		this.limitMovement();
	}

	render () {
		fill(255);
		rect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

class AIPaddle extends Paddle {
	constructor() {
		super(paddlesPadding);
	}

	update() {
		if (ball.position.y > this.position.y) this.position.y += this.speed;
		if (ball.position.y < this.position.y) this.position.y -= this.speed;

		this.limitMovement();
	}

	render() {
		fill(255);
		rect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

class Ball {
	constructor() {
		this.size      = 15;
		this.speed     = 6;
		this.direction = randomIVector2();
		this.position  = Vector2(width / 2, height / 2);
	}

	resetPosition() {
		this.position.x = width / 2;
		this.position.y = height / 2;
		this.direction  = randomIVector2();
	}

	update() {
		this.position.x += this.speed * this.direction.x;
		this.position.y += this.speed * this.direction.y;

		if (this.position.x < 0) {
			playerCounter++;
			updatePlayerCounter();

			return this.resetPosition();
		}

		if (this.position.x > width) {
			aiCounter++;
			updateAICounter();

			return this.resetPosition();
		}

		let collitionDetected = this.position.x < (width / 2)
			? areColliding(this.position, Vector2(this.size), aiPaddle.position, aiPaddle.size)
			: areColliding(this.position, Vector2(this.size), player.position, player.size);

		if (collitionDetected) this.direction.x *= -1;

		if (this.position.y < 0 || this.position.y > height) {
			this.direction.y *= -1;
		}
	}

	render () {
		fill(255);
		ellipse(this.position.x, this.position.y, this.size);
	}
}


function setup() {
	createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);

	ball     = new Ball();
	aiPaddle = new AIPaddle();
	player   = new Player();
}

function draw() {
	background(0);

	ball.update();
	ball.render();

	aiPaddle.update();
	aiPaddle.render();

	player.update();
	player.render();
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		player.direction = -1;
	} else if (keyCode === DOWN_ARROW) {
		player.direction = 1;
	} else {
		player.direction = 0;
	}
}

function keyReleased() {
	if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
		player.direction = 0;
	}
}
