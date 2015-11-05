'use strict';

var SabreDevStudioFlight = require('../lib/sabre-dev-studio-flight.js');
var nock = require('nock');
var qs = require('querystring');
var moment = require('moment');
nock.disableNetConnect();

module.exports = {
  setUp: function(callback) {
    this.sabre_dev_studio_flight = new SabreDevStudioFlight({
      client_id:     'V1:USER:GROUP:DOMAIN',
      client_secret: 'PASSWORD',
      uri:           'https://api.test.sabre.com'
    });
    this.base_url = "https://api.test.sabre.com";
    var token = 'this_is_a_fake_token';
    this.stub_request = nock(this.base_url)
        .post('/v1/auth/token', 'grant_type=client_credentials&client_id=VjE6VVNFUjpHUk9VUDpET01BSU4%3D&client_secret=UEFTU1dPUkQ%3D&code=')
        .reply(200, { access_token: token })
        ;
    callback();
  },
  tearDown: function(callback) {
    this.stub_request.isDone();
    callback();
  },
  testAirShoppingThemeAPI: function(test) {
    var stub_request_get = nock(this.base_url)
        .get('/v1/lists/supported/shop/themes')
        .replyWithFile(200, __dirname + '/fixtures/air_shopping_themes.json')
        ;
    this.sabre_dev_studio_flight.travel_theme_lookup(function(error, data) {
      test.ok(data);
      var air_shopping_themes = JSON.parse(data);
      test.equal(11, air_shopping_themes['Themes'].length);
      test.equal('BEACH', air_shopping_themes['Themes'][0]['Theme']);
      test.done();
    });
    stub_request_get.isDone();
  },
  testThemeAirportLookupAPI: function(test) {
    var theme = 'DISNEY';
    var stub_request_get = nock(this.base_url)
        .get('/v1/lists/supported/shop/themes/' + theme)
        .replyWithFile(200, __dirname + '/fixtures/theme_airport_lookup.json')
        ;
    this.sabre_dev_studio_flight.theme_airport_lookup(theme, function(error, data) {
      test.ok(data);
      var airports = JSON.parse(data);
      test.equal(7, airports.Destinations.length);
      test.equal('BUR', airports['Destinations'][0]['Destination']);
      test.done();
    });
    stub_request_get.isDone();
  },
  testDestinationFinderAPI: function(test) {
    var options = {
      origin        : 'LAS',
      lengthofstay  : 1,
      theme         : 'MOUNTAINS'
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/shop/flights/fares?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/destination_air_shop.json')
        ;
    this.sabre_dev_studio_flight.destination_finder(options, function(error, data) {
      test.ok(data);
      var fares = JSON.parse(data);
      test.equal(options.origin, fares.OriginLocation);
      test.equal(31, fares.FareInfo.length);
      test.equal(158, fares.FareInfo[0].LowestFare);
      var date = moment(fares.FareInfo[0].DepartureDateTime);
      test.equal(4, date.month() + 1);
      test.done();
    });
    stub_request_get.isDone();
  },
  testLeadPriceCalendarAPI: function(test) {
    var options = {
      origin        : 'JFK',
      destination   : 'LAX',
      lengthofstay  : 5
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/shop/flights/fares?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/future_dates_lead_fare_shop.json')
        ;
    this.sabre_dev_studio_flight.lead_price_calendar(options, function(error, data) {
      test.ok(data);
      var fares = JSON.parse(data);
      test.equal(options.origin, fares.OriginLocation);
      test.equal(193, fares.FareInfo.length);
      test.equal(792, fares.FareInfo[0].LowestFare);
      test.done();
    });
    stub_request_get.isDone();
  },
  testInstaflightsSearchAPI: function(test) {
    var options = {
      origin                : 'JFK',
      destination           : 'LAX',
      departuredate         : '2014-10-01',
      returndate            : '2014-10-05',
      onlineitinerariesonly : 'N',
      limit                 : 1,
      offset                : 1,
      sortby                : 'totalfare',
      order                 : 'asc',
      sortby2               : 'departuretime',
      order2                : 'dsc'
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/shop/flights?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/single_date_air_shop.json')
        ;
    this.sabre_dev_studio_flight.instaflights_search(options, function(error, data) {
      test.ok(data);
      var fares = JSON.parse(data);
      test.equal(options.origin, fares.OriginLocation);
      test.equal(387.0, fares.PricedItineraries[0].AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount);
      test.done();
    });
    stub_request_get.isDone();
  },

  testBargainFinderMaxAPI: function (test) {
    var options = {
      'mode': 'live',
      'Content-Type': 'application/json'
    };
    var stub_request_post = nock(this.base_url)
            .post('/v1.8.5/shop/flights?' + qs.stringify(options))
            .replyWithFile(200, __dirname + '/fixtures/bargain_finder_max.json')
        ;
    this.sabre_dev_studio_flight.bargain_finder_max('', function (error, data) {
      test.ok(data);
      var rs = JSON.parse(data);
      test.equal(1, rs.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary.length);
    });
    setTimeout(function () {
      test.ok(stub_request_post.isDone());
      test.done();
    }, 50);
  },

  testBargainFinderMaxAPIValidErrorResponse: function (test) {
    var options = {
      'mode': 'live',
      'Content-Type': 'application/json'
    };
    var stub_request_post = nock(this.base_url)
            .post('/v1.8.5/shop/flights?' + qs.stringify(options))
            .replyWithFile(200, __dirname + '/fixtures/bargain_finder_max_error.json')
        ;
    this.sabre_dev_studio_flight.bargain_finder_max('', function (error, data) {
      test.ok(data);
      var rs = JSON.parse(data);
      test.ok(rs.msg.indexOf("NO FIRST CABIN AVAILABLE") > 0);
    });
    setTimeout(function () {
      test.ok(stub_request_post.isDone());
      test.done();
    }, 50);
  },

  testAlternateDateAPI: function (test) {
    var options = {
      'mode': 'live',
      'Content-Type': 'application/json'
    };
    var stub_request_post = nock(this.base_url)
            .post('/v1.8.5/shop/altdates/flights?' + qs.stringify(options))
            .replyWithFile(200, __dirname + '/fixtures/alternate_date.json')
        ;
    this.sabre_dev_studio_flight.alternate_date('', function (error, data) {
      test.ok(data);
      var rs = JSON.parse(data);
      test.equal(8, rs.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary.length);
    });
    setTimeout(function () {
      test.ok(stub_request_post.isDone());
      test.done();
    }, 50);
  },

  testAdvancedCalendarSearchAPI: function (test) {
    var options = {
      'Content-Type': 'application/json'
    };
    var stub_request_post = nock(this.base_url)
            .post('/v1.8.1/shop/calendar/flights?' + qs.stringify(options))
            .replyWithFile(200, __dirname + '/fixtures/advanced_calendar_search.json')
        ;
    this.sabre_dev_studio_flight.advanced_calendar_search('', function (error, data) {
      test.ok(data);
      var rs = JSON.parse(data);
      test.equal(17, rs.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary.length);
    });
    setTimeout(function () {
      test.ok(stub_request_post.isDone());
      test.done();
    }, 50);
  },

  testLowFareForecastAPI: function(test) {
    var options = {
      origin        : 'JFK',
      destination   : 'LAX',
      departuredate : '2014-10-01',
      returndate    : '2014-10-05'
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/forecast/flights/fares?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/low_fare_forecast.json')
        ;
    this.sabre_dev_studio_flight.low_fare_forecast(options, function(error, data) {
      test.ok(data);
      var forecast = JSON.parse(data);
      test.equal(options.origin, forecast.OriginLocation);
      test.equal(options.destination, forecast.DestinationLocation);
      test.equal(387.0, forecast.LowestFare);
      test.done();
    });
    stub_request_get.isDone();
  },
  testFareRangeAPI: function(test) {
    var options = {
      origin                : 'JFK',
      destination           : 'LAX',
      earliestdeparturedate : '2014-06-01',
      latestdeparturedate   : '2014-06-01',
      lengthofstay          : 4
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/historical/flights/fares?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/fare_range.json')
        ;
    this.sabre_dev_studio_flight.fare_range(options, function(error, data) {
      test.ok(data);
      var fare_range = JSON.parse(data);
      test.equal(options.origin, fare_range.OriginLocation);
      test.equal(options.destination, fare_range.DestinationLocation);
      test.equal(1, fare_range.FareData.length);
      test.done();
    });
    stub_request_get.isDone();
  },
  testTravelSeasonalityAPI: function(test) {
    var destination = 'DFW';
    var stub_request_get = nock(this.base_url)
        .get('/v1/historical/flights/' + destination + '/seasonality')
        .replyWithFile(200, __dirname + '/fixtures/travel_seasonality.json')
        ;
    this.sabre_dev_studio_flight.travel_seasonality(destination, function(error, data) {
      test.ok(data);
      var travel_seasonality = JSON.parse(data);
      test.equal(destination, travel_seasonality.DestinationLocation);
      test.equal(52, travel_seasonality.Seasonality.length);
      test.equal(1, travel_seasonality.Seasonality[0]['YearWeekNumber']);
      test.equal('Low', travel_seasonality.Seasonality[0]['SeasonalityIndicator']);
      test.done();
    });
    stub_request_get.isDone();
  },
  testCityPairsLookupAPI: function(test) {
    var options = {
      origincountry       : 'US',
      destinationcountry  : 'US'
    };
    var stub_request_get = nock(this.base_url)
        .get('/v1/lists/airports/supported/origins-destinations?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/city_pairs.json')
        ;
    this.sabre_dev_studio_flight.city_pairs_lookup(options, function(error, data) {
      test.ok(data);
      var city_pairs = JSON.parse(data);
      test.equal(982, city_pairs.OriginDestinationLocations.length);
      test.equal('DEN', city_pairs.OriginDestinationLocations[0].OriginLocation.AirportCode);
      test.equal('ABQ', city_pairs.OriginDestinationLocations[0].DestinationLocation.AirportCode);
      test.done();
    });
    stub_request_get.isDone();
  },
  testMultiAirportCityLookupAPI: function(test) {
    var options = { country: 'US' };
    var stub_request_get = nock(this.base_url)
        .get('/v1/lists/cities?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/multiairport_city_lookup.json')
        ;
    this.sabre_dev_studio_flight.multiairport_city_lookup(options, function(error, data) {
      test.ok(data);
      var city_lookup = JSON.parse(data);
      test.equal(15, city_lookup.Cities.length);
      test.equal('WAS', city_lookup.Cities[14]['code']);
      test.done();
    });
    stub_request_get.isDone();
  },
  testAirportsAtCitiesLookupAPI: function(test) {
    var options = { city: 'QDF' };
    var stub_request_get = nock(this.base_url)
        .get('/v1/lists/airports?' + qs.stringify(options))
        .replyWithFile(200, __dirname + '/fixtures/airports_at_cities_lookup.json')
        ;
    this.sabre_dev_studio_flight.airports_at_cities_lookup(options, function(error, data) {
      test.ok(data);
      var airports = JSON.parse(data);
      test.equal(3, airports.Airports.length);
      test.equal('EWR', airports.Airports[0].code);
      test.equal('NEWARK', airports.Airports[0].name);
      test.done();
    });
    stub_request_get.isDone();
  }
};
