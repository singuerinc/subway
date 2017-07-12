module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-underscore-dangle": ["error", { "allowAfterThis": true }]
    },
    "env": {
        "browser": true
    },
    "globals": {
        "PIXI": true,
        "Stats": true
    }
};
