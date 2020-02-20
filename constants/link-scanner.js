const fetch = require("node-fetch"), config = require("../config.json"), getRedirects = require("./link-redirects.js")

module.exports = (rawLinks, redirects = null, constants) => new Promise(async resolve => {
  if (!redirects) redirects = await Promise.all(rawLinks.map(getRedirects));
  
  const links = redirects.filter(constants.onlyUnique), allLinks = flat(links).map(link => link.match(constants.linkDomainRegex)[0]).filter(constants.onlyUnique)
  const wotData = await fetch("https://api.mywot.com/0.4/public_link_json2?hosts=" + allLinks.map(l => l + "/").join("") + "&key=" + config.wot).then(res => res.json()).catch(() => ({}))

  Promise.all(links.map(redirects => redirects.map(link => {
    const domain = link.match(constants.linkDomainRegex)[0]
    let result = {
      url: link,
      domain,
      safe: true,

      whitelisted: false,
      blacklisted: false,

      trustworthy: null,
      childsafe: null,
      wot: {}
    }

    if (constants.urlWhitelist.includes(link)) result.whitelisted = true;
    if (constants.urlBlacklist.includes(link)) result.blacklisted = true;

    const wot = wotData[domain];
    if (wot) {
      if (wot[0]) result.trustworthy = wot[0];
      if (wot[4]) result.childsafe = wot[4];
      if (wot.categories) result.wot = wot.categories;
    }

    return result;
  }))).then(resolve)
})

// https://stackoverflow.com/a/57714483
function flat(input, depth = 1, stack = []) {
    for (let item of input) if (item instanceof Array && depth > 0) flat(item, depth - 1, stack); else stack.push(item);
    return stack;
}