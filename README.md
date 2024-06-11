# YMA Form Validator

表单校验器，适用于对数据统一校验，而不是 Input 校验

```js
import FormValidator from 'yma-form-validator';

const formValidator = new FormaValidator([
    {
        label: '密码', // 提示字段使用
        key: 'newPwd', // 对应校验 assert 中数据的 key
        rules: [
            {
                name: 'required',
            },
        ],
    },
    {
        label: '确认密码',
        key: 'newPwd2',
        rules: [
            {
                name: 'required',
            },
            {
                name: 'equalTo',
                correlative: 'newPwd', // 关联 key
            },
        ],
    },
]);

const messages = formValidator.assert({
    newPwd: 1,
    newPwd2: 1,
});
```
