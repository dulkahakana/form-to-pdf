console.log(new Date())
// подключение переменной из глобальной видимости
const { jsPDF } = window.jspdf
const doc = new jsPDF();

const briefForm = document.getElementById('brief-form')

briefForm.addEventListener('submit', retrieveFormValue)

function retrieveFormValue(event) {
    event.preventDefault()

    const fields = document.querySelectorAll('input, textarea')
    const data = {}

    fields.forEach(field => {
        const { name, value, type, checked } = field
        data[name] = isCkeckboxOrRadio(type) ? checked : value;
    })

    const formatedData = `ыфафыа`
    doc.text(formatedData, 10, 10)
    doc.save('a4.pdf')
}

function isCkeckboxOrRadio(type) {
    return ['checkbox', 'radio'].includes(type)
}

function сreatePDF (text) {
    doc.text(text, 10, 10)
    doc.save('a4.pdf')
}


// const printBox = document.getElementById('brief-content')
// const saveBtn = document.getElementById('saveBtn')

// const specialElementHandlers = {
//     '#printBox': function (elements, renderer) {
//         return true
//     }
// }

// saveBtn.addEventListener('click', () => {
//     сreatePDF(testDataToPDF)
// })


// function createPDF () {
//     doc.fromHTML(printBox), 15, 15, {
//         'width': 170,
//         'elementHandlers': specialElementHandlers
//     }
//     doc.save('sample.pdf')
// }

// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();

// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");



