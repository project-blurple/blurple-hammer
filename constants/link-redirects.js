const request = require("request");

module.exports = link => new Promise(resolve => {
  const redirects = [];
  
  request({
    url: link.startsWith("http") ? link : "http://" + link,
    method: "GET",
    followRedirect: res => redirects.push(res.request.href),
    timeout: 5000
  }, (err, res, body) => {
    if (err) return resolve([ link.startsWith("http") ? link : "http://" + link ]);
    redirects.push(res.request.href)
    resolve(redirects)
  })
})