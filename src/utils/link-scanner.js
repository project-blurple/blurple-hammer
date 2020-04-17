const fetch = require("node-fetch"), config = require("../../config.json"), getRedirects = require("./link-redirects.js"), constants = require("../constants")

module.exports = (rawLinks, redirects = null) => new Promise(async (resolve, reject) => { try {
  if (!redirects) redirects = await Promise.all(rawLinks.map(getRedirects));
  
  const links = redirects.filter(constants.onlyUnique), allLinks = constants.flat(links).map(link => link.match(constants.linkDomainRegex)[0]).filter(constants.onlyUnique)
  const wotData = await fetch(`https://api.mywot.com/0.4/public_link_json2?hosts=${allLinks.map(l => l + "/").join("")}&key=${config.wot}`).then(res => res.json()).catch(() => ({}))
  const googleData = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${config.google}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client: {
        clientId: "Blurple Hammer",
        clientVersion: "2.0.1"
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION"
        ],
        platformTypes: [ "ANY_PLATFORM" ],
        threatEntryTypes: [ "URL" ],
        threatEntries: redirects.map(url => ({ url }))
      }
    })
  }).then(res => res.json()).then(({ matches = [] }) => matches.map(match => ({
    url: match.threat.url,
    type: match.threatType
  })))

  console.log(googleData)

  return resolve(links.map(redirects => redirects.map((link, rNum) => {
    const domain = link.match(constants.linkDomainRegex)[0]
    let result = {
      url: link, domain,
      origin: rNum ? redirects[rNum - 1] : null,
      safe: true,

      whitelisted: false,
      blacklisted: false,

      trustworthy: null,
      childsafe: null,
      wot: {},
      google: {}
    }

    if (constants.urlWhitelist.includes(domain)) result.whitelisted = true;
    if (constants.urlBlacklist.includes(domain)) result.blacklisted = true;

    const wot = wotData[domain];
    if (wot) {
      if (wot[0]) result.trustworthy = wot[0];
      if (wot[4]) result.childsafe = wot[4];
      if (wot.categories) for (const i in wot.categories) result.wot[constants.linkCategories[parseInt(i)]] = wot.categories[i];
    }
    
    const google = googleData.find(m => m.url == link)
    if (google) result.google = google;

    if (!result.whitelisted && (
      result.blacklisted ||
      Object.keys(wot.categories || {}).map(parseInt).map(categ => constants.badLinkCategories.includes(categ)).find(categ => categ) ||
      (result.childsafe && result.childsafe[0] <= 60 && result.childsafe[1] >= 8) ||
      (result.trustworthy && result.trustworthy[0] <= 60 && result.trustworthy[1] >= 8)
    )) result.safe = false;

    return result;
  })))
} catch (e) { reject(e) }})