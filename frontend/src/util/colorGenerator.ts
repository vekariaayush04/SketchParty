export const generateColor =  (num : number): string => {
    const str = "abcdef1234567890"
    let color = "#"

  for(let i = 0; i < num; i++){
        const randomIdx = Math.floor(Math.random() * str.length)
        const letter = str[randomIdx]
        color += letter
  }
    return color
}


export const generateColors = (num : number) : string[] => {
    let colors:string[] = []
    for (let index = 0; index < num; index++) {
        colors.push(generateColor(6))    
    }
    return colors
}