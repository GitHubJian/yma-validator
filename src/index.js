const Validator = require('./validator');

function FormValidator(rules) {
    this.rules = rules;

    this.validators = rules.map(function (rules) {
        return new Validator(rules);
    });
}

FormValidator.prototype.assert = function (form) {
    this.$setDynamicParams(form);

    let messages = [];
    this.validators.forEach(function (validator) {
        const key = validator.key;
        const message = validator.assert(form[key]);
        if (message !== true) {
            messages = messages.concat(message);
        }
    });

    if (messages.length === 0) {
        return true;
    } else {
        return messages;
    }
};

FormValidator.prototype.$setDynamicParams = function (form) {
    this.validators.forEach(validator => {
        const rules = validator.rules;

        rules.forEach(rule => {
            if (rule.correlative) {
                const correlativeValidator = this.validators.find(function (v) {
                    return v.key === rule.correlative;
                });

                validator.setDynamicParam(rule.name, [
                    form[rule.correlative],
                    correlativeValidator && correlativeValidator.label,
                ]);
            }
        });
    });
};

FormValidator.Validator = Validator;
module.exports = FormValidator;
