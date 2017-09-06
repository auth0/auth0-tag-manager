
describe('loadScript tests', () => {
  beforeEach(() => {
    // Create <script> element for the loadScript, <script> count is 1
    document.body.appendChild(document.createElement('script'));    
  });

  afterEach(() => {
    // Remove <script> tags after the test
    document.querySelectorAll('script').forEach((tag) => {
      tag.parentNode.removeChild(tag);
    });
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
    
    expect(jQuery).not.toBeUndefined();
    expect(jQuery.foo).not.toBeUndefined();
    expect(jQuery.bar).not.toBeUndefined();
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