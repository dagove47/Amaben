
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

const generatePDF_form = document.getElementById('generatePDF_form');
const generatePDF_btn = document.getElementById('generatePDF_btn');
const inputDate = document.getElementById('date');
const employee = document.getElementById('employee');

const client = document.getElementById('client');

const phoneNum = document.getElementById('phoneNum');

const inputItem = quotation_form.querySelector('[data-input-item]');
const selectItem = quotation_form.querySelector('[data-select-item]');
const newItemCheck = document.getElementById('newItemCheck');

const inputAmount = quotation_form.querySelector('[data-input-amount]');
const selectAmount = quotation_form.querySelector('[data-select-amount]');
const newAmountCheck = document.getElementById('newAmountCheck');

const inputPrice = quotation_form.querySelector('[data-input-price]');
const selectPrice = quotation_form.querySelector('[data-select-price]');
const newPriceCheck = document.getElementById('newPriceCheck');

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
            amount: parseFloat(selectAmount.value || inputAmount.value),
            price: parseFloat(selectPrice.value || inputPrice.value),
            discount: parseFloat(discount.value) || 0,
            id: tokenId(),
        };

        addPurchase(purchaseDetails);
        purchaseReceipt(purchaseDetails);
        restartAllForm(false);
    }

});

generatePDF_btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation()
    if (!generatePDF_form.checkValidity()) {
        generatePDF_form.classList.add('was-validated');
    } else {
        generatePDF();
        console.log('empleado', employee.value);
        console.log('date', inputDate.value);

        generatePDF_form.removeAttribute('class', 'was-validated');

        // const purchaseDetails = {
        //     item: selectItem.value || inputItem.value,
        //     amount: parseFloat(selectAmount.value || inputAmount.value),
        //     price: parseFloat(selectPrice.value || inputPrice.value),
        //     discount: parseFloat(discount.value) || 0,
        //     id: tokenId(),
        // };

        // addPurchase(purchaseDetails);
        // purchaseReceipt(purchaseDetails);
        // restartAllForm(false);
    }
})

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
}

function restartAllForm(allInputs) {
    const Inputs = quotation_form.querySelectorAll('input');
    const allSelects = quotation_form.querySelectorAll('select');
    allSelects.forEach(select => select.value = '');
    Inputs.forEach((input) => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (!((allInputs === false && input.id === 'client') || (allInputs === false && input.id === 'phoneNum'))) {
            input.value = '';
        }
    });
    quotation_form.removeAttribute('class', 'was-validated');
    toggleOption(selectItem, inputItem);
    toggleOption(selectAmount, inputAmount);
    toggleOption(selectPrice, inputPrice);
    removeInputDiscount();
}

newItemCheck.addEventListener('change', function () {
    this.checked ? toggleOption(inputItem, selectItem) : toggleOption(selectItem, inputItem);
});

newAmountCheck.addEventListener('change', function () {
    this.checked ? toggleOption(inputAmount, selectAmount) : toggleOption(selectAmount, inputAmount);
});

newPriceCheck.addEventListener('change', function () {
    this.checked ? toggleOption(inputPrice, selectPrice) : toggleOption(selectPrice, inputPrice);
});

discountCheck.addEventListener('change', function () {
    this.checked ? addInputDiscount() : removeInputDiscount();
})

function toggleOption(insertOpt, removeOpt) {
    removeOpt.value = '';
    removeOpt.classList.add('none');
    removeOpt.disabled = true;
    insertOpt.classList.remove('none');
    insertOpt.disabled = false;
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

const purchaseTableBody = document.getElementById('purchase_table_body');

function purchaseReceipt({ item, amount, price, discount, id }) {

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
            purchaseTableBody.removeChild(newRow); // Remove the row from the table
        }
    });

    purchaseTableBody.appendChild(newRow);
}

function addDiscount(amount, price, discount) {
    const percentage = discount / 100;
    const totalDiscount = amount * price * percentage;
    return totalDiscount;
}

