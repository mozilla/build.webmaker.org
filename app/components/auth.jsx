var React = require("react");


// From MDN: https://developer.mozilla.org/en-US/docs/Web
// /API/document.cookie#A_little_framework.3A_a_complete_cookies_reader.2Fwriter_with_full_unicode_support
var docCookies = {
  getItem: function(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(
      document.cookie.replace(
        new RegExp("(?:(?:^|.*;)\\s*" +
                   encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
                     "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number: {
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        }
        case String: {
          sExpires = "; expires=" + vEnd;
          break;
        }
        case Date: {
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
        }
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" +
        encodeURIComponent(sValue) + sExpires +
        (sDomain ? "; domain=" + sDomain : "") +
        (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function(sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" +
      encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
      "\\s*\\=")).test(document.cookie);
  },
  keys: function() {
    var aKeys = document.cookie.replace(
      /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").
      split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  }
};


var auth = {
  onLoad: function () {
    /* This function is invoked to find out whether we're logged in or not
       it looks at the github cookie and sets a JSON-encoded blob in
       localStorage for ease of access */

    var githubCookie = docCookies.getItem("github");
    if (! githubCookie) {
      return { loggedIn: false, details: null };
    }
    try {
      /* JSON parsing can raise exceptions */
      var blob = JSON.parse(githubCookie.slice(2));
      if (blob) {
        localStorage.github = JSON.stringify(blob);
        return { loggedIn: true, details: blob };
      }
      return { loggedIn: false, details: null };
    } catch (e) {
      return { loggedIn: false, details: null };
    }
  },
  getCurrentUser: function() {
    var state = this.onLoad();
    if (state.details && state.details.login) {
      return state.details.login;
    }
    return "";
  },
  login: function() {
    if (location.hostname === "localhostX") { /* make debugging easier */
      localStorage.github = JSON.stringify({
        name: "pretend davidascher",
        handle: "davidascher"
      });
      docCookies.setItem("github", "j="+localStorage.github);
      location.reload();
    } else {
      var newURL = "/auth/github/" + document.location.hash.slice(2);
      window.location = newURL;
    }
  },
  logout: function() {
    docCookies.removeItem("github");
    delete localStorage.github;
    location.reload();
  }
};

var AuthMixin = {
  getInitialState: function() {
    var state = auth.onLoad();
    return state;
  },

  login: function(event) {
    return auth.login();
  },

  logout: function(event) {
    event.preventDefault();
    auth.logout();
    this.setState({ loggedIn:false, details: null });
  }
};

var AuthBlock = React.createClass({
  mixins: [AuthMixin],
  render: function() {
    var loginOrOut = this.state.loggedIn ?
      <li className="icon-github auth"><a onClick={this.logout}>Sign out</a></li> :
      <li className="icon-github auth"><a onClick={this.login}>Sign in</a></li>;
    return (
      <span>
          {loginOrOut}
      </span>
    );
  }
});

module.exports.AuthBlock = AuthBlock;
module.exports.AuthMixin = AuthMixin;
module.exports.auth = auth;

