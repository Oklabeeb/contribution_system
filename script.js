const form = document.getElementById("contributionForm");
const nameInputs = document.getElementById("nameInputs");
const schedule = document.getElementById("schedule");
let currentNames = [];
let currentContributionAmount = 0;
let currentStartDate = null;
let currentNumberOfPeople = 0;


const savedNames = localStorage.getItem("ajoNames");
const savedAmount = localStorage.getItem("ajoAmount");
const savedStartDate = localStorage.getItem("ajoStartDate");
const savedNumberOfPeople = localStorage.getItem("ajoNumberOfPeople");
const savedRandomOrder = localStorage.getItem("ajoRandomOrder");

if (savedRandomOrder) {
    currentNames = JSON.parse(savedRandomOrder);
    currentContributionAmount = Number(savedAmount);
    currentStartDate = new Date(savedStartDate);
    currentNumberOfPeople = Number(savedNumberOfPeople);

    document.getElementById("amount").value = currentContributionAmount;
    document.getElementById("startDate").value = savedStartDate;

    generateSchedule(
        currentNames,
        currentContributionAmount,
        currentStartDate,
        currentNumberOfPeople
    );
}

function generateSchedule(
    shuffledNames,
    contributionAmount,
    startDate,
    numberOfPeople
) {

    schedule.innerHTML = "";

    const totalPackingAmount =
        contributionAmount * numberOfPeople;

    const table = document.createElement("table");

    const headerRow = document.createElement("tr");

    const positionHeader = document.createElement("th");
    positionHeader.textContent = "Position";

    const nameHeader = document.createElement("th");
    nameHeader.textContent = "Name";

    const contributionHeader = document.createElement("th");
    contributionHeader.textContent = "Contribution";

    const amountHeader = document.createElement("th");
    amountHeader.textContent = "Amount to Pack";

    const dateHeader = document.createElement("th");
    dateHeader.textContent = "Packing Date";

    headerRow.appendChild(positionHeader);
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(contributionHeader);
    headerRow.appendChild(amountHeader);
    headerRow.appendChild(dateHeader);

    table.appendChild(headerRow);

    shuffledNames.forEach(function(name, index) {

        const position = index + 1;

        const packingDate = new Date(startDate);

        packingDate.setDate(
            packingDate.getDate() + (position * 7)
        );

        const row = document.createElement("tr");

        const positionCell = document.createElement("td");
        positionCell.textContent = position;

        const nameCell = document.createElement("td");
        nameCell.textContent = name;

        const contributionCell = document.createElement("td");
        contributionCell.textContent =
            `₦${contributionAmount.toLocaleString()}`;

        const amountCell = document.createElement("td");
        amountCell.textContent =
            `₦${totalPackingAmount.toLocaleString()}`;

        const dateCell = document.createElement("td");
        dateCell.textContent =
            packingDate.toLocaleDateString("en-GB");

        row.appendChild(positionCell);
        row.appendChild(nameCell);
        row.appendChild(contributionCell);
        row.appendChild(amountCell);
        row.appendChild(dateCell);

        table.appendChild(row);
    });

    schedule.appendChild(table);

    const reshuffleButton = document.createElement("button");

    reshuffleButton.textContent = "Reshuffle Order";
    reshuffleButton.type = "button";

schedule.appendChild(reshuffleButton);
const resetButton = document.createElement("button");

resetButton.textContent = "Start Over";
resetButton.type = "button";

schedule.appendChild(resetButton);

resetButton.addEventListener("click", function() {

    nameInputs.innerHTML = "";
    schedule.innerHTML = "";

    document.getElementById("amount").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("numberOfPeople").value = "";

    currentNames = [];
    currentContributionAmount = 0;
    currentStartDate = null;
    currentNumberOfPeople = 0;

});

reshuffleButton.addEventListener("click", function() {

    const newOrder = [...currentNames];

    newOrder.sort(function() {
        return Math.random() - 0.5;
    });
    localStorage.setItem("ajoRandomOrder", JSON.stringify(newOrder));

    generateSchedule(
        newOrder,
        currentContributionAmount,
        currentStartDate,
        currentNumberOfPeople
    );
});
}

const clearData = document.createElement("button");

clearData.textContent = "Clear Saved Ajo";

clearData.type = "button";

document.body.appendChild(clearData);

clearData.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

form.addEventListener("submit", function(event) {


event.preventDefault();

const numberOfPeople = Number(
    document.getElementById("numberOfPeople").value
);
const contributionAmount = Number(
    document.getElementById("amount").value
);

const startDateValue =
    document.getElementById("startDate").value;

if (numberOfPeople < 10) {
    nameInputs.innerHTML = "<p>You need at least 10 people.</p>";
    return;
}

if (contributionAmount <= 0) {
    nameInputs.innerHTML =
        "<p>Contribution amount must be greater than ₦0.</p>";
    return;
}

if (startDateValue === "") {
    nameInputs.innerHTML =
        "<p>Please select a starting date.</p>";
    return;
}

nameInputs.innerHTML = "";

// Create the name inputs
for (let i = 1; i <= numberOfPeople; i++) {

    const label = document.createElement("label");
    label.textContent = `Person ${i}`;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Enter name of person ${i}`;
    input.className = "person-name";
    input.required = true;

    nameInputs.appendChild(label);
    nameInputs.appendChild(input);
    nameInputs.appendChild(document.createElement("br"));
}

// Create Save Names button
const collectButton = document.createElement("button");

collectButton.type = "button";
collectButton.textContent = "Generate Random Order";

nameInputs.appendChild(collectButton);

// Collect names and generate random order
collectButton.addEventListener("click", function() {

    const inputs = document.querySelectorAll(".person-name");

    const names = [];

    inputs.forEach(function(input) {
        names.push(input.value.trim());
    });

    const hasEmptyName = names.some(function(name) {
    return name === "";
});

if (hasEmptyName) {
    alert("Please enter all the names.");
    return;
}

const normalizedNames = names.map(function(name) {
    return name.toLowerCase();
});

const uniqueNames = new Set(normalizedNames);

if (uniqueNames.size !== normalizedNames.length) {
    alert("Two or more people have the same name.");
    return;
}

currentNames = [...names];

currentContributionAmount = Number(
    document.getElementById("amount").value
);

currentStartDate = new Date(
    document.getElementById("startDate").value
);

currentNumberOfPeople = numberOfPeople;


localStorage.setItem("ajoNames", JSON.stringify(currentNames));
localStorage.setItem("ajoAmount", currentContributionAmount);
localStorage.setItem("ajoStartDate", currentStartDate);
localStorage.setItem("ajoNumberOfPeople", currentNumberOfPeople); 


// Create a copy of the names
let shuffledNames = [...currentNames];

shuffledNames.sort(function() {
    return Math.random() - 0.5;
});

localStorage.setItem(
    "ajoRandomOrder",
    JSON.stringify(shuffledNames)
);

generateSchedule(
    shuffledNames,
    currentContributionAmount,
    currentStartDate,
    currentNumberOfPeople
);


const totalPackingAmount =
    contributionAmount * numberOfPeople;

console.log("Contribution per person:", contributionAmount);
console.log("Number of people:", numberOfPeople);
console.log("Total packing amount:", totalPackingAmount);
    console.log("Original names:", names);
    console.log("Random packing order:", shuffledNames);
});


});
