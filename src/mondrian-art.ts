import { LitElement, html, css } from 'lit';
import p5 from 'p5';

export class MondrianArt extends LitElement {
	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100vw;
			height: 100vh;
			font-family: Arial, sans-serif;
			background-color: #8a9a5b;
			padding: 2rem;
			overflow: hidden;
		}

		#title-container {
			font-size: 1.5rem;
			font-weight: bold;
			margin-bottom: 1rem;
			text-align: center;
			color: #333;
			height: 50px;
			position: relative;
			z-index: 3;
		}

		#art-container {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 500px;
			height: 500px;
			margin-top: 1rem;
			position: relative;
			z-index: 1;
		}

		#bubble-container {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 500px;
			height: 500px;
			pointer-events: none;
			z-index: 4;
		}

		#button-container {
			margin-top: 1rem;
			position: relative;
			z-index: 2;
		}

		button {
			padding: 0.8rem 1.5rem;
			font-size: 1.2rem;
			background: black;
			color: white;
			border: none;
			border-radius: 8px;
			cursor: pointer;
			transition: 0.3s ease-in-out;
		}

		button:hover {
			background: #444;
		}
	`;

	private p5Instance: p5 | null = null;
	private p5BubbleInstance: p5 | null = null;

	constructor() {
		super();
		this.redrawArt = this.redrawArt.bind(this);
	}

	firstUpdated() {
		this.initP5();
		this.initP5Bubbles();
		this.startTitleTypingEffect();
		window.addEventListener('resize', this.redrawArt);
	}

	disconnectedCallback() {
		window.removeEventListener('resize', this.redrawArt);
		this.p5Instance?.remove();
		this.p5BubbleInstance?.remove();
		super.disconnectedCallback();
	}

	// Initialize Mondrian Artwork
	initP5() {
		if (this.p5Instance) {
			this.p5Instance.remove();
		}

		const sketch = (p: p5) => {
			p.setup = () => {
				const container = this.shadowRoot?.querySelector('#art-container');
				if (container) {
					const canvasSize = Math.min(500, window.innerWidth * 0.8);
					const canvas = p
						.createCanvas(canvasSize, canvasSize)
						.parent(container);
					canvas.elt.style.visibility = 'visible';
					canvas.elt.style.opacity = '1';
					this.drawMondrian(p);
				}
			};
		};

		this.p5Instance = new p5(sketch);
	}

	// Define `drawMondrian()` 
	private drawMondrian(p: p5) {
		p.clear();
		p.background(255);
		let cols = [0, p.width];
		let rows = [0, p.height];

		for (let i = 0; i < 5; i++) {
			cols.push(p.random(50, p.width - 50));
			rows.push(p.random(50, p.height - 50));
		}

		cols.sort((a, b) => a - b);
		rows.sort((a, b) => a - b);

		const colors = [
			p.color(255, 0, 0),
			p.color(0, 0, 255),
			p.color(255, 255, 0),
			p.color(255),
			p.color(0, 0, 0),
			p.color(150, 150, 150),
			p.color(255, 165, 0),
			p.color(0, 255, 127),
		];

		for (let i = 0; i < cols.length - 1; i++) {
			for (let j = 0; j < rows.length - 1; j++) {
				let x = cols[i];
				let y = rows[j];
				let w = cols[i + 1] - x;
				let h = rows[j + 1] - y;

				p.fill(
					p.random() > 0.4
						? colors[Math.floor(p.random(colors.length))]
						: p.color(255)
				);
				p.rect(x, y, w, h);
			}
		}

		p.strokeWeight(12);
		p.stroke(0);
		p.noFill();
		p.rect(0, 0, p.width, p.height);
	}

	// Ensure Redrawing Works 
	redrawArt() {
		if (this.p5Instance) {
			this.p5Instance.remove();
			this.p5Instance = null;
		}
		this.initP5();
	}

	// Typing Effect for Title 
	startTitleTypingEffect() {
		let textContent = 'Mondrian Art Generator';
		let displayedText = '';
		let textIndex = 0;
		let speed = 100;
		let resetDelay = 2000;
		const titleElement = this.shadowRoot?.querySelector('#title-container');

		if (!titleElement) return;

		const typeText = () => {
			if (textIndex < textContent.length) {
				displayedText += textContent[textIndex];
				(titleElement as HTMLElement).innerText = displayedText;
				textIndex++;
				setTimeout(typeText, speed);
			} else {
				// Wait 2 seconds and restart
				setTimeout(() => {
					displayedText = '';
					textIndex = 0;
					typeText();
				}, resetDelay);
			}
		};

		typeText();
	}

	// Bubbles Effect Over Artwork 
	initP5Bubbles() {
		if (this.p5BubbleInstance) {
			this.p5BubbleInstance.remove();
		}

		const sketch = (p: p5) => {
			let bubbles: {
				x: number;
				y: number;
				size: number;
				alpha: number;
				color: p5.Color;
			}[] = [];

			// Mondrian color palette
			const colors = [
				p.color(255, 0, 0), // Red
				p.color(0, 0, 255), // Blue
				p.color(255, 255, 0), // Yellow
				p.color(0, 0, 0), // Black
				p.color(150, 150, 150), // Gray
				p.color(255, 165, 0), // Orange
				p.color(0, 255, 127), // Greenish
			];

			p.setup = () => {
				const container = this.shadowRoot?.querySelector('#bubble-container');
				if (container) {
					const canvas = p.createCanvas(500, 500);
					canvas.parent(container);
					canvas.elt.style.visibility = 'visible';
					canvas.elt.style.opacity = '1';
					p.clear();
				}
			};

			p.draw = () => {
				p.clear();
				for (let i = bubbles.length - 1; i >= 0; i--) {
					let bubble = bubbles[i];
					//  Use stored color for bubbles
					p.fill(
						p.red(bubble.color),
						p.green(bubble.color),
						p.blue(bubble.color),
						bubble.alpha
					);
					p.noStroke();
					p.ellipse(bubble.x, bubble.y, bubble.size);
					bubble.y -= 1;
					bubble.alpha -= 3;
					if (bubble.alpha <= 0) {
						bubbles.splice(i, 1);
					}
				}
			};

			const button = this.shadowRoot?.querySelector('button');
			if (button) {
				button.addEventListener('click', () => {
					this.redrawArt(); // Redraw Work of Art
					for (let i = 0; i < 10; i++) {
						// Select a random color from the Mondrian palette
						const randomColor = colors[Math.floor(p.random(colors.length))];

						bubbles.push({
							x: p.random(100, 400),
							y: p.random(350, 500),
							size: p.random(10, 30),
							alpha: 255,
							color: randomColor, // Store color
						});
					}
				});
			}
		};

		this.p5BubbleInstance = new p5(sketch);
	}

	render() {
		return html`
			<h1 id="title-container"></h1>
			<div id="art-container"></div>
			<div id="bubble-container"></div>
			<div id="button-container">
				<button>Regenerate Art</button>
			</div>
		`;
	}
}

customElements.define('mondrian-art', MondrianArt);
