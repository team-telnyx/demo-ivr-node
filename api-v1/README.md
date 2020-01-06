# Telnyx Simple IVR Demo
Telnyx Simple IVR demo built on Call Control V1 and node.js.


In this tutorial, you’ll learn how to:

1. Set up your development environment to use Telnyx Call Control using Node.
2. Build a simple IVR based on Telnyx Call Control using Node.


---

- [Prerequisites](#prerequisites)
- [Telnyx Call Control Basics](#telnyx-call-control-basics)
  - [Understanding the Command Syntax](#understanding-the-command-syntax)
  - [Telnyx Call Control Commands](#telnyx-call-control-commands)
- [Building the Voice IVR](#building-the-voice-ivr)
- [Lightning-Up the Application](#lightning-up-the-application)


---

## Prerequisites

Before you get started, you’ll need to complete these steps:

1. Have a Telnyx account, that you can create [here](https://telnyx.com/sign-up) 
2. Buy a Telnyx number on Mission Portal, that you can learn how to do [here](https://developers.telnyx.com/docs/v1/numbers/quickstarts/portal-setup)
3. Create a new Connection as Call Control on Mission Portal, that you can learn how to do [here](https://developers.telnyx.com/docs/api/v1/connections/Call-Control-Authentication-for-Connections).
4. You’ll need to have `node` installed to continue. You can check this by running the following:

```shell
$ node -v
```

If Node isn’t installed, follow the [official installation instructions](https://nodejs.org/en/download/) for your operating system to install it.

You’ll need to have the following Node dependencies installed for the Call Control API:

```js
require(express);
require(request);
```

## Telnyx Call Control Basics

For the Call Control application you’ll need to get a set of basic functions to perform Telnyx Call Control Commands. This tutorial will be using the following subset of Telnyx Call Control Commands:

- [Call Control Transfer](https://developers.telnyx.com/docs/api/v1/call-control/Call-Commands#CallControlTransfer)
- [Call Control Answer](https://developers.telnyx.com/docs/api/v1/call-control/Call-Commands#CallControlAnswer)
- [Call Control Speak](https://developers.telnyx.com/docs/api/v1/call-control/Call-Commands#CallControlSpeak)
- [Call Control Gather Using Speak](https://developers.telnyx.com/docs/api/v1/call-control/Call-Commands#CallControlSpeak)
- [Call Control Hangup](https://developers.telnyx.com/docs/api/v1/call-control/Call-Commands#CallControlHangup)

You can get the full set of available Telnyx Call Control Commands [here](https://developers.telnyx.com/docs/api/v1/call-control/).

For each Telnyx Call Control Command we will be creating a function that will execute an `HTTP POST` Request to back to Telnyx server.  To execute this API we are using Node `request`, so make sure you have it installed. If not you can install it with the following command:

```shell
$ npm install request --save
```

After that you’ll be able to use ‘request’ as part of your app code as follows:

```js
var request = require('request');
```

To make use of the Telnyx Call Control Command API you’ll need to set a Telnyx API Key and Secret. 

To check that go to Mission Control Portal and under the `Auth` tab you select `Auth V1`. Scrolling down you'll find credentials for `Call Control`

Once you have them, you can include them on the [telnyx-account.json](https://github.com/team-telnyx/demo-conference-node/blob/master/api-v1/telnyx-account.json) file.

```js
"telnyx_api_key_v1": "<your-api-v1-key-here>"
"telnyx_api_secret_v1": "<your-api-v1-secret-here>"
```

This application will also make use two PSTN numbers as destinations of the IVR. One for an Account Executive and another one for the Sales Engineer:

```js
"pstn_number_account_exec": "<pstn_number_here>",
"pstn_number_sales_eng": "<pstn_number_here>"
```

Once all dependencies are set, we can create a function for each Telnyx Call Control Command. All Commands will follow the same syntax:

```js

function call_control_COMMAND_NAME(f_call_control_id, f_INPUT1, ...){
    
    var cc_action = ‘COMMAND_NAME’

    var options = {
        url: 'https://api.telnyx.com/calls/' 
                +  f_call_control_id 
                + '/actions/' 
                + cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {
           PARAM1:  f_INPUT-1,
             ...
        } 
    };

    request.post(options,function(err,resp,body){
        if (err) { return console.log(err); }
    });  
}  
```

### Understanding the Command Syntax

There are several aspects of this function that deserve some attention:

`Function Input Parameters`: to execute every Telnyx Call Control Command you’ll need to feed your function with the following: the `Call Control ID`; and the input parameters, specific to the body of the Command you’re executing. Having these set as function input parameters will make it generic enough to reuse in different use cases:
```js
function call_control_COMMAND_NAME(f_call_control_id, f_INPUT)
```
All Telnyx Call Control Commands will be expecting the `Call Control ID` except `Dial`. There you’ll get a new one for the leg generated as response.

`Name of the Call Control Command`: as detailed [here](https://developers.telnyx.com/docs/api/v1/overview), the Command name is part of the API URL. In our code we call that the `action` name, and will feed the POST Request URL later:
```js
var cc_action = ‘COMMAND_NAME’
```

`Building the Telnyx Call Control Command`: once you have the Command name defined, you should have all the necessary info to build the complete Telnyx Call Control Command:
```js
var options = {
    url: 'https://api.telnyx.com/calls/' 
            +  f_call_control_id 
            + '/actions/' 
            + cc_action,
    auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
    },
    form: {
        PARAM:  f_INPUT, 
    } 
};
```
In this example you can see that `Call Control ID` and the Action name will feed the URL of the API, both Telnyx Key and Telnyx Secret feed the Authentication headers, and the body will be formed with all the different input parameters  received for that specific Command. 


`Calling the Telnyx Call Control Command`: Having the request  `headers` and `options`/`body` set, the only thing left is to execute the `POST Request` to execute the command. 
For that we are using making use of the node's `request` module:
```js
 request.post(options,function(err,resp,body){
    if (err) { return console.log(err); }
});  
```

### Telnyx Call Control Commands

This is how every Telnyx Call Control Command used in this application would look like:

#### Call Control Transfer

```js
function call_control_transfer(f_call_control_id, f_dest, f_orig) {

    var cc_action = 'transfer'

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {
            to: f_dest,
            from: f_orig,
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
    });
}
```

#### Call Control Answer

```js
function call_control_answer_call(f_call_control_id, f_client_state_s) {

    var l_cc_action = 'answer';
    var l_client_state_64 = null;

    if (f_client_state_s)
        l_client_state_64 = Buffer.from(f_client_state_s).toString('base64');

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {
            client_state: l_client_state_64 
        }
    };
    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
    });
}
```

#### Call Control Gather Using Speak

```js
function call_control_speak(f_call_control_id, f_tts_text){
    var cc_action = 'speak'
    var options = {
        url: 'https://api.telnyx.com/calls/' 
                +  f_call_control_id 
                + '/actions/' 
                + cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {
            payload:  f_tts_text,
            voice:    g_ivr_voice,
            language: g_ivr_language,
        } 
    };                   
    request.post(options,function(err,resp,body){
        if (err) { return console.log(err); }
            console.log(body);
    });  
}
```

#### Call Control Gather Using Speak

```js
function call_control_gather_using_speak(f_call_control_id, f_tts_text, f_gather_digits, f_gather_max, f_client_state_s) {

    var l_cc_action = 'gather_using_speak';
    var l_client_state_64 = null;

    if (f_client_state_s)
        l_client_state_64 = Buffer.from(f_client_state_s).toString('base64');

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {
            payload: f_tts_text,
            voice: g_ivr_voice,
            language: g_ivr_language,
            valid_digits: f_gather_digits,
            max: f_gather_max,
            client_state: l_client_state_64
        }
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
    });
}
```

#### Call Control Hangup

```js
function call_control_hangup(f_call_control_id) {

    var l_cc_action = 'hangup';

    var options = {
        url: 'https://api.telnyx.com/calls/' +
            f_call_control_id +
            '/actions/' +
            l_cc_action,
        auth: {
            username: f_telnyx_api_key_v1,
            password: f_telnyx_api_secret_v1
        },
        form: {}
    };

    request.post(options, function (err, resp, body) {
        if (err) {
            return console.log(err);
        }
    });
}
```

`Client State`: within some of the Telnyx Call Control Commands list we presented, you probably noticed we were including the `Client State` parameter. `Client State` is the key to ensure that we can have several levels on our IVR while consuming the same Call Control Events. 

Because Call Control is stateless and async your application will be receiving several events of the same type, e.g. user just included `DTMF`. With `Client State` you enforce a unique ID to be sent back to Telnyx which be used within a particular Command flow and identifying it as being at Level 2 of a certain IVR for example.


## Building the Voice IVR


With all the basic Telnyx Call Control Commands set, we are ready to consume them and put them in the order that will create the IVR. For this tutorial we want to keep it simple with a flow that corresponds to the following IVR Logic:

1. handle an incoming call
2. greet and use text-to-speech to indicate all options
3. digest DTMS to navigate the user through the voice menus and redirect the call to an agent


<p align="center">
    <img src="https://raw.githubusercontent.com/team-telnyx/demo-ivr-node/master/examples/ivr_flow_example.png" width="90%" height="90%" title="sms_otp_example">
</p>


To exemplify this process we created a simple API call that will be exposed as the webhook in Mission Portal. For that we would be using `express`:

```shell
$ npm install request --save
```

With `express` we can create an API wrapper that uses `HTTP GET` to call our Request Token method:

```js
rest.post('/'+g_appName+'/ivr-test, function (req, res) {
  // IVR CODE GOES HERE  
})
```

This would expose a webhook like the following: 

    http://MY_DOMAIN_URL/telnyx-ivr/ivr-test

You probably noticed that `g_appName` in  the previous point. That is part of a set of global variables we are defining with a certain set of info we know we are going to use in this app: TTS parameters, like voice and language to be used. 

You can set these at the beginning of your code:

```js
// Application:
const g_appName = "demo-telnyx-ivr";

// TTS Options
const g_ivr_voice     = 'female';
const g_ivr_language  = 'en-US';

```

With that set, we can fill in that space that we named as `IVR CODE GOES HERE`. So as you expose the URL created as Webhook in Mission Control associated with your number, you’ll start receiving all call events for that call. 

So the first thing to be done is to identify the kind of event you just received and extract the `Call Control Id` and `Client State` (if defined previously):

```js
if (req && req.body && req.body.event_type){
    var l_hook_event_type = req.body.event_type;
    var l_call_control_id = req.body.payload.call_control_id;
    var l_client_state_64 = req.body.payload.client_state;
} else{res.end('0');}
```

Once you identify the `Event Type` received, it’s just a matter of having your application reacting to that. Is the way you react to that Event that helps you creating the IVR logic. What you would be doing is to execute Telnyx Call Control Command as a reaction to those Events.

### `Webhook Call Initiated >> Command Answer Call`

```js
if (l_hook_event_type =='call_initiated') {
    if (req.body.payload.direction == 'incoming')
        call_control_answer_call(l_call_control_id, null);
    else
     call_control_answer_call(l_call_control_id,'stage-outgoing');
    res.end();   
}
```

### `Webhook Call Answered >> Command Gather Using Speak`

Once your app is notified by Telnyx that the call was established you want to initiate your IVR. You do that using the Telnyx Call Control Command `Gather Using Speak`, with the IVR Lobby message.

As part of the `Gather Using Speak` Command we indicate that valid digits for the `DTMF` collection are 1 and 2, and that only 1 digit input would be valid. Since this is Lobby level, `client_state` will ne null at this point.

```js
else if (l_hook_event_type=='call_answered'){  
    if (!l_client_state_64)
        // No State >> Incoming >> Gather Input
        call_control_gather_using_speak(l_call_control_id, 
              'Welcome to this Telnyx IVR Demo,'
            + 'To contact sales please press 1,' 
            + 'To contact operations, please press 2.' 
            + '12', '1', null);
    res.end();
}
```

Please note that if a `client_state` different than null would be received with the Call Answered Webhook, this would be an event coming from another leg and nothing would be done then. We will get into that later.


### `Webhook Speak Ended >> Do Nothing`
Your app will be informed that the Speak executed ended at some point. For the IVR we are doing nothing with that info, but we will need to reply to that command. 

```js
else if (l_hook_event_type =='speak_ended'){
 res.end();
}
```

*Important Note: For consistency Telnyx Call Control engine requires every single Webhook to be replied by the Webhook end-point, otherwise will keep trying. For that reason we have to be ready to consume every Webhook we expect to receive and reply with `200 OK`.*

### `Webhook Call Bridged >> Do Nothing`
Your app will be informed that the call was bridged at some point. For the IVR we are doing nothing with that info, but we will need to reply to that command. 


```js
else if (l_hook_event_type == call_bridged){
 res.end();
}
```

### `Webhook Gather Ended >> IVR Logic`
It’s when you receive the Webhook informing your application that Call Control `Gather Ended` (DTMF input) that the IVR magic happens:


```js
else if (l_hook_event_type =='gather_ended'){
    // Receive DTMF Option
    var l_ivr_option = req.body.payload.digits;


    // Check Current IVR Level

    if (!l_client_state_64){ // IVR Lobby

        if (l_ivr_option == '1'){ // Sales

            // Speak Text
            call_control_gather_using_speak(l_call_control_id, 
               'You reached the sales support channel,' 
             + 'To contact an Account Executive please press 1,' 
             + 'To contact a Sales Engineer, please press 2,'
             +  '12','1','stage-sales');

        } else if (l_ivr_option == '2'){  // Operations

            // Speak Text
            call_control_speak(l_call_control_id, 
               'You reached the operations support channel,' 
             + 'no operations staff is available at the moment,' 
             + 'please try again later');

    } else{  // Beyond Lobby Level

        // Set Client State 
        var l_client_state_buff = 
              new Buffer(l_client_state_64, 'base64');
        var l_client_state_s =
              l_client_state_buff.toString('ascii');

        // Selected Sales >> Choose Destination
        if (l_client_state_s == "stage-sales"){

            // Select Destination

            if (l_ivr_option == '1'){
                // Dial AE
                call_control_transfer(l_call_control_id,
                     g_sip_agent, req.body.payload.from);

            } else if (l_ivr_option == '2'){
                // Dial Sales Engineer
                 call_control_transfer(l_call_control_id,
                     g_sales_eng, req.body.payload.from);
            } 

        }

    }
    res.end();
}
```

The first thing we are doing there is to collect digits received. After that we look at the `client_state` value of the Webhook received: if `null` the DTMF input received was coming from the IVR Lobby; otherwise it is coming from more advanced levels (in this example that would be just a second level).

#### Client State is Null > IVR Lobby

If Webhook comes from the IVR Lobby there are two possible scenarios: the user selected 1 (Sales); or the user selected 2 (Operations).

If it selected Sales, then we use another `Call Control Gather Using Speak` to check whether he wants to contact an Account Executive or a Sales Engineer. If selected Operations, we simulate an out of service logic by executing a `Call Control Speak Command` saying that no one is available.

#### Client State is Not Null > Sales

If the Webhook non-null it means that this all `Control Gather Ended` is related to the second level of our IVR, i.e. the previous `Call Control Gather Using Speak` for Sales that we just described.

In this case we will look at the DTMF input the user provided and use the `Call Control Transfer Command` to transfer the call to: an Account Executive in the case DTMF provided was 1; or to a Sales Engineer in the case the DTMF provided was 2.

## Lightning-Up the Application
Finally the last piece of the puzzle is having your application listening for Telnyx Webhooks:

```js
var server = rest.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
})
```

And start the application by executing the following command:

```shell
$ node demo-ivr-node.js
```




