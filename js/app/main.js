import {bindable} from './utils/scope';
import {Element, element, listen} from './dom/element';
import {Attribute, attribute} from './dom/attribute';

@bindable('counter', 1)
@element('.js-element-first')
class ElementFirst extends Element {
	@listen('click')
	onClick(e) {
		this.counter++;
	}
}

@element('.js-element-second')
class ElementSecond extends Element {
	counter = 'STATIC';

	@listen('click')
	onClick(e) {
		e.stopPropagation();

		var $span = this.$el.find('> span');

		$span.text(parseInt($span.text(), 10) + 1);
	}
}

@attribute('js-text')
class Text extends Attribute {
	constructor(el) {
		super(el);

		this.update();
	}

	update() {
		let value = this.getScopeValue(this.attrValue);

		this.$el.text(value);
	}

	onScopeValueChanged(newValue, oldValue, name) {
		super.onScopeValueChanged(newValue, oldValue, name);

		if (this.attrValue === name) {
			this.update();
		}
	}
}

@attribute('js-input')
class Input extends Attribute {
	constructor(el) {
		super(el);

		this.update();
	}

	update() {
		let value = this.getScopeValue(this.attrValue);

		this.$el.val(value);
	}

	onScopeValueChanged(newValue, oldValue, name) {
		super.onScopeValueChanged(newValue, oldValue, name);

		if (this.attrValue === name) {
			this.update();
		}
	}

	@listen('change', 'keyup')
	onChange() {
		this.setScopeValue(this.attrValue, this.$el.val());
	}
}
