const fs = require("fs"), config = require("../../config.json");

module.exports = {
  embedColor: 0x7289DA,
  hexColor: "7289DA",
  getPermissionLevel: getPermissionLevel(config),
  emojis: {
    loading: '<a:loading:572202235342225418>',
    blurple: '<:blurple:673265867840290859>',
    thumbsup: '<:thumbsup:673265868301533194>',
    birthdayhat: '<:birthdayhat:673265867995217931>',
    tickyes: '<:tickyes:673265868213452855>',
    drippingheart: '<:drippingheart:673265868318310401>',
    pingsock: '<:pingsock:673265868385550376>',
    hammer: '<:hammer:673265868414910520>',
    darkblurple: '<:darkblurple:673265868444270602>',
    tada: '<:tada:673265868188287007>',
    tickno: '<:tickno:673265868461047828>',
    star: '<:star:673265868490145825>',
    wave: '<:wave:673265868498796591>',
    weewoo: '<a:weewoo:673265868079366155>',
    sparkle: '<:sparkle:673265868603654183>',
    love: '<a:love:673265868666437632>',
    white: '<:white:673265868716638208>',
    thumbsdown: '<:thumbsdown:673265868662112269>',
    heart: '<:heart:673265871094939674>'
  },
  emojiSnowflakes: {
    loading: '572202235342225418',
    blurple: '673265867840290859',
    thumbsup: '673265868301533194',
    birthdayhat: '673265867995217931',
    tickyes: '673265868213452855',
    drippingheart: '673265868318310401',
    pingsock: '673265868385550376',
    hammer: '673265868414910520',
    darkblurple: '673265868444270602',
    tada: '673265868188287007',
    tickno: '673265868461047828',
    star: '673265868490145825',
    wave: '673265868498796591',
    weewoo: '673265868079366155',
    sparkle: '673265868603654183',
    love: '673265868666437632',
    white: '673265868716638208',
    thumbsdown: '673265868662112269',
    heart: '673265871094939674' 
  },
  onlyUnique: (value, index, self) => self.indexOf(value) == index,
  flat: (input, depth = 1, stack = []) => {
    for (let item of input) if (item instanceof Array && depth > 0) flat(item, depth - 1, stack); else stack.push(item);
    return stack;
  },
  linkRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gm,
  linkDomainRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b/m,
  parseArgs: _arguments => (_arguments.match(/\"[^"]+\"|[^ ]+/g) || []).map(argument => argument.startsWith("\"") && argument.endsWith("\"") ? argument.slice(1).slice(0, -1) : argument),
  urlBlacklist: fs.readFileSync("./src/constants/url-blacklist.txt", "utf8").split("\n").map(l => l.replace("\r", "")),
  urlWhitelist: fs.readFileSync("./src/constants/url-whitelist.txt", "utf8").split("\n").map(l => l.replace("\r", "")),
  lockMessage: user => `\n\n${module.exports.emojis.weewoo} ${module.exports.emojis.weewoo} ***CHANNEL IS LOCKED BY ${user}*** ${module.exports.emojis.weewoo} ${module.exports.emojis.weewoo}`,
  linkCategories: {
    // NEGATIVE
    101: 'MALWARE_OR_VIRUS',
    102: 'POOR_CUSTOMER_EXPERIENCE',
    103: 'PHISHING',
    104: 'SCAM',
    105: 'POTENTIALLY_ILLEGAL',
  
    // QUESTIONABLE
    201: 'MISLEADING_CLAIMS_OR_UNETHICAL',
    202: 'PRIVACY_RISKS',
    203: 'SUSPICIOUS',
    204: 'HATE_DISCRIMINTATION',
    205: 'SPAM',
    206: 'PUP',
    207: 'ADS_POPUPS',
  
    // NEUTRAL
    301: 'ONLINE_TRACKING',
    302: 'ALTERNATIVE_OR_CONTROVERSIAL_NATURE',
    303: 'OPINIONS_RELIGION_POLITICS',
    304: 'OTHER',
  
    // CHILD_SAFETY
    401: 'ADULT_CONTENT',
    402: 'INCIDENTAL_NUDITY',
    403: 'GRUESOM_OR_SHOCKING',
    404: 'SITE_FOR_KIDS',
  
    // POSITIVE
    501: 'GOOD_SITE',
  
    Meta: {
      NEGATIVE: 100,
      QUESTIONABLE: 200,
      NEURTAL: 300,
      CHILD_SAFETY: 400,
      POSITIVE: 500,
    },
  },
  badLinkCategories: [ 101, 103, 104, 105, 203, 204, 206, 401, 402, 403 ],
  rules: require("./rules.json"),
  staffgl: fs.existsSync("./src/constants/staffgl.json") ? require("./staffgl.json") : {},
  roles: {
    admin: "443013283977494539",
    exec: "413213839866462220",
    srmod: "470272155876065280",
    mod: "569015549225598976",
    jrmod: "562886834301042698",
    helper: "442785212502507551",
    staff: "521320699571208193", // "569015549225598976",
    duty: "674712941085589524", // "674704168602042388",
    blacklist: "698301467416723558"//"573392328912404480"
  },
  publicChannels: [
    "412754940885467148", // general
    "453451178039312395", // international-channel
    "476306069581201409", // auttaja-playground
    "444135968631685120", // nonconformity-center
    "472160259020947476"  // vc-context
  ]

}

function getPermissionLevel(config) {
  return member => {
    const roles = member.roles.cache.map(r => r.id)
    
    if (config.owner === member.user.id) return 7; // Promise#0001
    if (roles.includes(module.exports.roles.admin)) return 6; // admin
    if (roles.includes(module.exports.roles.exec)) return 5; // exec
    if (roles.includes(module.exports.roles.srmod)) return 4; // sr.mod
    if (roles.includes(module.exports.roles.mod)) return 3; // mod
    if (roles.includes(module.exports.roles.jrmod)) return 2; // jr.mod
    if (roles.includes(module.exports.roles.helper)) return 1; // helper
    return 0; // normal user
  }
}