# Metrics Tag Manager

A simple tag manager used to replace Segment.io


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