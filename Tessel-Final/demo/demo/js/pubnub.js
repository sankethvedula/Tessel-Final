 function publish() {

     pubnub = PUBNUB.init({
         publish_key   : 'pub-c-1b4c611a-ecc4-4105-9184-ad449d22c5b3',
         subscribe_key : 'sub-c-ff908b60-9468-11e4-b395-02ee2ddab7fe'
     })

     pubnub.subscribe({
         channel : "tessel_rfid",
         message : function(message,env,channel){
            console.log("Got Message");

            if (message.msg_type == "accel") {
                console.log(message);
            } else {
           document.getElementById('text').innerHTML =
           "Message Received." + '<br>' +
           "Channel: " + channel + '<br>' +
           "Message: " + JSON.stringify(message)  + '<br>'
       }
         },
         connect: pub
     })

     function pub() {
        pubnub.publish({
             channel : "tessel_rfid",
             message : "Hello from PubNub Docs!",
             callback: function(m){ console.log(m) }
        })
     }
 };

publish();
