const getNoun = document.getElementById("nounsGet");

// Define the file path
const filePath = 'nouns.txt';

// Initialize an empty Set to store the nouns
const nouns = new Set();

let found = {
    "dog": 5,
    "cat": 1
};

// Fetch the content of the file
fetch(filePath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }
    return response.text();
  })
  .then(data => {
    // Split the content into an array of words
    const words = data.split(/\s+/);

    // Iterate through each word
    words.forEach((word) => {
      // Check if the word is a noun (you may need to adjust this condition based on your specific text file)
      if (/^[a-zA-Z]+$/.test(word)) {
        // Add the word to the Set of nouns (converted to lowercase to ensure case-insensitive matching)
        nouns.add(word.toLowerCase());
        //console.log(word);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching file:', error);
  });


function getWeight(n, alpha = 10){
    return 1 / (1 + Math.pow(Math.E, -Math.log2(n / alpha)))
}

function weightedRandomSelection(items) {
    // Calculate total weight
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

    // Generate a random number between 0 and total weight
    let randomNum = Math.random() * totalWeight;

    // Iterate through the items to find the selected item
    for (let i = 0; i < items.length; i++) {
        randomNum -= items[i].weight;
        if (randomNum <= 0) {
            return items[i].value; // Return the selected item
        }
    }
}

function normalize(items){
    let total = 0;
    items.forEach(element => {
        total += element.weight;
    })

    for (let i = 0; i < items.length; i++){items[i].weight /= total;}
    return items;
}

function populateTable(found) {
    const tableBody = document.getElementById('wordTableBody');

    // Clear any existing table rows
    tableBody.innerHTML = '';

    // Iterate over each key-value pair in the 'found' object
    Object.entries(found).forEach(([word, count]) => {
        // Create a new table row
        const row = document.createElement('tr');

        // Create table cells for the word and count
        const wordCell = document.createElement('td');
        wordCell.textContent = word;
        const countCell = document.createElement('td');
        countCell.textContent = count;

        const weightCell = document.createElement('td');
        weightCell.textContent = getWeight(count).toFixed(2);

        // Append cells to the row
        row.appendChild(wordCell);
        row.appendChild(weightCell);
        row.appendChild(countCell);

        // Append row to the table body
        tableBody.appendChild(row);
    });
}populateTable(found);


document.addEventListener("DOMContentLoaded", function() {
    const getNounButton = document.getElementById("nounsGet");
    getNounButton.addEventListener("click", getNouns);
    
    const selectNouns = document.getElementById("getMe");
    selectNouns.addEventListener("click", selectNounsMethod);

    const output = document.getElementById("output");

    function selectNounsMethod(){
        let ary = Object.entries(found);
        let newOutput = "Content:<br><b>Interest Groups</b>";

        for (let i = 0; i < ary.length; i ++){
            ary[i] = {value: ary[i][0], weight: getWeight(ary[i][1])}
        }
        ary = normalize(ary);

        let remainder = 20;
        let seen = new Set();


        for (let i = 1; i <= ary.length && i < 15; i++){
            let selection = weightedRandomSelection(ary);
            while (seen.has(selection)){selection = weightedRandomSelection(ary);}
            seen.add(selection);
            newOutput += "<br>" + i + ") " + selection;
        }

        newOutput += "<br><b>Random</b>"
        for (let i = ary.length + 1; i <= remainder; i++){
            let array = Array.from(nouns)
            let selection = array[Math.floor(Math.random() * array.length)]
            while (seen.has(selection)){selection = array[Math.floor(Math.random() * array.length)];}
            seen.add(selection);
            newOutput += "<br>" + i + ") " + selection;
        }

        output.innerHTML = newOutput;
    }
        
    function getNouns() {
        let url = 'https://cors-anywhere.herokuapp.com/' + document.getElementById("input").value;
        //console.log(nouns.has("example"))

        let newOutput = "Content:";
        output.innerHTML = "Content:<br><b>Scanning</b>"
            
        fetch(url)
            .then(response => response.text())
            .then(html => {
                output.innerHTML = "Content:<br><b>Sorting</b>"
                const text = html.replace(/<[^>]+>/g, '');
                const tokens = text.split(/\s+/);
                let seen = new Set();
                tokens.forEach(element => {
                    element = element.toLowerCase();
                    if (nouns.has(element) && !seen.has(element)) {
                        if (found[element] == undefined){found[element] = 0;}
                        found[element] += 1;
                        seen.add(element);
                        newOutput += "<br>Found " + element;
                        output.innerHTML = newOutput;
                        populateTable(found);
                    }
                });
            })
            .catch(error => console.error('Error fetching webpage:', error));
    }
});
