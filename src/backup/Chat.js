import {
    Socket,
    Presence
} from "../lib/phoenix"

let formatTimestamp = (timestamp) => {
    let date = new Date(timestamp)
    return date.toLocaleTimeString()
}

let URL = 'http://localhost:9090/socket'
let TIMEOUT = 10000
let DEFAULT_LOBBY = "room:lobby"
let DEFAULT_USER = "pingal"

let chat = (user_name) => {

    // define user
    let user = user_name || DEFAULT_USER

    // define the socket per user
    let socket = new Socket(URL, {
        params: {
            user: user
        }
    })

    // configure the event handlers
    socket.onOpen(event => console.log('Connected.'))
    socket.onError(event => console.log('Cannot connect.'))
    socket.onClose(event => console.log('Goodbye.'))

    socket.connect()

    // get the lobby
    let lobby = (name, renderReceive) => {
        let room_name = name || DEFAULT_LOBBY
        let room = socket.channel(room_name, {})
        let presences = {}
            // join the room
        room.join()
            .receive("ok", resp => {
                console.log("Joined successfully", resp)
            })
            .receive("error", resp => {
                console.log("Unable to join", resp)
            })
            .receive("timeout", resp => {
                console.log("Check all connections: network, database, ...")
            })

        // add some room-level event handlers
        room.onError(event => console.log('Room error.'))
        room.onClose(event => console.log('Room closed.'))



        // receiving message in the room
        room.on("message:new", message => {
          console.log('Received message ...')
          console.log(message)
          console.log(message.body)
          renderReceive(message)
        })

        /*
        // demo bot calls
        room.on("user:entered", (msg) => console.log('hello', msg))

        // presence

        room.on("presence_state", state => {
            console.log(state)
                //Presence.syncState(presences, state)
                //console.log(presences)
            renderReceive(state)
        })
        room.on("presence_diff", diff => {
            Presence.syncDiff(presences, diff)
            renderReceive(presences)
        })
        */

        return room;
    }

    // sending message in the lobby
    let send = (room, messages) => {
        console.log("sending...")
        messages.map((message) => {
          console.log(message.text)
          room.push("message:new", message.text)
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

export default chat
