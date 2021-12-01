console.log(new Date())

// dom элемент для вывода в pdf
const printBox = document.getElementById('brief-content')

// подключение к форме для получения данных
const briefForm = document.getElementById('brief-form')

const fileName = 'Ecliptic_logo_brief'

briefForm.addEventListener('submit', retrieveFormValue)

function retrieveFormValue(event) {
    event.preventDefault()

    // библиотека через канвас делает скрин и сохраняет его в pdf
    html2pdf().from(printBox).save(fileName)
}

function isCkeckboxOrRadio(type) {
    return ['checkbox', 'radio'].includes(type)
}

function сreatePDF (text) {
    doc.text(text, 10, 10)
    doc.save('a4.pdf')
}