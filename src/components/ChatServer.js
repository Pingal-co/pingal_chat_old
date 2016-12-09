import {
    Socket,
    Presence
} from "../lib/phoenix"

let formatTimestamp = (timestamp) => {
    let date = new Date(timestamp)
    return date.toLocaleTimeString()
}

//let URL = 'http://localhost:9090/socket'
let URL = 'http://www.pingal.co:4010/socket'
let TIMEOUT = 10000
let DEFAULT_LOBBY = "room:lobby"
let DEFAULT_USER = "pingal"

let chatServer = (user = DEFAULT_USER) => {
    //
    if (user === '') {
        user = DEFAULT_USER
    }

    // define the socket per user
    let socket = new Socket(URL, {
        params: {
            user: user,
        }
    })

    // configure the event handlers
    socket.onOpen(event => console.log('Connected.'))
    socket.onError(event => console.log('Cannot connect.'))
    socket.onClose(event => console.log('Goodbye.'))

    socket.connect()

    // get the lobby
    let lobby = (room_name=DEFAULT_LOBBY, renderReceive=()=>{}) => {
        //let room_name = name || DEFAULT_LOBBY
        let room = socket.channel(room_name, {})
        let presences = {}
            // join the room
        room.join()
            .receive("ok", resp => {
                //console.log("Joined successfully", resp)
            })
            .receive("error", resp => {
                //console.log("Unable to join", resp)
            })
            .receive("timeout", resp => {
                //console.log("Check all connections: network, database, ...")
            })

        // add some room-level event handlers
        room.onError(event => console.log('Room error.', event))
        room.onClose(event => console.log('Room closed.'))



        // receiving message in the room
        

        // receiving message in the room
        room.on("add:slide", message => {
          console.log('Received new:slide...')
          console.log(message)
          //console.log(message.body)
          renderReceive(message)
        })

        room.on("add:thought", message => {
          console.log('Received new:thought...')
          console.log(message)
          renderReceive(message)
        })

        room.on("add:room", message => {
          //console.log('Received new:room ...')
          //console.log(message)
          //console.log(message.body)
          renderReceive(message)
        })

        // receiving message in the room
        
        room.on("get:slides_in_room", (messages) => {
          //console.log('Received slides_in_room ...')
          //console.log(messages)
          messages.slides.map((slide) => {
              slide = {
                ...slide,
                _id: Math.round(Math.random() * 1000000), 
                slide_id: 'save-id-' + slide.id,     
            } 
            //console.log(slide)
            renderReceive(slide)
          })
          
        })

       /*
        // demo bot calls
        room.on("user:entered", (msg) => console.log('hello', msg))

        // presence

        room.on("presence_state", state => {
            console.log(state)
            presences = Presence.syncState(presences, state)
            console.log(presences)
            renderReceive(state)
        })
        room.on("presence_diff", diff => {
            presences = Presence.syncDiff(presences, diff)
            renderReceive(presences)
        })
        */

        return room;
    }

    // sending message in the lobby
    let send = (room, messages, event="add:slide") => {
        console.log("sending to room...")
        //console.log(room)
        //console.log(messages)
        
        messages.map((message) => {

            /*
            message.meta = {
            room: room.topic,
            network: "Go",
            public: true,
            sponsored: false,
          }
          */

         // console.log(message)

          room.push(event, message)
              .receive('ok', (msg) => console.log('sent'))
              .receive('error', (reasons) => console.log('failed', reasons))
            })
      }

    // a function to shut it all down
    let close = () => socket.disconnect()

    return {
        user,
        socket,
        lobby,
        send,
        close
    }
}

export default chatServer
