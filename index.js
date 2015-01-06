'use strict';

var merge = require('lodash-node/compat/objects/merge');
var analyticsConfigDefaults = {
  globalVariable: 'ga',
  tracker: 'analytics.js',
  webPropertyId: null,
  cookieDomain: null,
  cookieName: null,
  cookieExpires: null,
  displayFeatures: false
};

function analyticsTrackingCode(config) {
  var scriptArray,
    displayFeaturesString,
    gaConfig = {};

  if (config.cookieDomain != null) {
    gaConfig.cookieDomain = config.cookieDomain;
  }
  if (config.cookieName != null) {
    gaConfig.cookieName = config.cookieName;
  }
  if (config.cookieExpires != null) {
    gaConfig.cookieExpires = config.cookieExpires;
  }
  if (Object.keys(gaConfig).length === 0) {
    gaConfig = "'auto'";
  } else {
    gaConfig = JSON.stringify(gaConfig);
  }

  scriptArray = [
    "<script>",
    "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
    "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),",
    "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)",
    "})(window,document,'script','//www.google-analytics.com/analytics.js','" + config.globalVariable + "');",
    "",
    "" + config.globalVariable + "('create', '" + config.webPropertyId + "', " + gaConfig + ");",
    "" + config.globalVariable + "('send', 'pageview');",
    "</script>"
  ];

  if (config.displayFeatures) {
    displayFeaturesString = "" + config.globalVariable + "('require', 'displayfeatures');";
    scriptArray.splice(-2, 0, displayFeaturesString);
  }

  return scriptArray;
}

function gaTrackingCode(config) {
  var scriptArray;

  scriptArray = [
    "<script>",
    "var _gaq = _gaq || [];",
    "_gaq.push(['_setAccount', '" + config.webPropertyId + "']);",
    "_gaq.push(['_trackPageview']);",
    "",
    "(function() {",
    "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
    "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
    "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
    "})();",
    "</script>"
  ];

  if (config.displayFeatures) {
    scriptArray.splice(-4, 1, "  ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';");
  }

  return scriptArray;
}
function gaTrackingCode(config) {
  var scriptArray;

  scriptArray = [
    "<script>",
    "var _gaq = _gaq || [];",
    "_gaq.push(['_setAccount', '" + config.webPropertyId + "']);",
    "_gaq.push(['_trackPageview']);",
    "",
    "(function() {",
    "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
    "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
    "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
    "})();",
    "</script>"
  ];

  if (config.displayFeatures) {
    scriptArray.splice(-4, 1, "  ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';");
  }

  return scriptArray;
}


function owaTrackingCode(config) {
  var scriptArray;

  scriptArray = [
    "<script>",
    "				",
    "<!-- Start Open Web Analytics Tracker -->",
    "<script type='text/javascript'>",
    "//<![CDATA[",
    "var owa_baseUrl = '" + config.siteBaseURL + "';",
    "var owa_cmds = owa_cmds || [];",
    "owa_cmds.push(['setSiteId', '" + config.siteID + "']);",
    config.trackPageViews ? "owa_cmds.push(['trackPageView']);" : "",
    config.trackClicks ? "owa_cmds.push(['trackClicks']);" : "",
    config.trackDomStream? "owa_cmds.push(['trackDomStream']);" : "",
    "",
    "(function() {",
    "	var _owa = document.createElement('script'); _owa.type = 'text/javascript'; _owa.async = true;",
    "	owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );",
    "	_owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js';",
    "	var _owa_s = document.getElementsByTagName('script')[0]; _owa_s.parentNode.insertBefore(_owa, _owa_s);",
    "}());",
    "//]]>",
    "</script>",
    "<!-- End Open Web Analytics Code -->"
  ];

  //if (config.displayFeatures) {
  //  scriptArray.splice(-4, 1, "  ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';");
  //}

  return scriptArray;
}

module.exports = {
  name: 'ember-cli-poly-analytics',
  contentFor: function (type, config) {
    var analyticsConfig = merge({}, analyticsConfigDefaults, config.webAnalytics || {});

    if (type === 'head' && analyticsConfig.webPropertyId != null) {
      var content;

      if (analyticsConfig.tracker === 'analytics.js') {
        content = analyticsTrackingCode(analyticsConfig);
      } else if (analyticsConfig.tracker === 'ga.js') {
        content = gaTrackingCode(analyticsConfig);
      } else if (analyticsConfig.tracker === 'owa') {
        content = owaTrackingCode(analyticsConfig);
      } else {
        throw new Error('Invalid tracker found in configuration: "' + analyticsConfig.tracker + '". Must be one of: "analytics.js", "ga.js"');
      }

      return content.join("\n");
    }

    return '';
  }
};
