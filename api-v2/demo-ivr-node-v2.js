// ================================================= Telnyx Simple IVR =================================================

// Description:
// This simple app is creating a simple IVR to test Telnyx Call Control API v2

// Author:
// Filipe Leitão (filipe@telnyx.com)

// Application:
const g_appName = "demo-telnyx-ivr";

// TTS Options
const g_ivr_voice = 'female';
const g_ivr_language = 'en-GB';

// ======= Naming Conventions =======
// = g_xxx: global variable
// = f_xxx: function variable
// = l_xxx: local variable
// ==================================

// ======================================================================================================================

var express = require('express');
var request = require('request');
var fs = require("fs");


// =============== Telnyx Account Details ===============

var configs = fs.readFileSync("telnyx-account-v2.json");
var jsonConfigs = JSON.parse(configs);

const g_telnyx_api_auth_v2 = jsonConfigs.telnyx_api_auth_v2;
const g_pstn_number_account_exec = jsonConfigs.pstn_number_account_exec;
const g_pstn_number_sales_eng = jsonConfigs.pstn_number_sales_eng;


// =============== RESTful API Creation ===============

var rest = express();

rest.use(express.json()); // to parse json body


// ================================================ AUXILIARY FUNCTIONS  ================================================

function get_timestamp() {

    var now = new Date();

    return 'utc|' + now.getUTCFullYear() +
        '/' + (now.getUTCMonth() + 1) +
        '/' + now.getUTCDate() +
        '|' + now.getHours() +
        ':' + now.getMinutes() +
        ':' + now.getSeconds() +
        ':' + now.getMilliseconds();

}

// =========================================== TELNYX CALL CONTROL COMMANDS  ============================================


// Telnyx Call Control - Transfer
function call_control_transfer(f_telnyx_api_auth_v2, f_call_control_id, f_dest, f_orig) {

    var cc_action = 'transfer'

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            cc_action,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + f_telnyx_api_auth_v2
        },
        json: {
            to: f_dest,
            from: f_orig,
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
        console.log("[%s] DEBUG - Command Executed [%s]", get_timestamp(), cc_action);
        console.log(body);
    });
}

// Telnyx Call Control - Answer Call
function call_control_answer_call(f_telnyx_api_auth_v2, f_call_control_id, f_client_state_s) {

    var l_cc_action = 'answer';

    var l_client_state_64 = null;

    if (f_client_state_s)
        l_client_state_64 = Buffer.from(f_client_state_s).toString('base64');


    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + f_telnyx_api_auth_v2
        },
        json: {
            client_state: l_client_state_64 //if inbound call >> null
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
        console.log("[%s] DEBUG - Command Executed [%s]", get_timestamp(), l_cc_action);
        console.log(body);
    });
}

// Telnyx Call Control - Speak
function call_control_speak(f_telnyx_api_auth_v2, f_call_control_id, f_tts_text) {

    var cc_action = 'speak'

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            cc_action,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + f_telnyx_api_auth_v2
        },
        json: {
            payload: f_tts_text,
            voice: g_ivr_voice,
            language: g_ivr_language,
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
        console.log("[%s] DEBUG - Command Executed [%s]", get_timestamp(), cc_action);
        console.log(body);
    });
}

// Telnyx Call Control - Gather Using Speak
function call_control_gather_using_speak(f_telnyx_api_auth_v2, f_call_control_id, f_tts_text, f_gather_digits, f_gather_max, f_client_state_s) {

    var l_cc_action = 'gather_using_speak';
    var l_client_state_64 = null;

    if (f_client_state_s)
        l_client_state_64 = Buffer.from(f_client_state_s).toString('base64');

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + f_telnyx_api_auth_v2
        },
        json: {
            payload: f_tts_text,
            voice: g_ivr_voice,
            language: g_ivr_language,
            valid_digits: f_gather_digits,
            max: f_gather_max,
            client_state: l_client_state_64 //if lobby level >> null
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
        console.log("[%s] DEBUG - Command Executed [%s]", get_timestamp(), l_cc_action);
        console.log(body);
    });
}


