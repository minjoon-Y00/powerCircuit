class PowerCircuit {
	constructor() {
		this.ns = [];
		this.es = [];
	}

	initNode() {
		this.ns.push({id: 0, marked: false, lv: 0});
		this.es = [];
	}

	setPower2(power2) {
		console.log(power2);
	}

	setDecimal(decimal) {
		console.log(decimal);
	}

	parse(pow2) {
		// 2^(2^(2+1))
		// 2^2^2

		this.initNode();
		if (pow2 === '0') {

		}
		else if (pow2 === '1') {
			this.ns.push({id: 1, marked: true, lv: 1});
			this.es.push({origin: this.ns[1], terminus: this.ns[0], left: false, right: true});
		}
		else if (pow2 === '2') {
			this.ns.push({id: 1, marked: false, lv: 1});
			this.ns.push({id: 2, marked: true, lv: 2});
			this.es.push({origin: this.ns[1], terminus: this.ns[0], left: false, right: true});
			this.es.push({origin: this.ns[2], terminus: this.ns[1], left: false, right: true});
		}

		const dec = pow2;
		return dec;
	}

	getPow2(dec) {

	}

	getNodeEdge() {
		return {ns: this.ns, es: this.es};
	}
}