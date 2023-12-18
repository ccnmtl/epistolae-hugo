module.exports = {
    "env": {
        "browser": true,
        "amd": true,
        "jquery": true,
        "es6": true
    },
    "plugins": [
        "security"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:security/recommended-legacy"
    ],
    "globals": {
        "google": true,
        "lunr": true
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-unused-vars": [
            "error",
            {"vars": "all", "args": "none"}
        ],
        "quotes": [
            "error",
            "single"
        ],
        "security/detect-object-injection": "off",
        "semi": [
            "error",
            "always"
        ]
    }
};
