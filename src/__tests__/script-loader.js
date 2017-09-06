
describe('loadScript tests', () => {
  beforeEach(() => {
    // Remove <script> tags before the tests
    document.querySelectorAll('script').forEach((tag) => {
      tag.parentNode.removeChild(tag);
    });

    // Create <script> element for the loadScript, <script> count is 1
    document.body.appendChild(document.createElement('script'));    
  });

  it('loads a script from a URL', () => {
    const loadScript = require('../script-loader').default;
    
    // Created another <script> tag
    loadScript({
      src: 'https://code.jquery.com/jquery.min.js',
      globalName: 'jQuery',
      window,
      document,
      id: 'test',
      stub: () => { return 'abc123'; }
    });
    
    // Tag count should be 2
    expect(document.querySelectorAll('script')).toHaveLength(2);
    
    // A <script id="test" /> should exist
    expect(document.querySelector('script#test')).not.toBeUndefined();
    
    // globalName should exist
    expect(jQuery).not.toBeUndefined();    
    expect(jQuery()).toEqual('abc123');    
  });
  
  it('loads a script with stub methods from a URL', () => {
    const loadScript = require('../script-loader').default;
    
    // Created another <script> tag
    loadScript({
      src: 'https://code.jquery.com/jquery.min.js',
      globalName: 'jQuery',
      window,
      document,
      id: 'test',
      stubType: 'function',
      stubMethods: ['foo', 'bar']
    });
    
    // Tag count should be 2
    expect(document.querySelectorAll('script')).toHaveLength(2);
    
    // A <script id="test" /> should exist
    expect(document.querySelector('script#test')).not.toBeUndefined();
    
    
    // globalName should exist
    expect(jQuery).not.toBeUndefined();
    
    // stubMethods should exist
    expect(jQuery.foo).not.toBeUndefined();
    expect(typeof jQuery.foo).toEqual('function');
    expect(jQuery.bar).not.toBeUndefined();
    expect(typeof jQuery.bar).toEqual('function');
  });
  
  it('errors on invalid URL', (done) => {
    const loadScript = require('../script-loader').default;
    
    const url = 'notAnUrl';
    
    // Created another <script> tag
    loadScript({
      src: url,
      globalName: 'Auth0',
      window,
      document,
      id: 'test',
      stub: () => { return null; }
    })
    .catch((error) => {
      expect(error).toEqual(`Error loading ${url}`);
      done();
    });
  });
})