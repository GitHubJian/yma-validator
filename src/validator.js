function Validator(options) {
    this.label = options.label;
    this.key = options.key;
    this.rules = options.rules;

    this.dynamicParams = {};
}

Validator.prototype.setDynamicParam = function setDynamicParam(key, value) {
    if (!Array.isArray(value)) {
        value = [value];
    }
    this.dynamicParams[key] = value;
};

Validator.prototype.methods = {
    required: function (value) {
        if (
            value !== undefined &&
            value !== null &&
            String(value).trim().length > 0
        ) {
            return true;
        }

        return this.label + '字段不能为空';
    },
    digits: function (value) {
        if (/^[1-9]\d*$/.test(value)) {
            return true;
        }

        return this.label + '字段必须为正整数';
    },
    min: function (value, param, include) {
        if (include ? value >= param : value > param) {
            return true;
        }

        let compareStr = include ? '大于等于' : '大于';
        return this.label + '字段应' + compareStr + ' ' + param;
    },
    max: function (value, param, include) {
        if (include ? value <= param : value < param) {
            return true;
        }

        let compareStr = include ? '小于等于' : '小于';
        return this.label + '字段应' + compareStr + ' ' + param;
    },
    range: function (value, min, minIncluded, max, maxIncluded) {
        if (
            minIncluded
                ? value >= min
                : value > min && maxIncluded
                ? value <= max
                : value.length < max
        ) {
            return true;
        }

        let minCompareStr = minIncluded ? '大于等于' : '大于';
        let maxCompareStr = maxIncluded ? '小于等于' : '小于';
        return (
            this.label +
            '字段应' +
            minCompareStr +
            ' ' +
            min +
            ' 并且' +
            maxCompareStr +
            ' ' +
            max
        );
    },
    minlength: function (value, param, include) {
        if (include ? value.length >= param : value.length > param) {
            return true;
        }

        let compareStr = include ? '大于等于' : '大于';
        return this.label + '字段长度应' + compareStr + ' ' + param;
    },
    maxlength: function (value, param, include) {
        if (include ? value.length <= param : value.length < param) {
            return true;
        }

        let compareStr = include ? '小于等于' : '小于';
        return this.label + '字段长度应' + compareStr + ' ' + param;
    },
    rangelength: function (value, min, minIncluded, max, maxIncluded) {
        const len = String(value).length;

        if (
            (minIncluded ? len >= min : len > min) &&
            (maxIncluded ? len <= max : len < max)
        ) {
            return true;
        }

        let minCompareStr = minIncluded ? '大于等于' : '大于';
        let maxCompareStr = maxIncluded ? '小于等于' : '小于';
        return (
            this.label +
            '字段长度应' +
            minCompareStr +
            ' ' +
            min +
            ' 并且' +
            maxCompareStr +
            ' ' +
            max
        );
    },

    equalTo: function (value, correlativeValue, correlativeLabel) {
        if (value === correlativeValue) {
            return true;
        }

        return (
            this.label + '字段应与' + (correlativeLabel || '确认') + '字段相同'
        );
    },
};

Validator.prototype.assert = function (value) {
    const messages = [];
    for (var i = 0; i < this.rules.length; i++) {
        var rule = this.rules[i];

        var argv;
        if (['equalTo'].indexOf(rule.name) > -1) {
            argv = [].concat(value, this.dynamicParams[rule.name] || []);
        } else {
            argv = [].concat(value, rule.params);
        }

        var flag = this.methods[rule.name].apply(this, argv);

        if (flag !== true) {
            messages.push(flag);
        }
    }

    return messages.length === 0 ? true : messages;
};

module.exports = Validator;
