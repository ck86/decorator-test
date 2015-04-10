import $ from 'jquery';

const CLASS_SCOPED = 'js-scoped';

/**
 * Handles scoping of elements
 *
 * @class Scope
 */
export class Scope {
	/**
	 * The native element
	 *
	 * @type {HTMLElement}
	 */
	el = null;

	/**
	 * jQuery object of the element
	 *
	 * @type {$}
	 */
	$el = null;

	/**
	 * Parent scope
	 *
	 * @type {Scope}
	 */
	parent = null;

	/**
	 * Scope children
	 *
	 * @type {Array}
	 */
	children = [];

	/**
	 * @constructor
	 * @param el
	 */
	constructor(el) {
		this.el = el;
		this.$el = $(el);

		this.el.scope = this;

		this.$el.addClass(CLASS_SCOPED);

		let $parent = this.$el.parent().closest('.' + CLASS_SCOPED);

		if ($parent.length) {
			this.parent = $parent.get(0).scope;
			this.parent.add(this);
		}
	}

	/**
	 * Adds child scope
	 *
	 * @param {Scope} child
	 */
	add(child) {
		this.children.push(child);
	}

	/**
	 * Gets the value of the first found property in the scope tree
	 *
	 * @param {string} name
	 * @returns {*}
	 */
	getScopeValue(name) {
		if (typeof this[name] === 'undefined') {
			if (this.parent !== null) {
				return this.parent.getScopeValue(name);
			} else {
				return undefined;
			}
		}

		return this[name];
	}

	/**
	 * Sets the value of the first found property in the scope tree
	 *
	 * @param {string} name
	 * @param {*} value
	 */
	setScopeValue(name, value) {
		if (typeof this[name] === 'undefined') {
			if (this.parent !== null) {
				this.parent.setScopeValue(name, value);

				return;
			}
		}

		this[name] = value;
	}

	/**
	 * Handles changing of scope values, propagates the change to the scope children
	 *
	 * @param {*} newValue
	 * @param {*} oldValue
	 * @param {string} name
	 */
	onScopeValueChanged(newValue, oldValue, name) {
		if (this.children.length) {
			for (let i = 0, ln = this.children.length; i < ln; i++) {
				let child = this.children[i];

				child.onScopeValueChanged(newValue, oldValue, name);
			}
		}
	}
}

/**
 * Adds a bindable property to an object
 *
 * @example
 *  @bindable('my_property', 'my_value')
 *  class MyClass extends Scope {
 *      onScopeValueChanged(newValue, oldValue, name) {
 *          super.onScopeValueChanged(newValue, oldValue, name);
 *
 *          console.log(name, newValue, oldValue);
 *      }
 *  }
 *
 *  var myObject = new MyClass();
 *
 *  myObject.my_property = 'my_new_value'; // output: my_property, my_new_value, my_value
 *
 * @decorator
 * @param {string} name
 * @param {*} defaultValue
 * @returns {Function}
 */
export function bindable(name, defaultValue = null) {
	return function(target) {
		Object.defineProperty(target.prototype, name, {
			get: function() {
				return this[`_${name}`] || defaultValue;
			},
			set: function(newValue) {
				var oldValue = this[name];

				this[`_${name}`] = newValue;

				this.onScopeValueChanged(newValue, oldValue, name);
			}
		});
	}
}
