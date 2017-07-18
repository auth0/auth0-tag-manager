[![Build status][circleci-image]][circleci-url]
[![License][license-image]][license-url]

# Metrics Tag Manager

A simple tag manager to proxy requests to 3rd party analytics libraries (Facebook, Twitter, Google)


## Configuration

```js
var options = {
  label: 'PROPERTY_NAME',
  'google-analytics': {
    id: 'YOUR_ID'
  },
  'google-adwords': {
    id: 'YOUR_ID'
    mappings: [
      {
        evt: 'name',
        label: 'label'
      }
    ]
  },
  'facebook-pixel': {
    id: 'YOUR_ID'
  },
  'facebook-analytics': {
    id: 'YOUR_ID'
  },
  'twitter-ads-pixel': {
    id: 'YOUR_ID',
    mappings: [
      {
        evt: 'name',
        pid: 'pid'
      }
    ]
  }
}
```

[circleci-image]: https://img.shields.io/circleci/project/github/auth0/auth0-tag-manager.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/auth0/auth0-tag-manager/tree/master
[license-image]: http://img.shields.io/npm/l/auth0-tag-manager.svg?style=flat-square
[license-url]: #license
