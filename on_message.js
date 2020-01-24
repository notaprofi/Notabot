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
                // !ping
                case 'ping':
                    this.ping(message);
                    break;
                case 'list':
                    this.listUsers(message);
                    break;
             }
         }
    },

    ping: function(message) {
        message.channel.send('pong');
    },
    
    listUsers: function(message) {
        var members = message.guild.members.array();
        var text = '';
        text += members.length + ' users' + '\n';
        for(let member of members) {
            text += member.displayName + '\n';
        }
        message.channel.send(text);
    }
}