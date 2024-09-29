// Load records from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRecords();
});

// Function to add a new record
function addRecord(callsign = "", runwayAction = "", atis = false, cleared = false, taxiing = false, handedOff = false) {
    const table = document.getElementById('atcTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const fields = [
        { type: 'text', value: callsign },     // Callsign
        { type: 'text', value: runwayAction }, // Runway/Action
        { type: 'checkbox', checked: atis },   // ATIS
        { type: 'checkbox', checked: cleared },// Cleared
        { type: 'checkbox', checked: taxiing },// Is Taxiing
        { type: 'checkbox', checked: handedOff }// Handed Off
    ];

    fields.forEach((field, index) => {
        let newCell = newRow.insertCell(index);
        if (field.type === 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = field.checked;
            checkbox.addEventListener('change', saveRecords); // Listen for change and save
            newCell.appendChild(checkbox);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = field.value;
            input.addEventListener('input', saveRecords); // Listen for input and save
            newCell.appendChild(input);
        }
    });

    // Add the delete button
    let deleteCell = newRow.insertCell(6);
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() { deleteRecord(deleteBtn); };
    deleteCell.appendChild(deleteBtn);

    // Hide "No records" message
    document.getElementById('noRecordsMessage').style.display = 'none';

    // Save the updated records
    saveRecords();
}

// Function to delete a record
function deleteRecord(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    saveRecords(); // Update the saved records after deletion

    // If no rows left, show "No records" message
    const table = document.getElementById('atcTable').getElementsByTagName('tbody')[0];
    if (table.rows.length === 0) {
        document.getElementById('noRecordsMessage').style.display = 'block';
    }
}

// Save records to localStorage
function saveRecords() {
    const rows = document.querySelectorAll('#atcTable tbody tr');
    const records = Array.from(rows).map(row => {
        const inputs = row.querySelectorAll('input');
        return {
            callsign: inputs[0].value,
            runwayAction: inputs[1].value,
            atis: inputs[2].checked,
            cleared: inputs[3].checked,
            taxiing: inputs[4].checked,
            handedOff: inputs[5].checked
        };
    });
    localStorage.setItem('atcRecords', JSON.stringify(records));
}

// Load records from localStorage
function loadRecords() {
    const savedRecords = JSON.parse(localStorage.getItem('atcRecords'));
    if (savedRecords && savedRecords.length > 0) {
        savedRecords.forEach(record => {
            addRecord(record.callsign, record.runwayAction, record.atis, record.cleared, record.taxiing, record.handedOff);
        });
    } else {
        document.getElementById('noRecordsMessage').style.display = 'block';
    }
}
