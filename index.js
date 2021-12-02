console.log(new Date())

// dom элемент для вывода в pdf
const printBox = document.getElementById('brief-content')
// dom элемент для отображения сформированной страницы
const content = document.getElementById('brief-content')
// подключение к форме для получения данных
const briefForm = document.getElementById('brief-form')


// получение размера страницы
let pageWidth = document.documentElement.scrollWidth
let pageHeight = document.documentElement.scrollHeight

// прослушивание собития sunbit на форме
briefForm.addEventListener('submit', retrieveFormValue)

onOffCheckedList('logo-options__item', 'logo-options__input', 'logo-options__item__on')


// функция которая срабатывает на sumbit по форме
function retrieveFormValue(event) {
    event.preventDefault()
    console.log('sumbit')

    const fields = document.querySelectorAll('input, textarea')
    const data = {}

    const optionsLogo = document.querySelectorAll('.logo-options__input')
    console.log(optionsLogo)

    function getTrueChecked(optionsLogo) {
        const result = []
        for (option of optionsLogo) {
            if (option.checked) {
                result.push(option.getAttribute('data'))
            }
        }
        return result.join(', ')
    }
    

    // console.log(optionsLogo)

    fields.forEach(field => {
        const { name, value, type, checked } = field
        data[name] = isCkeckboxOrRadio(type) ? checked : value;
    })

    content.innerHTML = ''

    const title = createElement('div', 'brief-title')
    title.textContent = `Бриф на разработку логотипа ${data.companyName}`
    content.appendChild(title)
    
    // формирование dom с данными из формы для вывода в pdf    
    createBriefItem(content, '1. НАЗВАНИЕ КОМПАНИИ/ПРОДУКТА, КОТОРОЕ ДОЛЖНО БЫТЬ НЕПОСРЕДСТВЕННО ОТРАЖЕНО В ЛОГОТИПЕ:', data.companyName)
    createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
    createBriefItem(content, '3. КРИТИЧЕН ЛИ ДЛЯ ВАС ТАКОЙ ПАРАМЕТР КАК РЕГИСТР ШРИФТА В НАЗВАНИИ:', data.fontCase)
    createBriefItem(content, '4. ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ, КОТОРЫЕ ДОЛЖНЫ ПРИСУТСТВОВАТЬ В ЛОГОТИПЕ', data.slogan)
    createBriefItem(content, '6. ПРЕДПОЧИТАЕМЫЙ СТИЛЬ ЛОГОТИПА:', getTrueChecked(optionsLogo))
    
    pageWidth = document.documentElement.scrollWidth
    pageHeight = document.documentElement.scrollHeight
    console.log('Page size:' + pageWidth + ' x ' + pageHeight)

    // console.log(`Размер content: ${content.offsetHeight} X ${content.offsetWidth}`)
    
    const opt = {
        margin: 1,
        filename: `${data.companyName}_logo_brief_Cliptic.jpg`,
        image: { type: 'jpeg', quality: 0.5 },
        html2canvas:  {
            width: 800,
            height: 1100,
            scale: 2,
            removeContainer: true
        },
        pagebreak: { mode: ['avoid-all', 'css'] },
        jsPDF: { 
            // unit: 'px',
            // hotfixes: ['px_scaling'],
            format: 'a4',
            // format: [pageWidth, pageHeight],
            // floatPrecision: 16,
            precision: 16
            /* orientation: 'portrait' */
        }
    }

    // console.log(`opt: ${opt.jsPDF.format[0]} x ${opt.jsPDF.format[1]}`)

    //* вызов метода для сохранения в pdf
    html2pdf().set(opt).from(printBox).save()
}

// проверка на checkbox и radio
function isCkeckboxOrRadio(type) {
    return ['checkbox', 'radio'].includes(type)
}

// создание контейнера для формирования листа для вывода в pdf
function createBriefItem(dadElement, text, formValue, classItem = 'brief-form__item', classContent = 'brief-form__label') {
    const briefItem = createElement('div', classItem)
    const itemContent = createElement('div', classContent)
    const itemFormValue = createElement('span', 'form-value')
    itemFormValue.textContent = formValue
    itemContent.textContent = ` ${text}`
    itemContent.appendChild(itemFormValue)
    briefItem.appendChild(itemContent)
    dadElement.appendChild(briefItem)
}

// создаем dom элемент с классом
function createElement(type, className) {
    const element = document.createElement(type)
    element.className = className
    return element
}

// навешивает событие click на блок targetClassName с radio/checkbox исключая наложенные сверху блоки exceptionClassName
function onOffCheckedList(targetClassName, inputClassName, onClassName) {
    const elems = document.querySelectorAll(`.${targetClassName}`)
    for (item of elems) {
        item.addEventListener('click', (event) => {
            // onOffClass(elems, onClassName)
            if (event.target.className === targetClassName) {
                const elem = event.target
                elem.querySelector(`.${inputClassName}`).checked = true
                // console.log(elem)
                // elem.classList.toggle(onClassName)
            } else {
                const elem = event.target.parentNode
                elem.querySelector(`.${inputClassName}`).checked = true
                // console.log(elem)
                // elem.classList.toggle(onClassName)
            }
        })
    }
}

// function onOffClass(elems, onClassName) {   
//     for (elem of elems) {
//         if (!elem.querySelector('input').checked) elem.classList.remove(onClassName)
//     }
//     console.log('onOffClass')
// }

