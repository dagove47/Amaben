
/* 
    Loader
*/
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
    loader.style.display = "none";
})


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








