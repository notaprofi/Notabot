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
           
            switch(cmd) {
                case 'help':
                    this.help(message);
                    break;
                case 'notatest':
                    this.test(message);
                    break;
                case 'listUsers':
                    this.listUsers(message, false);
                    break;
                case 'listMembers':
                    this.listUsers(message, true);
                    break;
                case 'listUsersShort':
                    this.listUsers2(message, false);
                    break;
                case 'listMembersShort':
                    this.listUsers2(message, true);
                    break;
                case 'listUsersIds':
                    this.listUsers3(message, false);
                    break;
                case 'listMembersIds':
                    this.listUsers3(message, true);
                    break;
                case 'countRoles':
                    this.countRoles(message);
                    break;
                case 'inactivity':
                    this.inactivity(message, args[1]);
                    break;
            }
        }
    },

    help: function(message) {
        var text = 'Available commands:\n';
        text += '!help - show this text\n';
        text += '!notatest - check if the bot is online\n';
        text += '!listUsers - show users table\n';
        text += '!listUsersShort - show a smaller users table\n';
        text += '!listUsersIds - show only users Ids\n';
        text += '!listMembers, !listMembersShort, !listMembersIds - the same as above, but list only people with at least 1 role\n';
        text += '!countRoles - show roles table\n';
        text += '!inactivity NDAYS - show people who are offline for NDAYS+ days\n';
        message.channel.send(text);
    },

    test: function(message) {
        message.channel.send('Notabot is online');
    },
    
    listUsers: function(message, showOnlyMembersWithARole) {
        var members = message.guild.members.array();
        var text = '```';
        text += members.length + ' users total.' + '\n';
        text += this.pad('id',20) + '\t' + this.pad('displayName') + '\t' + this.pad('joinDate') + '\t' + 'lastMessageDate' + '\n';
        var i = 0;
        for(let member of members) {
            if ( member.roles.array().length <= 1 && showOnlyMembersWithARole) { // only everyone
                continue;
            }

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

    listUsers2: function(message, showOnlyMembersWithARole) {
        var members = message.guild.members.array();
        var text = '```';
        text += members.length + ' users total.' + '\n';
        text += this.pad('id',20) + '\t' + this.pad('displayName') + '\n';
        var i = 0;
        for(let member of members) {
            if ( member.roles.array().length <= 1 && showOnlyMembersWithARole) { // only everyone
                continue;
            }

            text += this.pad(member.id,20) + '\t' + this.pad(member.displayName) + '\n';
            i++;
            if(i >= 30) {
                text += '```';
                message.channel.send(text);
                text = '```';
                i = 0;
            }
        }
        text += '```';
        message.channel.send(text);
    },
    
    listUsers3: function(message, showOnlyMembersWithARole) {
        var members = message.guild.members.array();
        var text = '```';
        text += members.length + ' users total.' + '\n';
        text += this.pad('id',20) + '\n';
        var i = 0;
        for(let member of members) {
            if ( member.roles.array().length <= 1 && showOnlyMembersWithARole) { // only everyone
                continue;
            }

            text += this.pad(member.id,20) + '\n';
            i++;
            if(i >= 90) {
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

    inactivity: function(message, MaxOffDays = 180) {
        MaxOffDays = Number(MaxOffDays);
        if (MaxOffDays > 30) {
            MaxOffDays = 30;
            message.channel.send('Sorry, the max parameter is 30.');
        }
        const timePerUser = 5000;
        var members = message.guild.members.array();
        message.channel.send('I am looking for members with a role who are ' + MaxOffDays + ' or more days offline.\nI will be done in less than ' + members.length*timePerUser/60000 + ' minutes.');
        var text = 'Here we go: \n';
        var iLines = 0;
        for(let iM = 0; iM < members.length; iM++) {
            let member = members[iM];
            if (member.hasPermission(['KICK_MEMBERS']) || member.roles.array().length == 1 || member.presence.status != 'offline') {
                member.nOffDays = 0; // don't check: a) moderators, b) people with no roles, c) people who are online atm
                continue;
            }
            setTimeout( function() {
                console.log(member.displayName + " GO!\n");
                module.exports.daysOffline(message, member, MaxOffDays);
            }, iM*timePerUser);
        }
        setTimeout( function() {
            for(let member of members) {
                if (member.nOffDays <= 0 || member.nOffDays == undefined) 
                    continue;
                text += '<@' + member.id + '>' + '\n';
                iLines++;
                if(iLines >= 1900/32) {
                    message.channel.send(text);
                    iLines = 0;
                }
            }
            message.channel.send(text);
            console.log("DONE!\n");
        }, members.length*timePerUser);
    },

    /*daysOffline_next: function(message, member, N) {
        console.log(member.displayName + " daysOffline_next\n");
        return this.daysOffline_do(message, member, N).then(function(result) {
            if (result === true) {
                return this.daysOffline(message, member, N+30);
            } else {
                console.log(member.displayName + " N-30 = " + N-30);
                return N-30;
            }
        });
    },*/
    
    daysOffline: function(message, member, N) {
        return new Promise(function(resolve, reject) {
            var nGuests = 0;
            var nGuestsPlus = 0;
            
            message.guild.pruneMembers(N, true)
            .then(function(result) {
                nGuests = result;
            }).then(() => {

                var member_roles = member.roles.array();
                var roles_backup = [];
                for(let i = 0; i < member_roles.length; i++) {
                    let role = member_roles[i];
                    //console.log(role.name);
                    roles_backup.push(role);
                }

                member.removeRoles(roles_backup)
                .then(() => {
                    
                    nGuestsPlus = message.guild.pruneMembers(N, true).then(function(result) {
                        nGuestsPlus = result;
                    }).then(() => {
                        member.addRoles(roles_backup).then(() => {
                            console.log(" resolve = " + (nGuestsPlus > nGuests));
                            if(nGuestsPlus > nGuests) {
                                member.nOffDays = N;
                            }
                            resolve(nGuestsPlus > nGuests);
                        });
                    });
                });
            });

        });
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