export type ChatType = "join" | "left" | "guess"

export type Chat = {
    userId : string,
    message : string,
    type : ChatType
}