function deleteAllRows() {
    if (confirm('¿Está seguro de que desea eliminar todas las filas? Esto no se puede deshacer.')) {
        purchaseTableBody.textContent = '';
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
    // Importa jsPDF desde el objeto window
    const { jsPDF } = window.jspdf;

    // Crea un nuevo documento PDF
    const doc = new jsPDF();

    // Establece la configuración para centrar el texto con tamaño de fuente más pequeño
    const textOptions = { align: "center" };
    doc.setFontSize(12);

    const docDate = "Fecha: 16 / 02 / 2023";
    const textWidth = doc.getTextWidth(docDate);
    const x = doc.internal.pageSize.width - textWidth - 10; // Ajusta el margen según tus necesidades

    doc.text(docDate, x, 10, textOptions);

    // Añade una imagen (asegúrate de tener la URL correcta de la imagen)
    const imageUrl = '../images/Amaben_Logo.jpg'; // Reemplaza '../images/Amaben_Logo.jpg' con la URL de tu imagen
    doc.addImage(imageUrl, 'JPEG', 80, 20, 50, 30); // Ajusta las coordenadas y dimensiones según tus necesidades

    // Agrega el contenido al PDF con tamaños de fuente más pequeños
    doc.text("PROFORMA", 105, 70, textOptions);

    // Detalles de la tabla
    const tableHeaders = ["Productos", "Precios", "Cantidad", "Descuento", "Subtotal"];
    const tableData = [
        ["Aretes", "10000", "5", "1000", "9000"],
        ["Aretes", "10000", "5", "1000", "9000"],
        ["Aretes", "10000", "5", "1000", "9000"],
        ["Aretes", "10000", "5", "1000", "9000"],
        ["Aretes", "10000", "5", "1000", "9000"],
        ["Aretes", "10000", "5", "1000", "9000"],
    ];

    // Configuración de la tabla
    const tableProps = { startY: 80, margin: { horizontal: 15 } };

    // Agrega la tabla al PDF
    doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        ...tableProps
    });

    // Otros elementos centrados con tamaños de fuente más pequeños
    doc.text("Total: 9000", 105, doc.autoTable.previous.finalY + 10, textOptions);
    doc.text("GRACIAS!", 105, doc.autoTable.previous.finalY + 40, textOptions);
    doc.text("Por acompañarnos en el LIVE AMABEN!", 105, doc.autoTable.previous.finalY + 50, textOptions);
    doc.text("Te esperamos todos los martes y viernes", 105, doc.autoTable.previous.finalY + 60, textOptions);
    doc.text("de 1:00pm a 9:00pm", 105, doc.autoTable.previous.finalY + 70, textOptions);

    // Número de teléfono con icono de WhatsApp
    const numeroTelefono = "8595-7676";
    const iconoWhatsApp = "../images/whatsapp.png";
    const anchoIconoWhatsApp = 5;

    doc.addImage(iconoWhatsApp, 'PNG', 92, doc.autoTable.previous.finalY + 80 - 4, anchoIconoWhatsApp, anchoIconoWhatsApp);
    doc.text(numeroTelefono, 99 + anchoIconoWhatsApp + 5, doc.autoTable.previous.finalY + 80, textOptions);

    const redesSociales = [
        { nombre: "../images/tiktok.png", usuario: "amaben joyeria" },
        { nombre: "../images/facebook.png", usuario: "famabencr" },
        { nombre: "../images/instagram.png", usuario: "amabenjoyeriacostarica" },
    ];

    const espacioEntreRedes = 5; // Ajusta según sea necesario

    // Calcular el ancho total de las imágenes y el texto
    const anchoTotal = redesSociales.reduce((total, red) => total + 16 + doc.getTextWidth(red.usuario) + espacioEntreRedes, 0);

    // Calcular la posición inicial para centrar las redes sociales
    let xPosition = (doc.internal.pageSize.width - anchoTotal) / 2;
    let yPosition = doc.autoTable.previous.finalY + 100;

    // Iterar sobre las redes sociales y agregar imágenes y texto
    redesSociales.forEach(red => {
        // Agregar imagen
        doc.addImage(red.nombre, 'PNG', xPosition, yPosition, 10, 10);

        // Agregar texto al lado de la imagen
        doc.text(`${red.usuario}`, xPosition + 13, yPosition + 8);

        // Incrementar la posición para la próxima iteración
        xPosition += 20 + doc.getTextWidth(red.usuario) + espacioEntreRedes;
    });

    // Guardar el PDF
    doc.save("documento.pdf");
}


/* 
    Whatsapp Message
*/

const whatsappForm = document.getElementById('whatsappForm');
const whatsappMessageBtn = document.getElementById('whatsappMessageBtn');

whatsappMessageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation()
    if (!whatsappForm.checkValidity()) {
        whatsappForm.classList.add('was-validated');
    } else {
        sendWhatsAppMessage();
        console.log('whatsapp Message Btn');

        whatsappForm.removeAttribute('class', 'was-validated');

        // const purchaseDetails = {
        //     item: selectItem.value || inputItem.value,
        //     amount: parseFloat(selectAmount.value || inputAmount.value),
        //     price: parseFloat(selectPrice.value || inputPrice.value),
        //     discount: parseFloat(discount.value) || 0,
        //     id: tokenId(),
        // };

        // addPurchase(purchaseDetails);
        // purchaseReceipt(purchaseDetails);
        // restartAllForm(false);
    }
})

function sendWhatsAppMessage() {
    let whatsappMessage = document.getElementById('whatsappMessage').value.replace('[Nombre]', client.value);
    whatsappMessage = encodeURIComponent(whatsappMessage.replace(/%0A/g, '%0A%0A'));
    const whatsappLink = 'https://wa.me/506' + phoneNum.value + '?text=' + whatsappMessage;
    window.open(whatsappLink, '_blank');
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