// Call Control - Hangup
function call_control_hangup(f_telnyx_api_auth_v2, f_call_control_id) {

    var l_cc_action = 'hangup';

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,

        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + f_telnyx_api_auth_v2
        },
        json: {}
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
        console.log("[%s] DEBUG - Command Executed [%s]", get_timestamp(), l_cc_action);
        console.log(body);
    });
}


// ================================================    WEBHOOK API IVR   ================================================


// POST - Receive Number: https://<your_webhook_url>:8081/demo-telnyx-ivr/ivr-demo

rest.post('/' + g_appName + '/ivr-demo', function (req, res) {


    if (req && req.body && req.body.event_type) {
        var l_hook_event_type = req.body.event_type;
        var l_call_control_id = req.body.payload.call_control_id;
        var l_client_state_64 = req.body.payload.client_state;
    } else {
        console.log("[%s] LOG - Invalid Webhook received!", get_timestamp());
        res.end('0');
    }

    console.log("[%s] LOG - Webhook received - call_control_id [%s]", get_timestamp(), l_call_control_id)
    console.log("[%s] DEBUG - Webhook received - complete payload: %s", get_timestamp(), JSON.stringify(req.body, null, 4))



    // Call Innitiated >> Answer Call
    if (l_hook_event_type == 'call_initiated') {

        if (req.body.payload.direction == 'incoming')
            call_control_answer_call(g_telnyx_api_auth_v2, l_call_control_id, null);
        else
            call_control_answer_call(g_telnyx_api_auth_v2, l_call_control_id, 'stage-outgoing');

        res.end();

    } else if (l_hook_event_type == 'call_answered') {

        if (!l_client_state_64)
            // No State >> Incoming >> Gather Input
            call_control_gather_using_speak(g_telnyx_api_auth_v2, l_call_control_id,
                'Welcome to this Telnyx IVR Demo,' +
                'To contact sales please press 1,' +
                'To contact operations, please press 2.',
                '12', '1', null);

        // State >> Outbound >> Do Nothing

        res.end();

        // Speach Ended >> Do Nothing
    } else if (l_hook_event_type == 'speak_ended') {

        res.end();

        // Call Bridged >> Do Nothing
    } else if (l_hook_event_type == 'call_bridged') {

        res.end();

        // Gather Ended >> Proccess DTMF Input
    } else if (l_hook_event_type == 'gather_ended') {

        // Receive DTMF Option
        var l_ivr_option = req.body.payload.digits;

        console.log("[%s] DEBUG - RECEIVED DTMF [%s]", get_timestamp(), l_ivr_option);

        // Check Current IVR Level

        if (!l_client_state_64) { // IVR Lobby

            if (l_ivr_option == '1') { // Sales

                // Speak Text
                call_control_gather_using_speak(g_telnyx_api_auth_v2, l_call_control_id,
                    'You reached the sales support channel,' +
                    'To contact an Account Executive please press 1,' +
                    'To contact a Sales Engineer, please press 2,',
                    '12', '1', 'stage-sales');

            } else if (l_ivr_option == '2') { // Operations

                // Speak Text
                call_control_speak(g_telnyx_api_auth_v2, l_call_control_id,
                    'You reached the operations support channel,' +
                    'no operations staff is available at the moment,' +
                    'please try again later');

            }

        } else { // Beyond Lobby Level

            // Set Client State
            var l_client_state_buff = new Buffer(l_client_state_64, 'base64');
            var l_client_state_s = l_client_state_buff.toString('ascii');

            // Selected Sales >> Choose Destination
            if (l_client_state_s == "stage-sales") {

                // Select Destination

                if (l_ivr_option == '1') {
                    // Dial Account Executive
                    call_control_transfer(g_telnyx_api_auth_v2, l_call_control_id, g_pstn_number_account_exec, req.body.payload.from);

                } else if (l_ivr_option == '2') {
                    // Dial Sales Engineer
                    call_control_transfer(g_telnyx_api_auth_v2, l_call_control_id, g_pstn_number_sales_eng, req.body.payload.from);
                } else {
                    // Go to Extensions
                }

            }

        }


        res.end();

    }

})



// ================================================ RESTful Server Start ================================================

var server = rest.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port


    console.log("[%s] SERVER - " + g_appName + " app listening at http://%s:%s", get_timestamp(), host, port)

})
