
it('loads a script from a URL', () => {
    const loadScript = require('../script-loader').default;
    
    // Create <script> element for the loadScript, <script> count is 1
    document.body.appendChild(document.createElement('script'));

    // Created another <script> tag
    loadScript({
        src: 'https://code.jquery.com/jquery.min.js',
        globalName: 'jQuery',
        window,
        document,
        id: 'test',
        stub: () => { return null; }
    });

    // Tag count should be 2
    expect(document.querySelectorAll('script')).toHaveLength(2);

    // A <script id="test" /> should exist
    expect(document.querySelector('script#test')).not.toBeUndefined();
});

it('errors on invalid URL', (done) => {
    const loadScript = require('../script-loader').default;
    
    // Create <script> element for the loadScript, <script> count is 1
    document.body.appendChild(document.createElement('script'));

    // Created another <script> tag
    loadScript({
        src: 'https://not-cdn.auth0.com/doesnotexist.js',
        globalName: 'Auth0',
        window,
        document,
        id: 'test',
        stub: () => { return null; }
    }, (error) => {
        expect(error).not.toBeUndefined();
        done();
    });
});