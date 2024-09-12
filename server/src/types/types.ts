export type ChatType = "join" | "left" | "guess"

export type Chat = {
    userId : string,
    message : string,
    type : ChatType
}

export type UserData = {
    userId : string,
    userName : string,
    score : number
}

export type DrawingEvent = {
    Drawingtype: 'start' | 'draw' | 'end' | "clear"
    x: number
    y: number
    color: string
  }