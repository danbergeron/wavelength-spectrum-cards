let cards = []; // To store parsed card data
let currentIndex = 0;
let history = [];

// Colors for left and right sides
const colorPairs = [
  { left: "color1", right: "color2" },
  { left: "color3", right: "color4" },
  { left: "color2", right: "color1" },
  { left: "color4", right: "color3" },
  { left: "color5", right: "color6" },
  { left: "color6", right: "color5" },
];

// Fetch and parse the XML file
fetch("specdrumcardslist.xml") // Ensure the file is correctly located
  .then((response) => response.text())
  .then((text) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");
    const cardNodes = xml.getElementsByTagName("card");

    // Parse the cards into an array of objects
    cards = Array.from(cardNodes).map((card) => {
      const left = card.getElementsByTagName("left")[0];
      const right = card.getElementsByTagName("right")[0];
      return {
        left: left ? left.textContent : "Unknown",
        right: right ? right.textContent : "Unknown",
      };
    });

    // Display a random card on page load
    currentIndex = Math.floor(Math.random() * cards.length);
    displayCard(currentIndex);
  })
  .catch((err) => console.error("Error loading XML:", err));

// Function to display the card at the current index
function displayCard(index) {
  const leftWord = document.getElementById("left-word");
  const rightWord = document.getElementById("right-word");
  const leftSide = document.getElementById("left-side");
  const rightSide = document.getElementById("right-side");

  if (cards.length > 0) {
    // Update the card text
    leftWord.textContent = cards[index].left;
    rightWord.textContent = cards[index].right;

    // Assign a truly random color pair
    const colorIndex = Math.floor(Math.random() * colorPairs.length); // Random color index
    leftSide.className = `side ${colorPairs[colorIndex].left}`;
    rightSide.className = `side ${colorPairs[colorIndex].right}`;
  } else {
    leftWord.textContent = "No data";
    rightWord.textContent = "No data";
  }
}

// Add swipe and click handling
document.getElementById("card").addEventListener("click", (e) => {
  const cardRect = e.target.getBoundingClientRect();
  const clickX = e.clientX;

  if (clickX < cardRect.width / 2) {
    // Click on the left side (Go back to previous card)
    if (history.length > 0) {
      currentIndex = history.pop();
      displayCard(currentIndex);
    }
  } else {
    // Click on the right side (Show a new random card)
    history.push(currentIndex);
    currentIndex = Math.floor(Math.random() * cards.length);
    displayCard(currentIndex);
  }
});

// Add keypress support for navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    // Left arrow key (Go back to previous card)
    if (history.length > 0) {
      currentIndex = history.pop();
      displayCard(currentIndex);
    }
  } else if (e.key === "ArrowRight") {
    // Right arrow key (Show a new random card)
    history.push(currentIndex);
    currentIndex = Math.floor(Math.random() * cards.length);
    displayCard(currentIndex);
  }
});
