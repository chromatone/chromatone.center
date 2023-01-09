module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        'plugin:vue/vue3-recommended',
        'plugin:vue-pug/vue3-recommended'
    ],
    "overrides": [
        {
            "files": [".vitepress/*", "*/*"],
            "excludedFiles": [".vitepress/dist/*", "**/_dist/*"]
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        'vue/multi-word-component-names': 'off'
    }
}
