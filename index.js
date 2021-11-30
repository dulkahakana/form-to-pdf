console.log(new Date())
// подключение переменной из глобальной видимости
const { jsPDF } = window.jspdf


// const printBox = document.getElementById('printBox')
// const printBtn = document.getElementById('printBtn')

let doc = new jsPDF();
// console.log(doc)


// doc.text('Test text', 10, 10)
// doc.save('a4.pdf')

const specialElementHandlers = {
    '#printBox': function (elements, renderer) {
        return true
    }
}

// printBtn.addEventListener('click', createPDF)


function createPDF () {
    doc.fromHTML(printBox), 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    }
    doc.save('sample.pdf')
}






// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");



