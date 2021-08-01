import p5 from "p5";

/* ~~~~~~~~~~~~ Counter Logic ~~~~~~~~~~~~ */
const createNumberSlot = (values: (0 | 1)[]): string => `
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

const numberToSlotValues: Record<number, (0 | 1)[]> = {
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

const strToSlotValues = (str: string): (0 | 1)[] => {
	let index: number = parseInt(str);

	if (isNaN(index) || index < 0 || index > 9) index = 0;

	return numberToSlotValues[index];
};

let aiPaddle: AIPaddle;
let player: Player;
let ball: Ball;

let slot1: Element;
let slot2: Element;
let slot3: Element;
let slot4: Element;

let aiCounter: number = 0;
let playerCounter: number = 0;

const resetGame = () => {
	aiCounter     = 0;
	playerCounter = 0;
	
	ball?.resetPosition();
	player?.resetPosition();
	aiPaddle?.resetPosition();
	
	updateAICounter();
	updatePlayerCounter();
};

const updateCounter = (leftSlot: Element, rightSlot: Element, counter: number = 0) => {
	if (counter >= 99) {
		resetGame();
	}

	const addZeroIfNeeded: (str: string | number) => string = str => (str + "").length === 1 ? "0" + str : str + "";

	const [left, right] = addZeroIfNeeded(counter);

	leftSlot.innerHTML  = createNumberSlot(strToSlotValues(left));
	rightSlot.innerHTML = createNumberSlot(strToSlotValues(right));
};

const updateAICounter     = () => updateCounter(slot1, slot2, aiCounter);
const updatePlayerCounter = () => updateCounter(slot3, slot4, playerCounter);

window.addEventListener("load", () => {
	slot1 = document.querySelector(".numberSlot0") as Element;
	slot2 = document.querySelector(".numberSlot1") as Element;
	slot3 = document.querySelector(".numberSlot2") as Element;
	slot4 = document.querySelector(".numberSlot3") as Element;

	updateAICounter();
	updatePlayerCounter();
});

/* ~~~~~~~~~~~~ Game Logic ~~~~~~~~~~~~ */

interface Vector2 {
	x: number;
	y: number;
}

const Vector2        = (x = 0, y = x): Vector2 => ({ x, y });
const paddlesPadding = 30;
const randomIVector2 = (): Vector2 => Vector2(Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1);

const areColliding = (position1: Vector2, size1: Vector2, position2: Vector2, size2: Vector2) => {
	const origin1 = Vector2(position1.x + (size1.x / 2), position1.y + (size1.y / 2));
	const origin2 = Vector2(position2.x + (size2.x / 2), position2.y + (size2.y / 2));

	const distanceX = Math.abs(origin1.x - origin2.x);
	const distanceY = Math.abs(origin1.y - origin2.y);

	const intersectX = distanceX < ((size1.x / 2) + (size2.x));
	const intersectY = distanceY < ((size1.y / 2) + (size2.y));

	return intersectX && intersectY;
}

class Paddle {
	s: p5;
	speed: number;
	size: Vector2;
	position: Vector2;

	constructor(s: p5, positionX = 0) {
		this.s         = s;
		this.speed     = 6;
		this.size      = Vector2(13, 75);
		this.position  = Vector2(positionX, (this.s.height / 2) - (this.size.y / 2));
	}

	resetPosition() {
		this.position.y = (this.s.height / 2) - (this.size.y / 2);
	}

	limitMovement() {
		const topLimit    = 0;
		const bottomLimit = this.s.height - this.size.y;

		if (this.position.y < topLimit) this.position.y    = topLimit;
		if (this.position.y > bottomLimit) this.position.y = bottomLimit;
	}
}

class Player extends Paddle {
	direction: 0 | 1 | -1;

	constructor(s: p5) {
		super(s);

		this.position.x = this.s.width - paddlesPadding - this.size.x;
		this.direction  = 0;
	}

	update() {
		this.position.y += this.speed * this.direction;

		this.limitMovement();
	}

	render () {
		this.s.fill(255);
		this.s.rect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

class AIPaddle extends Paddle {
	constructor(s: p5) {
		super(s, paddlesPadding);
	}

	update() {
		if (ball.position.y > this.position.y) this.position.y += this.speed;
		if (ball.position.y < this.position.y) this.position.y -= this.speed;

		this.limitMovement();
	}

	render() {
		this.s.fill(255);
		this.s.rect(this.position.x, this.position.y, this.size.x, this.size.y);
	}
}

class Ball {
	s: p5;
	size: number;
	speed: number;
	direction: Vector2;
	position: Vector2;

	constructor(s: p5) {
		this.s         = s;
		this.size      = 15;
		this.speed     = 6;
		this.direction = randomIVector2();
		this.position  = Vector2(s.width / 2, s.height / 2);
	}

	resetPosition() {
		const { s } = this;

		this.position.x = s.width / 2;
		this.position.y = s.height / 2;
		this.direction  = randomIVector2();
	}

	update() {
		const { s } = this;

		this.position.x += this.speed * this.direction.x;
		this.position.y += this.speed * this.direction.y;

		if (this.position.x < 0) {
			playerCounter++;
			updatePlayerCounter();

			return this.resetPosition();
		}

		if (this.position.x > s.width) {
			aiCounter++;
			updateAICounter();

			return this.resetPosition();
		}

		let collitionDetected = this.position.x < (s.width / 2)
			? areColliding(this.position, Vector2(this.size), aiPaddle.position, aiPaddle.size)
			: areColliding(this.position, Vector2(this.size), player.position, player.size);

		if (collitionDetected) this.direction.x *= -1;

		if (this.position.y < 0 || this.position.y > s.height) {
			this.direction.y *= -1;
		}
	}

	render () {
		this.s.fill(255);
		this.s.ellipse(this.position.x, this.position.y, this.size);
	}
}

const sketch = (s: p5) => {
	s.setup = () => {
		s.createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
	
		ball     = new Ball(s);
		aiPaddle = new AIPaddle(s);
		player   = new Player(s);
	}
	
	s.draw = () => {
		s.background(0);
	
		ball.update();
		ball.render();
	
		aiPaddle.update();
		aiPaddle.render();
	
		player.update();
		player.render();
	}
	
	s.keyPressed = () => {
		if (s.keyCode === s.UP_ARROW) {
			player.direction = -1;
		} else if (s.keyCode === s.DOWN_ARROW) {
			player.direction = 1;
		} else {
			player.direction = 0;
		}
	}
	
	s.keyReleased = () => {
		if (s.keyCode === s.UP_ARROW || s.keyCode === s.DOWN_ARROW) {
			player.direction = 0;
		}
	}
};

new p5(sketch);

