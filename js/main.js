
/* 
    Loader
*/
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
    loader.style.display = "none";
})

/* 
    Purchase
*/

const quotation_form = document.getElementById('quotation_form');
const submitBtn = document.getElementById('submitBtn');
const allPurchases = [];

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation()
    if (!quotation_form.checkValidity()) {
        quotation_form.classList.add('was-validated');
    } else {
        console.log("test");  
    }
    
});

class Purchase {
    constructor(item, price, amount, token) {
        this.item = item;
        this.price = price;
        this.amount = amount
        this.token = token;
    }
}

function addPurchase(item, price, amount) {
    const newPurchase = new Purchase(item, price, amount);
    allPurchases.push(newPurchase);
}









/* 
    PDF
*/
function generatePDF() {
    const {jsPDF} = window.jspdf;
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
    while(tokenLength > 0);

    return newToken;
}