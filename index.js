console.log(new Date())

// dom элемент для вывода в pdf
const printBox = document.getElementById('wrapper')

// подключение к форме для получения данных
const briefForm = document.getElementById('brief-form')

// TODO добавить формирование имени файла от переданного имени компании
const opt = {
    filename: 'Cliptic_logo_brief',
    html2canvas:  { scale: 2 },
    // TODO настройка разрыва страниц для pdf (трабл!)
    pagebreak: {
        mode: ['avoid-all', 'css']
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
}

briefForm.addEventListener('submit', retrieveFormValue)

function retrieveFormValue(event) {
    event.preventDefault()

    // удаление стилей перед сохранением pdf
    // const headMeta = document.querySelector('head')
    // const metaViewport = document.getElementById('metaViewport')
    // const linkStyle = document.getElementById('style')
    // headMeta.removeChild(metaViewport)

    html2pdf().set(opt).from(briefForm).save()
    // html2pdf().from(printBox).save('Cliptic_logo_brief')
}