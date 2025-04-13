const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')


const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const rankCommand = require('./plugins/rank')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const { tmpdir } = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ['27683913716']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
    const sessdata = config.SESSION_ID.replace("Aamon-FL~bIpUGCRT#yw1hys4GFUjBebTP0dpK-JZ3VfUfPx9U29JuQ3db-6I", '');
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
    filer.download((err, data) => {
        if(err) {
            console.error("[SESSION DOWNLOAD ERROR]", err); // Debugging log added
            throw err;
        }
        fs.writeFile(__dirname + '/sessions/creds.json', data, (err) => {
            if (err) {
                console.error("[SESSION WRITE ERROR]", err); // Debugging log added
                throw err;
            }
            console.log("SESSION DOWNLOADED COMPLETED ✅");
        });
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;


async function connectToWA() {
    console.log("CONNECTING Aamon-FL 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    var { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
            logger: P({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS("Firefox"),
            syncFullHistory: true,
            auth: state,
            version
    });

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        console.log("[CONNECTION UPDATE]", update); // Debugging log added

        if (connection === 'close') {
            const error = lastDisconnect?.error;
            console.error("[CONNECTION CLOSED]", error?.output?.payload || error?.message || "Unknown error"); // Debugging log added

            if (error?.output?.statusCode !== DisconnectReason.loggedOut) {
                console.log("[RECONNECTING] Attempting to reconnect...");
                connectToWA();
            } else {
                console.error("[LOGGED OUT] Session has been logged out. Please re-authenticate.");
            }
        } else if (connection === 'open') {
            console.log('♻️ INSTALLING PLUGINS FILES PLEASE WAIT... 🪄');
            try {
                fs.readdirSync("./plugins/").forEach((plugin) => {
                    if (path.extname(plugin).toLowerCase() == ".js") {
                        require("./plugins/" + plugin);
                    }
                });
                console.log('PLUGINS FILES INSTALL SUCCESSFULLY ✅');
                console.log('Aamon-FL CONNECTED TO WHATSAPP ENJOY ✅');
            } catch (err) {
                console.error("[PLUGIN LOAD ERROR]", err); // Debugging log added
            }

            let up = `*╭──────────────●●►*
> *➺ Aamon-FL ᴄᴏɴɴᴇᴄᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ ᴛʏᴘᴇ .ᴍᴇɴᴜ ᴛᴏ ᴄᴏᴍᴍᴀɴᴅ ʟɪsᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ FluffyFox ✅*

*https://whatsapp.com/channel/0029Vac8SosLY6d7CAFndv3Z*

*YOUR BOT ACTIVE NOW ENJOY♥️🪄*\n\n*PREFIX: ${prefix}*

*╰──────────────●●►*`;
            conn.sendMessage(conn.user.id, { image: { url: config.MENU_IMG }, caption: up });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        try {
            console.log("[MESSAGE RECEIVED]", mek); // Debugging log added
            mek = mek.messages[0];
            if (!mek.message) return;
            mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                ? mek.message.ephemeralMessage.message
                : mek.message;

            // Additional message handling logic here...

        } catch (err) {
            console.error("[MESSAGE HANDLING ERROR]", err); // Debugging log added
        }
    });
}

app.get("/", (req, res) => {
    res.send("HEY, Aamon-FL STARTED ✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA()
}, 4000);
