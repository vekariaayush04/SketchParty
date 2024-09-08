export type ChatType = "join" | "left" | "guess"

export type Chat = {
    userId : string,
    message : string,
    type : ChatType
}


// export class Chats{
//     private chatMessages : Chat[]

//     constructor(){
//         this.chatMessages = []
//     }

//     getChatMessages(){
//         return this.chatMessages
//     }

//     addChatMessage({ userId , message , type} : Chat){
//         this.chatMessages.push({
//             userId,
//             message,
//             type
//         })
//     }
// }