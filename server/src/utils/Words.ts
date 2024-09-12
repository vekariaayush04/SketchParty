const wordList = [
    "apple", "banana", "grape", "orange", "pear", "pineapple", "strawberry", "watermelon", "cherry", "blueberry",
    "car", "bus", "train", "airplane", "bicycle", "motorcycle", "truck", "boat", "submarine", "helicopter",
    "house", "apartment", "castle", "cottage", "mansion", "tent", "igloo", "lighthouse", "skyscraper", "villa",
    "dog", "cat", "elephant", "giraffe", "lion", "tiger", "bear", "monkey", "zebra", "kangaroo",
    "book", "pen", "notebook", "pencil", "eraser", "ruler", "scissors", "glue", "marker", "crayon"
];

export function generateWords(): string[] {
    return wordList.sort(() => Math.random() - 0.5);
}