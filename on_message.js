module.exports = {
    on_message: function(message) {
        if (!message.guild) {
            message.channel.send('You are not from the guild!');
            return;
        }
        // If the message is "ping"
        if (message.content.substring(0, 1) == '!') {
            var args = message.content.substring(1).split(' ');
            var cmd = args[0];
           
            args = args.splice(1);
            switch(cmd) {
                case 'help':
                    this.help(message);
                    break;
                case 'notatest':
                    this.test(message);
                    break;
                case 'listUsers':
                    this.listUsers(message);
                    break;
                case 'countRoles':
                    this.countRoles(message);
                    break;
            }
        }
    },

    help: function(message) {
        var text = 'Available commands:\n';
        text += '!help - show this text\n';
        text += '!notatest - check if the bot is online\n';
        text += '!listUsers - show users table\n';
        text += '!countRoles - show roles table\n';
        message.channel.send(text);
    },

    test: function(message) {
        message.channel.send('Notabot is online');
    },
    
    listUsers: function(message) {
        var members = message.guild.members.array();
        var text = '```';
        text += members.length + ' members total.' + '\n';
        text += this.pad('id',20) + '\t' + this.pad('displayName') + '\t' + this.pad('joinDate') + '\t' + 'lastMessageDate' + '\n';
        var i = 0;
        for(let member of members) {
            text += this.pad(member.id,20) + '\t' + this.pad(member.displayName) + '\t' + this.pad(member.joinedAt) + '\t' + (member.lastMessage ? member.lastMessage.createdAt : '') + '\n';
            i++;
            if(i >= 15) {
                text += '```';
                message.channel.send(text);
                text = '```';
                i = 0;
            }
        }
        text += '```';
        message.channel.send(text);
    },

    countRoles: function(message) {
        // create role array
        var roles = message.guild.roles.array();
        var roles_count = {};
        for(let role of roles) {
            roles_count[role.name] = 0;
        }
        roles_count["{NO ROLE}"] = 0;
        // count roles
        var members = message.guild.members.array();
        for(let member of members) {

            var member_roles = member.roles.array();
            for(let mr of member_roles) {
                roles_count[mr.name]++;
            }

            if ( member_roles.length <= 1 ) { // only everyone
                roles_count["{NO ROLE}"]++;
            }
            
        }
        // output roles count
        var text = '```\n';
        var i = 0;
        for(let name in roles_count) {
            var rolename = name;
            if(rolename == "@everyone")
                rolename = "everyone";
            text += this.pad(rolename) + roles_count[name] + '\n';
            i++;
            if(i >= 50) {
                text += '```';
                message.channel.send(text);
                text = '```\n';
                i = 0;
            }
        }
        text += '```';
        message.channel.send(text);
    },

    pad: function(str, length = 30) {
        var pad = Array(length).join(' ');
        var padLeft = false;
        if (typeof str === 'undefined') 
          return pad;
        if (padLeft) {
          return (pad + str).slice(-pad.length);
        } else {
          return (str + pad).substring(0, pad.length);
        }
      }
}