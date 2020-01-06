# A Call Control Based IVR System

The [Call Control framework](https://developers.telnyx.com/docs/api/v2/call-control) is a set of REST APIs that allow you to control the complete call flow from the moment a call comes in (or out) to the moment you terminate that call. In between you will receive a number of [webhooks](https://developers.telnyx.com/docs/v2/call-control/receiving-webhooks) for each step of the call, to which you answer with a [command](https://developers.telnyx.com/docs/v2/call-control/sending-commands) of your need. It's this back and forward communication that makes Call Control so great in terms of the granular control you have for your call.

It's by digesting webhooks sent by Telnyx and sending commands back that you can build your IVR system.


## Building the Voice IVR

With all the basic Telnyx Call Control Commands set, we are ready to consume them and put them in the order that will create the IVR. For this tutorial we want to keep it simple with a flow that corresponds to the following IVR Logic:

1. handle an incoming call
2. greet and use text-to-speech to indicate all options
3. digest DTMF to navigate the user through the voice menus and redirect the call to an agent


<p align="center">
    <img src="https://raw.githubusercontent.com/team-telnyx/demo-ivr-node/master/examples/ivr_flow_example.png" width="90%" height="90%" title="sms_otp_example">
</p>


## Complete Running Call Control IVR

To help you understand the concepts we just walk you through, we build two `node.js` applications in both Call Control V1 and V2 versions of the API.

We invite you to have a deeper look in order to see the differences and step-by-step instructions:

1. [Telnyx IVR System Demo in API v1](https://github.com/team-telnyx/demo-ivr-node/tree/master/api-v1)
2. [Telnyx IVR System Demo in API v2](https://github.com/team-telnyx/demo-ivr-node/tree/master/api-v2)