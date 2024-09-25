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
            listItem.innerHTML = `<span>${timestamp}</span> ${itemName}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                list.removeChild(listItem);
                updateStorage();
            };
            listItem.appendChild(deleteButton);

            const transferButton = document.createElement('button');
            if (listId == 'shopping-list') {
                transferButton.textContent = "Bought";
            }
            else if (listId == 'pantry-list') {
                transferButton.textContent = "Eaten";
            }
            transferButton.onclick = () => transferItem(listId, listItem);

            listItem.appendChild(transferButton);
            
            list.appendChild(listItem);
            input.value = "";

            // saveToStorage(listId, itemName, timestamp);
            updateStorage();
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

        const deleteButton = listItem.querySelector('button:nth-child(2)');
        deleteButton.onclick = () => {
            listItem.parentNode.removeChild(listItem);
            updateStorage();
        };

        if (targetListId === "pantry-list") {
            const transferButton = listItem.querySelector('button:nth-child(3)');
            transferButton.textContent = "Eaten";
        } else {
            listItem.querySelector('button:nth-child(3)').onclick = () => transferItem(targetListId, listItem);
        }

        // Remove transfer button if moving to the Food Diary
        if (targetListId === "diary-list") {
            const transferButton = listItem.querySelector('button:nth-child(3)');
            transferButton.parentNode.removeChild(transferButton);
        } else {
            listItem.querySelector('button:nth-child(3)').onclick = () => transferItem(targetListId, listItem);
        }

        currentList.removeChild(listItem);
        // targetList.appendChild(listItem);
        targetList.insertBefore(listItem, targetList.firstChild);

        updateStorage();
        // removeFromStorage(currentListId, itemName);
        // saveToStorage(targetListId, itemName, timestamp);
    }
}

function getTimestamp() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    // const hours = String(now.getHours()).padStart(2, '0');
    // const minutes = String(now.getMinutes()).padStart(2, '0');
    // return `${day}/${month} ${hours}:${minutes}`;
    return `${day}/${month}`;
}

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

function loadFromStorage() {
    const lists = ['shopping-list', 'pantry-list', 'diary-list'];
    lists.forEach(listId => {
        const items = JSON.parse(localStorage.getItem(listId)) || [];
        const list = document.getElementById(listId);
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${item.date}</span> ${item.name}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                list.removeChild(listItem);
                updateStorage();
            };
            listItem.appendChild(deleteButton);

            if (listId !== 'diary-list') {
                const transferButton = document.createElement('button');
                if (listId == 'shopping-list') {
                    transferButton.textContent = "Bought";
                }
                else if (listId == 'pantry-list') {
                    transferButton.textContent = "Eaten";
                }
                transferButton.onclick = () => transferItem(listId, listItem);
                listItem.appendChild(transferButton);
            }
            list.appendChild(listItem);
        });
    });
}

// function saveToStorage(listId, itemName, timestamp) {
//     const items = JSON.parse(localStorage.getItem(listId)) || [];
//     items.push({ name: itemName, date: timestamp });
//     localStorage.setItem(listId, JSON.stringify(items));
// }

// function removeFromStorage(listId, itemName) {
//     const items = JSON.parse(localStorage.getItem(listId)) || [];
//     const updatedItems = items.filter(item => item.name !== itemName);
//     localStorage.setItem(listId, JSON.stringify(updatedItems));
// }

function updateStorage() {
    const lists = ['shopping-list', 'pantry-list', 'diary-list'];
    lists.forEach(listId => {
        const items = [];
        const list = document.getElementById(listId);
        list.childNodes.forEach(item => {
            const date = item.querySelector('span').textContent;
            const name = item.childNodes[1].textContent;
            items.push({ name, date });
        });
        localStorage.setItem(listId, JSON.stringify(items));
    });
}

window.onload = loadFromStorage;