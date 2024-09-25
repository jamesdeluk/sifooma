function addItem(listId, inputId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() !== "") {
        const timestamp = getTimestamp();
        const itemName = input.value;

        const listItem = document.createElement('li');
        listItem.innerHTML = `<div class="item-info"><span class="date">${timestamp}</span>: <span class="name">${itemName}</span></div>`;
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            list.removeChild(listItem);
            updateStorage();
        };
        buttonsDiv.appendChild(deleteButton);

        const transferButton = document.createElement('button');
        transferButton.className = 'transfer';
        if (listId == 'shopping-list') {
            transferButton.textContent = "Bought";
        }
        else if (listId == 'pantry-list') {
            transferButton.textContent = "Eaten";
        }
        transferButton.onclick = () => transferItem(listId, listItem);
        buttonsDiv.appendChild(transferButton);
        
        listItem.appendChild(buttonsDiv);
        list.insertBefore(listItem, list.firstChild);
        input.value = "";

        updateStorage();
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

        const deleteButton = listItem.getElementsByClassName('delete')[0];
        deleteButton.onclick = () => {
            listItem.parentNode.removeChild(listItem);
            updateStorage();
        };

        if (targetListId === "pantry-list") {
            const transferButton = listItem.getElementsByClassName('transfer')[0];
            transferButton.textContent = "Eaten";
        } else {
            listItem.getElementsByClassName('transfer')[0].onclick = () => transferItem(targetListId, listItem);
        }

        // Remove transfer button if moving to the Food Diary
        if (targetListId === "diary-list") {
            const transferButton = listItem.getElementsByClassName('transfer')[0];
            transferButton.parentNode.removeChild(transferButton);
        } else {
            listItem.getElementsByClassName('transfer')[0].onclick = () => transferItem(targetListId, listItem);
        }

        currentList.removeChild(listItem);
        targetList.insertBefore(listItem, targetList.firstChild);

        updateStorage();
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
            listItem.innerHTML = `<div class="item-info"><span class="date">${item.date}</span>: <span class="name">${item.name}</span></div>`;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttons';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => {
                list.removeChild(listItem);
                updateStorage();
            };
            buttonsDiv.appendChild(deleteButton);

            if (listId !== 'diary-list') {
                const transferButton = document.createElement('button');
                transferButton.className = 'transfer';
                if (listId == 'shopping-list') {
                    transferButton.textContent = "Bought";
                }
                else if (listId == 'pantry-list') {
                    transferButton.textContent = "Eaten";
                }
                transferButton.onclick = () => transferItem(listId, listItem);
                buttonsDiv.appendChild(transferButton);
            }
            listItem.appendChild(buttonsDiv);

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
            const date = item.getElementsByClassName('date')[0].textContent;
            const name = item.getElementsByClassName('name')[0].textContent;
            items.push({ name, date });
        });
        localStorage.setItem(listId, JSON.stringify(items));
    });
}

window.onload = loadFromStorage;