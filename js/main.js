
/* 
    Loader
*/
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
    loader.style.display = 'none';
})

/* 
    Purchase
*/

const quotation_form = document.getElementById('quotation_form');
const submitBtn = document.getElementById('submitBtn');
const client = document.getElementById('client');
const inputItem = quotation_form.querySelector('[data-input-item]');
const selectItem = quotation_form.querySelector('[data-select-item]');
const newItemCheck = document.getElementById('newItemCheck');
const amount = document.getElementById('amount');
const price = document.getElementById('price');
const discountDiv = document.getElementById('discount_div');
const discount = document.getElementById('discount');
const discountCheck = document.getElementById('discountCheck');

const allPurchases = [];
let clientName = '';

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation()
    if (!quotation_form.checkValidity()) {
        quotation_form.classList.add('was-validated');
    } else {
        const purchaseDetails = {
            item: selectItem.value || inputItem.value,
            amount: parseFloat(amount.value),
            price: parseFloat(price.value),
            discount: parseFloat(discount.value) || 0,
            id: tokenId(),
        };

        addPurchase(purchaseDetails);
        purchaseReceipt(purchaseDetails);
        restartAllForm(false);
    }

});

class Purchase {
    constructor(item, amount, price, discount, id) {
        this.item = item;
        this.amount = amount
        this.price = price;
        this.discount = discount
        this.id = id;
    }
}

function addPurchase({ item, amount, price, discount, id }) {
    const newPurchase = new Purchase(item, price, amount, discount, id);
    allPurchases.push(newPurchase);
    console.log(allPurchases);
}

function restartAllForm(allInputs) {
    const Inputs = quotation_form.querySelectorAll('input');
    const allSelects = quotation_form.querySelectorAll('select');
    allSelects.forEach(select => select.value = '');
    Inputs.forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (!(allInputs === false && input.id === 'client')) {
            input.value = '';
        }
    });
    quotation_form.removeAttribute('class', 'was-validated');
    removeInputItem();
    removeInputDiscount();
}

newItemCheck.addEventListener('change', function () {
    this.checked ? removeSelectItem() : removeInputItem();
});

discountCheck.addEventListener('change', function () {
    this.checked ? addInputDiscount() : removeInputDiscount();
})

function removeInputItem() {
    inputItem.value = '';
    inputItem.classList.add('none');
    inputItem.disabled = true;
    selectItem.classList.remove('none');
    selectItem.disabled = false;
}

function removeSelectItem() {
    selectItem.value = '';
    selectItem.classList.add('none');
    selectItem.disabled = true;
    inputItem.classList.remove('none');
    inputItem.disabled = false;
}

function addInputDiscount() {
    discountDiv.classList.remove('none');
    discount.disabled = false;
}

function removeInputDiscount() {
    discount.value = '';
    discountDiv.classList.add('none');
    discount.disabled = true;
}

/* 
    Purchase Receipt
*/

const purchaseTable = document.getElementById('purchase_table');

function purchaseReceipt({ item, amount, price, discount, id }) {

    // Check if purchaseTable exists
    if (!purchaseTable) {
        console.error('Error: purchaseTable element not found');
        return; // Prevent further execution if table is missing
    }

    const totalDiscount = addDiscount(amount, price, discount);
    const subTotal = (amount * price) - totalDiscount;

    // Create a new table row element as a DOM node
    const newRow = document.createElement('tr');

    // Create table cells and append them to the row
    const itemCell = document.createElement('td');
    itemCell.textContent = item;
    newRow.appendChild(itemCell);

    const amountCell = document.createElement('td');
    amountCell.textContent = amount;
    newRow.appendChild(amountCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = price;
    newRow.appendChild(priceCell);

    const discountCell = document.createElement('td');
    discountCell.textContent = totalDiscount.toFixed(2);
    newRow.appendChild(discountCell);

    const subTotalCell = document.createElement('td');
    subTotalCell.textContent = subTotal.toFixed(2);
    newRow.appendChild(subTotalCell);

    const iconCell = document.createElement('td');
    const iconElement = document.createElement('i');
    iconElement.classList.add('bi', 'bi-trash3-fill', 'trashIcon');
    iconCell.appendChild(iconElement);
    newRow.appendChild(iconCell);

    iconCell.addEventListener('click', () => {
        if (confirm('¿Confirma que desea eliminar esta fila?')) {
            purchaseTable.removeChild(newRow); // Remove the row from the table
        }
    });

    purchaseTable.appendChild(newRow);
}

function addDiscount(amount, price, discount) {
    const percentage = discount / 100;
    const totalDiscount = amount * price * percentage;
    return totalDiscount;
}

function deleteAllRows() {
    const purchaseTable = document.getElementById('purchase_table');
  if (!purchaseTable) {
    console.error('Error: purchaseTable element not found');
    return;
  }

  if (confirm('Are you sure you want to delete all rows? This cannot be undone.')) {
    console.log('test', purchaseTable.rows);
    while (purchaseTable.rows.length > 0) {
      const firstRow = purchaseTable.rows[0];
      if (purchaseTable.contains(firstRow)) { // Ensure the row is still a child
        purchaseTable.removeChild(firstRow);
      } else {
        console.warn('Row already removed or invalid structure. Skipping.');
      }
    }
  }
  }

function restartFormAndDeleteRows() {
    restartAllForm(true);
    deleteAllRows();
}


/* 
    PDF
*/
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(10, 20, "Hello World!");
    doc.text(10, 30, "this is a test");
    doc.save("new File.pdf");
}

/* 
    Token
*/
function tokenId() {
    let newToken = '';
    let tokenCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tokenLength = 15;

    do {
        let tokenChar = tokenCharacters.charAt(Math.floor(Math.random() * tokenCharacters.length));
        newToken += tokenChar;
        tokenLength--;
    }
    while (tokenLength > 0);

    return newToken;
}