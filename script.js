function addItem(listId, inputId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (input.value.trim() !== "") {
        const date = getDate();
        const time = getTime();
        let itemName = input.value.trim();
        itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase();

        const listItem = document.createElement('li');
        
        if (listId === "diary-list") {
            listItem.innerHTML = `<div class="item-info"><span class="date">${date} ${time}</span>: <span class="name">${itemName}</span></div>`;
        } else if (listId === "pantry-list"){
            listItem.innerHTML = `<div class="item-info"><span class="date">${date}</span>: <span class="name">${itemName}</span></div>`;
        } else if (listId === "shopping-list"){
            listItem.innerHTML = `<div class="item-info"><span class="date"></span><span class="name">${itemName}</span></div>`;
        }
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = "✒️";
        editButton.onclick = () => {
            var newName = prompt("New name?", itemName)
            if (newName !== null) {
                listItem.getElementsByClassName("name")[0].textContent = newName;
                updateStorage();
            }
        };
        buttonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = "❌";
        deleteButton.onclick = () => {
            if (confirm("Are you sure you want to delete this item?")) { // Confirmation popup
                list.removeChild(listItem);
                updateStorage();
            }
        };
        buttonsDiv.appendChild(deleteButton);

        if (listId !== "diary-list") {
            const transferButton = document.createElement('button');
            transferButton.className = 'transfer';
            transferButton.textContent = "➡️";
            transferButton.onclick = () => transferItem(listId, listItem);
            buttonsDiv.appendChild(transferButton);
        }
        
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

        if (targetListId === "diary-list") {
            const time = getTime();
            listItem.getElementsByClassName("date")[0].textContent += " " + time;
        } else if (targetListId === "pantry-list") {
            const date = getDate();
            listItem.getElementsByClassName("date")[0].textContent = date;
        }

        const deleteButton = listItem.getElementsByClassName('delete')[0];
        deleteButton.onclick = () => {
            if (confirm("Are you sure you want to delete this item?")) { // Confirmation popup
                listItem.parentNode.removeChild(listItem);
                updateStorage();
            }
        };

        const editButton = listItem.getElementsByClassName('edit')[0];
        editButton.onclick = () => {
            var newName = prompt("New name?", listItem.getElementsByClassName("name")[0].textContent)
            if (newName !== null) {
                listItem.getElementsByClassName("name")[0].textContent = newName;
                updateStorage();
            }
        };

        // Remove transfer button if moving to the Food Diary
        if (targetListId === "diary-list") {
            const transferButton = listItem.getElementsByClassName('transfer')[0];
            transferButton.parentNode.removeChild(transferButton);
        } else {
            listItem.getElementsByClassName('transfer')[0].onclick = () => transferItem(targetListId, listItem);
        }

        currentList.removeChild(listItem);
        if (targetListId === "pantry-list") {
            listItem.innerHTML = listItem.innerHTML.slice(0, 54) + ": " + listItem.innerHTML.slice(54); // Ensure ": " appears in Pantry list
        }
        targetList.insertBefore(listItem, targetList.firstChild);

        updateStorage();
    }
}

function getDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    return `${day}/${month}`;
}

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
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
            if (listId === "shopping-list"){
                listItem.innerHTML = `<div class="item-info"><span class="date"></span><span class="name">${item.name}</span></div>`;
            } else {
                listItem.innerHTML = `<div class="item-info"><span class="date">${item.date}</span>: <span class="name">${item.name}</span></div>`;
            }

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'buttons';

            const editButton = document.createElement('button');
            editButton.className = 'edit';
            editButton.textContent = "✒️";
            editButton.onclick = () => {
                var newName = prompt("New name?", item.name);
                if (newName !== null) {
                    listItem.getElementsByClassName("name")[0].textContent = newName;
                    updateStorage();
                }
            };
            buttonsDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete';
            deleteButton.textContent = "❌";
            deleteButton.onclick = () => {
                if (confirm("Are you sure you want to delete this item?")) { // Confirmation popup
                    list.removeChild(listItem);
                    updateStorage();
                }
            };
            buttonsDiv.appendChild(deleteButton);

            if (listId !== 'diary-list') {
                const transferButton = document.createElement('button');
                transferButton.className = 'transfer';
                transferButton.textContent = "➡️";
                transferButton.onclick = () => transferItem(listId, listItem);
                buttonsDiv.appendChild(transferButton);
            }
            listItem.appendChild(buttonsDiv);

            list.appendChild(listItem);
        });
    });
}

// function saveToStorage(listId, itemName, date) {
//     const items = JSON.parse(localStorage.getItem(listId)) || [];
//     items.push({ name: itemName, date: date });
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

function backupToFile() {
    const lists = ['shopping-list', 'pantry-list', 'diary-list'];
    const data = {};

    lists.forEach(listId => {
        const items = JSON.parse(localStorage.getItem(listId)) || [];
        data[listId] = items;
    });

    const timestamp = new Date();
    const formattedTimestamp = `${timestamp.getFullYear().toString().slice(2)}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(timestamp.getDate()).padStart(2, '0')}${String(timestamp.getHours()).padStart(2, '0')}${String(timestamp.getMinutes()).padStart(2, '0')}`;
    const filename = `sifooma-backup-${formattedTimestamp}.json`;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Use the formatted filename
    a.click();
    URL.revokeObjectURL(url);
}

function restoreFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            const lists = ['shopping-list', 'pantry-list', 'diary-list'];
            lists.forEach(listId => {
                const list = document.getElementById(listId);
                list.innerHTML = ''; // Clear existing items
                data[listId].forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<div class="item-info"><span class="date">${item.date || ''}</span>: <span class="name">${item.name}</span></div>`;
                    list.appendChild(listItem);
                });
            });
            updateStorage(); // Update local storage after restoring
            location.reload(); // Force a page reload to reset the UI
        };
        reader.readAsText(file);
    }
}

document.getElementById('restore-input').addEventListener('change', restoreFromFile);

window.onload = loadFromStorage;