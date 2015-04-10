import $ from 'jquery';
import {Element} from './element';

export class Attribute extends Element {
	get attrValue() {
		return this.$el.attr(this.attrName);
	}

	constructor(el, attributeName) {
		super(el);
	}
}

export function attribute(selector) {
	return function(target, name, descriptor) {
		if (typeof target !== 'function') {
			throw new Error(`@attribute decorator is only available for constructors`);
		}

		var constructor = target;

		$(`[${selector}]`).each(function() {
			constructor.prototype.attrName = selector;

			var attribute = new constructor(this);
		});
	}
}
