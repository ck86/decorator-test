import $ from 'jquery';
import {Scope} from '../utils/scope';

export class Element extends Scope {
	constructor(el) {
		super(el);

		this.bindEvents();
	}

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
