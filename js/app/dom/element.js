import $ from 'jquery';
import {Scope} from '../utils/scope';

/**
 * Represents an HTML element
 *
 * @class Element
 * @extends Scope
 */
export class Element extends Scope {
	/**
	 * @constructor
	 * @param el
	 */
	constructor(el) {
		super(el);

		this.bindEvents();
	}

	/**
	 * binds all events which are defined in the events property
	 */
	bindEvents() {
		if (!this.events) {
			return;
		}

		for (var event in this.events) {
			let methods = this.events[event];

			for (var i = 0, ln = methods.length; i < ln; i++) {
				let method = methods[i];

				this.$el.on(event, $.proxy(this[method], this));
			}
		}
	}
}

/**
 * Creates an instance for each element found by the selector
 * @example
 *  @element('.my-selector')
 *  class MyClass extends Element {
 *      constructor(el) {
 *          super(el);
 *
 *          console.log(el); // output: <div class="my-selector"></div>
 *      }
 *  }
 *
 *  <div class="my-selector"></div>
 *
 * @decorator
 * @param {string} selector
 * @returns {Function}
 */
export function element(selector) {
	return function(target, name, descriptor) {
		if (typeof target !== 'function') {
			throw new Error(`@element decorator is only available for constructors`);
		}

		var constructor = target;

		$(selector).each(function() {
			new constructor(this);
		});
	}
}

/**
 * Decorates a method as an event handler
 * @example
 *  @element('.my-selector')
 *  class MyClass extends Element {
 *      @listen('click')
 *      handleClick(e) {
 *          console.log('Element was clicked!');
 *      }
 *  }
 *
 *  <div class="my-selector"></div>
 *
 *  $('.my-selector').trigger('click'); // output: Element was clicked!
 *
 * @decorator
 * @param events
 * @returns {Function}
 */
export function listen(...events) {
	return function(target, name, descriptor) {
		for (var i = 0, ln = events.length; i < ln; i++) {
			let event = events[i];

			target.events = target.events || {};
			target.events[event] = target.events[event] || [];
			target.events[event].push(name);
		}
	}
}
