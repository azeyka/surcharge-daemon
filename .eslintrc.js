module.exports = {
    "env": {
        "commonjs": true,
        "es2020": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "import/no-extraneous-dependencies": "off",
        "no-console": ["error", { "allow": ["warn", "error", "info"] }],
        "no-underscore-dangle": "off"
    }
};