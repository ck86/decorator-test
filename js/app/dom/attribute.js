import $ from 'jquery';
import {Element} from './element';

/**
 * Representing an element based on an attribute
 *
 * @class Attribute
 * @extends Element
 */
export class Attribute extends Element {
	/**
	 * Value of the attribute
	 * @type {string}
	 */
	get attrValue() {
		return this.$el.attr(this.attrName);
	}

	/**
	 * constructor
	 * @param el
	 * @param attributeName
	 */
	constructor(el) {
		super(el);
	}
}

/**
 * Creates an instance for each element found by the attribute selector
 * @example
 *  @element('my-attribute')
 *  class MyClass extends Attribute {
 *      constructor(el) {
 *          super(el);
 *
 *          console.log(el); // output: <div my-attribute="my-attribute-value"></div>
 *          console.log(this.attrValue); // output: my-attribute-value
 *      }
 *  }
 *
 *  <div my-attribute="my-attribute-value"></div>
 *
 * @decorator
 * @param {string} selector
 * @returns {Function}
 */
export function attribute(selector) {
	return function(target, name, descriptor) {
		if (typeof target !== 'function') {
			throw new Error(`@attribute decorator is only available for constructors`);
		}

		var constructor = target;

		$(`[${selector}]`).each(function() {
			constructor.prototype.attrName = selector;

			new constructor(this);
		});
	}
}
