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
