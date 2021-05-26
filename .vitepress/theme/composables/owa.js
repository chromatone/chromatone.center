//<![CDATA[
var owa_baseUrl = 'http://stats.frkt.ru/'
var owa_cmds = owa_cmds || []
owa_cmds.push(['setSiteId', 'a77f19d1e45d3e4e89ac7a0287e52b77'])
owa_cmds.push(['trackPageView'])
owa_cmds.push(['trackClicks'])

;(function () {
  var _owa = document.createElement('script')
  _owa.type = 'text/javascript'
  _owa.async = true
  owa_baseUrl =
    'https:' == document.location.protocol
      ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:')
      : owa_baseUrl
  _owa.src = owa_baseUrl + 'modules/base/js/owa.tracker-combined-min.js'
  var _owa_s = document.getElementsByTagName('script')[0]
  _owa_s.parentNode.insertBefore(_owa, _owa_s)
})()
//]]>
