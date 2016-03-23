'use strict';

const assert = require('chai').assert;
let request = require('request');
const path = require('path');
const fs = require('fs');
const FileCookieStore = require('tough-cookie-filestore');

describe('Main test', function () {

    this.timeout(5000);

    it ('Request and save cookies', (done) => {

        let cookieFile = path.join(__dirname, 'storage/cookies_test_file');

        try {
            fs.accessSync(cookieFile);
        } catch (e) {
            fs.writeFileSync(cookieFile, '');
        }

        request = request.defaults({
            followAllRedirects: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
            },
            jar: request.jar(new FileCookieStore(cookieFile))
        });

        describe('2 requests', function () {

            this.timeout(5000);

            it ('1 request', (done) => {
                request('http://vk.com', (err, response, body) => {

                    assert.doesNotThrow(() => {
                        if (err) throw new err;
                    }, Error, 'Error of request');

                    assert.doesNotThrow(() => {
                        JSON.parse(fs.readFileSync(cookieFile).toString());
                    }, 'Unexpected token e');

                    done();
                });
            });

            it ('2 request', (done) => {
                request('https://login.vk.com', (err, response, body) => {

                    assert.doesNotThrow(() => {
                        if (err) throw new err;
                    }, Error, 'Error of request');

                    assert.doesNotThrow(() => {
                        JSON.parse(fs.readFileSync(cookieFile).toString());
                    }, 'Unexpected end of input');

                    done();
                });
            });

            done();
        });
    });
});