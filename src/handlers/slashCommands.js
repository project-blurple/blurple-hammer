const { guilds, functions: { getPermissionLevel }, roles, emojis } = require("../constants"), fs = require("fs");

module.exports = async client => {
  registerCommands(client).then(() => console.log("Slash Commands have been registered."));

  client.ws.on("INTERACTION_CREATE", async interaction => {
    const commandFile = require(`../commands/slash/${interaction.data.name}.js`);

    const
      member = client.guilds.cache.get(guilds.main).members.cache.get(interaction.member.user.id),
      permissionLevel = getPermissionLevel(member);
    if (commandFile.permissionRequired > permissionLevel) return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 4, data: { content: `${emojis.tickno} You don't have permission to do this.`, flags: 64 } }});

    return commandFile.run({
      client, interaction, member,
      guild: member.guild,
      channel: member.guild.channels.cache.get(interaction.channel_id),
      respond: (content = null, hidden = false) => {
        let data = { flags: hidden ? 64 : 0 }, type = 4;
        if (!content) type = 5;
        else if (typeof content == "string") data.content = content;
        else data.embeds = [ content ];

        return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type, data }});
      },
      edit: content => client.api.webhooks(client.user.id, interaction.token).messages["@original"].patch({ data: { content }}),
    }, getSlashArgs(interaction.data.options || []));
  });
};

function getSlashArgs(options) {
  const args = {};
  for (const o of options) {
    if (o.type == 1) args[o.name] = getSlashArgs(o.options || []);
    else args[o.name] = o.value;
  }
  return args;
}

async function registerCommands(client) {
  // remove old commands
  let registered = await client.api.applications(client.user.id).guilds(guilds.main).commands.get();
  await Promise.all(registered
    .filter(c => !commands.get(c.name))
    .map(({ id }) => 
      client.api.applications(client.user.id).guilds(guilds.main).commands[id].delete()
    )
  );

  // register commands
  await Promise.all([...commands.keys()]
    .filter(name => {
      const
        c1 = commands.get(name) || {},
        c2 = registered.find(s => s.name == name);
      if (
        !c2 ||
        c1.description !== c2.description ||
        JSON.stringify(c1.options || []) !== JSON.stringify(c2.options || [])
      ) return true; else return false;
    })
    .map(name => { 
      const { description, options } = commands.get(name);
      return client.api.applications(client.user.id).guilds(guilds.main).commands.post({ data: { name, description, options } });
    })
  );

  registered = await client.api.applications(client.user.id).guilds(guilds.main).commands.get();
  let registeredPermissions = await client.api.applications(client.user.id).guilds(guilds.main).commands.permissions.get();
  await client.api.applications(client.user.id).guilds(guilds.main).commands.permissions.put({ data: registered
    .filter(({ id, name }) => {
      const { permissions } = registeredPermissions.find(c => c.id == id) || { permissions: [] }, { permissionRequired } = commands.get(name);
      if (permissionRequired &&
        JSON.stringify(permissions.filter(p => p.permission == true).map(p => p.id).sort()) !==
        JSON.stringify(permissionRoles[commands.get(name).permissionRequired || 0])
      ) return true; else return false;
    }).map(({ id, name }) => {
      const { permissionRequired } = commands.get(name);
      return { id, permissions: permissionRoles[permissionRequired].map(role => ({ id: role, type: 1, permission: true }))};
    })});
}

let prev = [];
const permissionRoles = [
  null,
  roles.assistant,
  roles.helper,
  roles.mod,
  roles.executiveassistant,
  roles.executive,
  roles.admin,
  null // god
].reverse().map(role => prev = [ role, ...prev ].filter(r => r !== null)).reverse();

// loading commands
const commands = new Map();
fs.readdir("./src/commands/slash/", (err, files) => {
  if (err) return console.log(err);
  for (const file of files) if (file.endsWith(".js")) {
    const commandFile = require(`../commands/slash/${file}`), fileName = file.replace(".js", "");
    commands.set(fileName, commandFile);
  }
});