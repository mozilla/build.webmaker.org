var getJSON = function(url, successHandler, errorHandler) {
  var xhr = typeof XMLHttpRequest !== "undefined" ?
    new XMLHttpRequest() :
    new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("get", url, true);
  xhr.onreadystatechange = function() {
    var status;
    var data;
    /* See http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate */
    if (xhr.readyState === 4) { /* `DONE` */
      status = xhr.status;
      if (status === 200) {
        data = JSON.parse(xhr.responseText);
        if (successHandler) {
          successHandler(data);
        }
      } else if (status === 302) {
        // X data.redirect contains the string URL to redirect to
        data = JSON.parse(xhr.responseText);
        window.location.href = data.redirect;
      } else {
        if (errorHandler) {
          errorHandler(status);
        }
      }
    }
  };
  xhr.send();
};

module.exports = getJSON;
