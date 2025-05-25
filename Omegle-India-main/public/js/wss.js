import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";
import * as strangerUtils from "./strangerUtils.js";

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    console.log("succesfully connected to socket.io server");
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  // Check if the viewport is 600px or less
  if (window.matchMedia("(max-width: 600px)").matches) {
    // Assuming 'socket' is your socket.io connection

    
    socket.on("pre-offer", function () {
      // When connected, hide dashboard and show call container
      document.querySelector(".dashboard_container").style.display = "none";
      document.querySelector(".call_container").style.display = "block";
      document.querySelector(".messenger_container").style.display = "block";
    });

     socket.on("pre-offer-answer", (data) => {
      if (data.CALLEE_NOT_FOUND) {
        // Show dashboard when callee is not found
        document.querySelector(".dashboard_container").style.display = "block";
      } else {
        document.querySelector(".dashboard_container").style.display = "none";
        document.querySelector(".call_container").style.display = "block";
        document.querySelector(".messenger_container").style.display = "block";
      }
    });

    socket.on("user-hanged-up", function () {
      // When disconnected, show dashboard and hide call container
      document.querySelector(".dashboard_container").style.display = "block";
      document.querySelector(".call_container").style.display = "none";
      document.querySelector(".messenger_container").style.display = "none";
    });
    socket.on("call_button_large", function () {
      // When disconnected, show dashboard and hide call container
      document.querySelector(".dashboard_container").style.display = "block";
      document.querySelector(".call_container").style.display = "none";
      document.querySelector(".messenger_container").style.display = "none";
    });
   
  }


  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('user-hanged-up', (data) => {
    webRTCHandler.handleConnectedUserHangedUp(data);
 
  })

  socket.on("webRTC-signaling", (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);
        break;
      default:
        return;
    }
  });
  socket.on("stranger-socket-id", (data) => {
    strangerUtils.connectWithStranger(data);});
};





export const sendPreOffer = (data) => {
  console.log("emmiting to server pre offer event");
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};

export const sendUserHangedUp=(data)=>{
  socketIO.emit("user-hanged-up",data);
};

export const changeStrangerConnectionStatus = (data) => {
  socketIO.emit("stranger-connection-status", data);
}

export const getStrangerSocketId = () => {
  socketIO.emit("get-stranger-socket-id");
}
