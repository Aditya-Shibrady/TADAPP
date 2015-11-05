# sabre-dev-studio

NodeJS wrapper for the Sabre Dev Studio API

[![Build Status](https://travis-ci.org/SabreDevStudio/sabre-dev-studio-node.svg)](https://travis-ci.org/SabreDevStudio/sabre-dev-studio-node)

## Getting Started
Install the module with: `npm install sabre-dev-studio`

    var SabreDevStudio = require('sabre-dev-studio');
    var sabre_dev_studio = new SabreDevStudio({
      client_id:     'V1:1234:ABCD:XYZ',
      client_secret: 'SeKr1T',
      uri:           'https://api.test.sabre.com'
    });
    var options = {};
    var callback = function(error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log(JSON.stringify(JSON.parse(data)));
      }
    };
    sabre_dev_studio.get('/v1/lists/supported/shop/themes', options, callback);

## Documentation

See http://developer.sabre.com

## Examples

### Using the Flight API:

    var SabreDevStudioFlight = require('sabre-dev-studio/lib/sabre-dev-studio-flight');
    var sabre_dev_studio_flight = new SabreDevStudioFlight({
      client_id:     'V1:1234:ABCD:XYZ',
      client_secret: 'SeKr1T',
      uri:           'https://api.test.sabre.com'
    });
    var callback = function(error, data) {
      if (error) {
        // Your error handling here
        console.log(error);
      } else {
        // Your success handling here
        console.log(JSON.stringify(JSON.parse(data)));
      }
    };
    sabre_dev_studio_flight.travel_theme_lookup(callback);
    sabre_dev_studio_flight.theme_airport_lookup('BEACH', callback);

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Sabre Corp
Licensed under the MIT license.

## Disclaimer of Warranty and Limitation of Liability

This software and any compiled programs created using this software are furnished “as is” without warranty of any kind, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. No oral or written information or advice given by Sabre, its agents or employees shall create a warranty or in any way increase the scope of this warranty, and you may not rely on any such information or advice.
Sabre does not warrant, guarantee, or make any representations regarding the use, or the results of the use, of this software, compiled programs created using this software, or written materials in terms of correctness, accuracy, reliability, currentness, or otherwise. The entire risk as to the results and performance of this software and any compiled applications created using this software is assumed by you. Neither Sabre nor anyone else who has been involved in the creation, production or delivery of this software shall be liable for any direct, indirect, consequential, or incidental damages (including damages for loss of business profits, business interruption, loss of business information, and the like) arising out of the use of or inability to use such product even if Sabre has been advised of the possibility of such damages.
