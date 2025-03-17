export class CounterComponent extends HTMLElement {
	unit = 'day';
	end = new Date();
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });
		const wrapper = document.createElement('div')
		wrapper.appendChild(document.createElement('p'));
		wrapper.appendChild(document.createElement('p'));
		wrapper.appendChild(document.createElement('p'));
		wrapper.appendChild(document.createElement('p'));
		shadowRoot.appendChild(wrapper);
		const style = document.createElement('style');
		style.textContent = `
					div {
						font-family: "Red Hat Text", sans-serif;
						display: grid;
						grid-template-rows: 100%;
						grid-template-rows: 100%;
						gap: 0;
						width: 140px;
						height: 148px;
						box-shadow: 0 10px 0px 0px #1a1a24;
						mask:
						radial-gradient(circle at 100% 50%, transparent 10px, red 10px),
						radial-gradient(circle at 0% 50%, transparent 10px, red 10px);
						mask-composite: intersect;
						perspective: 10cm;
						perspective-origin: top;
						--rot: 0deg;
					}
					p {
					transform-style: preserve-3d;
					grid-column: 1;
					grid-row: 1;
					font-size: 64px;
					font-weight: 700;
					color: #fd5c85;
					font-optical-sizing: auto;
					margin: 0;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #34364f;
					transform-origin: 0 50%;
					transition: rotate .3s ease-in-out;
					backface-visibility: hidden;
					}
					p:nth-child(3) ,
					p:nth-child(1) {
						mask: linear-gradient(to bottom, transparent 50%, red 50%);
						border-radius: 0 0 12px 12px;
					}
					p:nth-child(2) ,
					p:nth-child(4) {
						border-radius: 12px 12px 0 0;
						mask: linear-gradient(to bottom, red 50%, transparent 50%);
						filter: brightness(0.85);
					}
					p:nth-child(1) {
						rotate: x 0deg;
						order: 7;
					}
					p:nth-child(2) {
						rotate: x calc(var(--rot) + 0deg);
						order: 10;
					}
					p:nth-child(3) {
						rotate: x calc(var(--rot) - 180deg);
						order: 11;
					}
					p:nth-child(4) {
						rotate: x 0deg;
						order: 6;
					}
					`;
		shadowRoot.appendChild(style);
	}
	connectedCallback() {
		this.unit = this.getAttribute('unit') || 'second';
		this.end = new Date(this.getAttribute('end'));
		this.rot = 0;
		const formattedValue = this.getValue().toString().padStart(2, '0');
		const nextFormattedValue = (1 + this.getValue()).toString().padStart(2, '0');
		this.shadowRoot.querySelector('p:nth-child(1)').innerText = formattedValue;
		this.shadowRoot.querySelector('p:nth-child(2)').innerText = formattedValue;
		this.shadowRoot.querySelector('p:nth-child(3)').innerText = nextFormattedValue;
		this.shadowRoot.querySelector('p:nth-child(4)').innerText = nextFormattedValue;
		this.interval = setInterval(() => {
			this.shadowRoot.querySelector('div').style.setProperty('--rot', `${this.rot}deg`);
			this.rot -= 180;
			const formattedValue = this.getValue().toString().padStart(2, '0');
			this.shadowRoot.querySelectorAll('p').forEach(elm => elm.innerText = formattedValue);
		}, 1000);
	}
	disconnectedCallback() {
		clearInterval(this.interval);
	}
	getValue = () => {
		const diff = Math.ceil((this.end - new Date()) / 1000);
		const DAY = 24 * 60 * 60;
		const HOUR = 60 * 60;
		const MINUTE = 60;
		const day = Math.floor(diff / DAY);
		const hour = Math.floor((diff - DAY * day) / HOUR);
		const minute = Math.floor((diff - DAY * day - HOUR * hour) / MINUTE);
		const second = diff - DAY * day - HOUR * hour - MINUTE * minute;
		return {
			day, hour, minute, second
		}[this.unit];
	}
}

