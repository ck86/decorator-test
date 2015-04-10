const CLASS_SCOPED = 'js-scoped';

export class Scope {
	el = null;

	$el = null;

	parent = null;

	children = [];

	constructor(el) {
		this.el = el;
		this.$el = $(el);

		this.el.scope = this;

		this.$el.addClass(CLASS_SCOPED);

		let $parent = this.$el.parent().closest('.' + CLASS_SCOPED)
		if ($parent.length) {
			this.parent = $parent.get(0).scope;
			this.parent.add(this);
		}
	}

	add(child) {
		this.children.push(child);
	}

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

	setScopeValue(name, value) {
		if (typeof this[name] === 'undefined') {
			if (this.parent !== null) {
				this.parent.setScopeValue(name, value);

				return;
			}
		}

		this[name] = value;
	}

	onScopeValueChanged(newValue, oldValue, name) {
		if (this.children.length) {
			for (let i = 0, ln = this.children.length; i < ln; i++) {
				let child = this.children[i];

				child.onScopeValueChanged(newValue, oldValue, name);
			}
		}
	}
}

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
