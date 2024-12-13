const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

// Initialize the bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
const SERVER_URL = "http://localhost:3000/templates";  // Your server URL where templates are stored

client.once('ready', () => {
  console.log(`Bot is logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'template') {
    const templateName = interaction.options.getString('name');

    // Fetch templates from the server
    try {
      const response = await axios.get(SERVER_URL);
      const templates = response.data;

      const template = templates.find(t => t.name.toLowerCase() === templateName.toLowerCase());

      if (!template) {
        await interaction.reply({ content: `Template "${templateName}" not found.`, ephemeral: true });
        return;
      }

      // Respond with the template details
      const embed = new EmbedBuilder()
        .setTitle(template.name)
        .setDescription(template.description)
        .setURL(template.link)
        .setColor(0x7289da)
        .setFooter({ text: "Click the link to use the template." });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching templates:", error);
      await interaction.reply({ content: "There was an error fetching templates.", ephemeral: true });
    }
  }
});

// Register commands
client.on('ready', async () => {
  const guild = client.guilds.cache.get("YOUR_GUILD_ID");
  if (!guild) return console.error("Guild not found.");

  await guild.commands.set([
    {
      name: 'template',
      description: 'Load a Discord template by name.',
      options: [
        {
          name: 'name',
          description: 'The name of the template to load.',
          type: 3, // STRING
          required: true,
        },
      ],
    },
  ]);

  console.log("Commands registered.");
});

// Log in the bot
client.login(BOT_TOKEN);
