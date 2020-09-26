const fs = require("fs"), config = require("../../config.json");

module.exports = {
  embedColor: 0x7289DA,
  hexColor: "7289DA",
  guild: "412754940885467146",
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
    for (let item of input) if (item instanceof Array && depth > 0) module.exports.flat(item, depth - 1, stack); else stack.push(item);
    return stack;
  },
  linkRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gm,
  linkDomainRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b/m,
  parseArgs: _arguments => (_arguments.match(/\"[^"]+\"|[^ ]+/g) || []).map(argument => argument.startsWith("\"") && argument.endsWith("\"") ? argument.slice(1).slice(0, -1) : argument),
  urlBlacklist: fs.readFileSync("./src/constants/url-blacklist.txt", "utf8").split("\n").map(l => l.replace("\r", "")),
  urlWhitelist: fs.readFileSync("./src/constants/url-whitelist.txt", "utf8").split("\n").map(l => l.replace("\r", "")),
  lockMessage: user => `***CHANNEL IS LOCKED BY ${user}***`,
  msToTime: ms => {
    days = Math.floor(ms / 86400000); // 24*60*60*1000
    daysms = ms % 86400000; // 24*60*60*1000
    hours = Math.floor(daysms / 3600000); // 60*60*1000
    hoursms = ms % 3600000; // 60*60*1000
    minutes = Math.floor(hoursms / 60000); // 60*1000
    minutesms = ms % 60000; // 60*1000
    sec = Math.floor(minutesms / 1000);
  
    let str = "";
    if (days) str = str + days + "d";
    if (hours) str = str + hours + "h";
    if (minutes) str = str + minutes + "m";
    if (sec) str = str + sec + "s";
  
    return str;
  },
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
    duty: "460677952812744714",
    blacklist: "573392328912404480",
    blurple: "705295796773584976",
    noreaction: "708546441563603065",
    noembed: "708546418280890370",
    muted: "442471461370724353"
  },
  publicChannels: [
    "412754940885467148", // general
    "453451178039312395", // international-channel
    "476306069581201409", // auttaja-playground
    "444135968631685120", // nonconformity-center
    "472160259020947476"  // vc-context
  ],
  badLinkLogChannel: "698215895310270484",
  blurpleCheckChannel: "707644984148492299",
  blurpleCheckLogChannel: "707688847802368080",
  afkVoiceChannel: "707945438828822579",
  backupModerationLogChannel: "759378574099742720",
  gifs: {
    ban: [
      "https://imgur.com/V4TVpbC",
      "https://i.promise.solutions/5XZ8Xc.gif",
      "https://tenor.com/view/ban-button-keyboard-press-the-ban-button-gif-16387934",
      "https://tenor.com/view/discord-ban-snap-infinity-gauntlet-thanos-gif-14155105",
      "https://tenor.com/view/star-wars-banhammer-moderator-ban-discord-gif-17302394",
      "https://tenor.com/view/trump-donaldtrump-interview-banned-cnn-gif-7677105",
      "https://tenor.com/view/banned-and-you-are-banned-explosion-yoshi-hammer-gif-17493177"
    ],
    kick: [
      "https://i.promise.solutions/kdQ96k.gif",
      "https://i.promise.solutions/ssf8i1.gif",
      "https://i.promise.solutions/wbiZFa.gif",
      "https://i.promise.solutions/dbZLp0.gif",
      "https://i.promise.solutions/8HQl90.gif",
      "https://i.promise.solutions/nEk4Oh.gif"
    ],
    mute: [
      "https://cdn.discordapp.com/attachments/442834170151174146/759384669962764288/tenor-3.gif",
      "https://tenor.com/view/i-said-quiet-shut-up-be-quiet-silent-shhh-gif-15789805",
      "https://tenor.com/view/shut-up-shhh-stop-gif-16284746",
      "https://tenor.com/view/night-crickets-chirping-silent-gif-5280277",
      "https://i.promise.solutions/LPIcpG.gif",
      "https://i.promise.solutions/9eW2w1.gif",
      "https://i.promise.solutions/GApsjU.gif",
      "https://i.promise.solutions/AbqbhV.gif",
      "https://tenor.com/view/enjoy-the-silence-depeche-mode-gif-11379313"
    ]
  }
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