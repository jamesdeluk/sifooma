function addItem(listId, inputId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() !== "") {
        const timestamp = getTimestamp();
        const itemName = input.value;

        // Check if the item already exists in localStorage
        const existingItems = JSON.parse(localStorage.getItem(listId)) || [];
        const itemExists = existingItems.some(item => item.name === itemName);

        if (!itemExists) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${itemName} <span>${timestamp}</span>`;
            
            // Create buttons for delete and transfer
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                list.removeChild(listItem);
                updateStorage(); // Update storage after deletion
            };

            const transferButton = document.createElement('button');
            transferButton.textContent = "Transfer";
            transferButton.onclick = () => transferItem(listId, listItem);

            // Append buttons to the item
            listItem.appendChild(deleteButton);
            listItem.appendChild(transferButton);
            
            list.appendChild(listItem);
            input.value = "";

            // Save to localStorage
            saveToStorage(listId, itemName, timestamp);
        } else {
            alert("Item already exists in the list.");
        }
    }
}

function transferItem(currentListId, listItem) {
    let targetListId;

    if (currentListId === "shopping-list") {
        targetListId = "pantry-list";
    } else if (currentListId === "pantry-list") {
        targetListId = "diary-list";
    }

    if (targetListId) {
        const currentList = document.getElementById(currentListId);
        const targetList = document.getElementById(targetListId);
        
        // Clone the listItem to avoid removing the original from a different list
        const clonedItem = listItem.cloneNode(true);
        const itemName = clonedItem.childNodes[0].textContent;
        const timestamp = getTimestamp();
        clonedItem.querySelector('span').textContent = timestamp;

        const deleteButton = clonedItem.querySelector('button:nth-child(2)');
        deleteButton.onclick = () => {
            clonedItem.parentNode.removeChild(clonedItem);
            updateStorage(); // Update storage after deletion
        };

        // // Remove transfer button if moving to the Food Diary
        // if (targetListId === "diary-list") {
        //     const transferButton = clonedItem.querySelector('button:nth-child(3)');
        //     transferButton.parentNode.removeChild(transferButton);
        // } else {
        //     // Re-attach the transfer button's functionality to the cloned item for non-diary lists
        //     clonedItem.querySelector('button:nth-child(3)').onclick = () => transferItem(targetListId, clonedItem);
        // }

        // Remove the original item from the current list
        currentList.removeChild(listItem);
        
        // Append the cloned item to the target list
        targetList.appendChild(clonedItem);

        // Remove the item from the current list's storage
        removeFromStorage(currentListId, itemName);
        
        // Save to localStorage
        saveToStorage(targetListId, itemName, timestamp);

    }
}

// New function to remove an item from localStorage
function removeFromStorage(listId, itemName) {
    const items = JSON.parse(localStorage.getItem(listId)) || [];
    const updatedItems = items.filter(item => item.name !== itemName);
    localStorage.setItem(listId, JSON.stringify(updatedItems));
}

function getTimestamp() {
    const now = new Date();
    return now.toLocaleString();
}

// Add event listeners to inputs for Ctrl + Enter functionality
document.getElementById('shopping-input').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        addItem('shopping-list', 'shopping-input');
    }
});

document.getElementById('pantry-input').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        addItem('pantry-list', 'pantry-input');
    }
});

document.getElementById('diary-input').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        addItem('diary-list', 'diary-input');
    }
});

// New function to save items to localStorage
function saveToStorage(listId, itemName, timestamp) {
    const items = JSON.parse(localStorage.getItem(listId)) || [];
    items.push({ name: itemName, date: timestamp });
    localStorage.setItem(listId, JSON.stringify(items));
}

// New function to load items from localStorage
function loadFromStorage() {
    const lists = ['shopping-list', 'pantry-list', 'diary-list'];
    lists.forEach(listId => {
        const items = JSON.parse(localStorage.getItem(listId)) || [];
        const list = document.getElementById(listId);
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${item.name} <span>${item.date}</span>`;
            // Create buttons for delete and transfer
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                list.removeChild(listItem);
                updateStorage(); // Update storage after deletion
            };
            listItem.appendChild(deleteButton);
            if (listId !== 'diary-list') {
                const transferButton = document.createElement('button');
                transferButton.textContent = "Transfer";
                transferButton.onclick = () => transferItem(listId, listItem);
                listItem.appendChild(transferButton);
            }
            // Append buttons to the item
            
            
            list.appendChild(listItem);
        });
    });
}

// Call loadFromStorage on page load
window.onload = loadFromStorage;

// New function to update storage after changes
function updateStorage() {
    const lists = ['shopping-list', 'pantry-list', 'diary-list'];
    lists.forEach(listId => {
        const items = [];
        const list = document.getElementById(listId);
        list.childNodes.forEach(item => {
            const name = item.childNodes[0].textContent;
            const date = item.querySelector('span').textContent;
            items.push({ name, date });
        });
        localStorage.setItem(listId, JSON.stringify(items));
    });
}