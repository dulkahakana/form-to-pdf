document.addEventListener("DOMContentLoaded", function(event) {
    
    console.log(new Date())

    //? dom элемент для вывода в pdf
    //? const printBox = document.getElementById('brief-content')

    // блок с формой (скрыть перед выводом в pdf)
    const wrapperForm = document.getElementById('wrapper__form')
    // блок с даддыми из формы (показать перед выводом в pdf)
    const wrapperContent = document.getElementById('wrapper__content')
    // блок, содержимое которого, сохраняется в pdf
    const content = document.getElementById('pdf-content')
    // подключение к форме
    const briefForm = document.getElementById('brief-form')
    // кнопка возвращающая назад к форме (для возможности изменить введенные данные)
    // не попадает в pdf
    const backToForm = document.getElementById('back-to-form')

    //? получение размера страницы
    //? let pageWidth = document.documentElement.scrollWidth
    //? let pageHeight = document.documentElement.scrollHeight

    // прослушивание собитий
    briefForm.addEventListener('submit', retrieveFormValue)
    onOffCheckedList('logo-options__item', 'logo-options__input')
    onOffCheckedList('style-options__item', 'style-options__input')

    backToForm.addEventListener('click', () => {
        wrapperForm.classList.add('show')
        wrapperForm.classList.remove('hide')

        wrapperContent.classList.remove('show')
        wrapperContent.classList.add('hide')
        content.innerHTML = ''
    })

    // основная функция приложения, которая срабатывает на submit
    // собирает данные с формы => формирует новый блок для вывода => сохраняет в pdf
    function retrieveFormValue(event) {
        // отключение стандратного поведентия у события
        event.preventDefault()

        wrapperForm.classList.add('hide')
        wrapperForm.classList.remove('show')
        // wrapperForm.classList.toggle('show')

        // wrapperContent.classList.toggle('hide')
        wrapperContent.classList.remove('hide')
        wrapperContent.classList.add('show')
        
        //? test log
        console.log('sumbit')

        const fields = document.querySelectorAll('input, textarea')
        const data = {}
        
        const optionsLogo = document.querySelectorAll('.logo-options__input')
        const stylesLogo = document.querySelectorAll('.style-options__input')

        // TODO нужно чтобы картинки формировала
        function getTrueChecked(checkedList) {
            // const result = []
            const trueOptionsItem = createElement('div', 'options-container')
            for (option of checkedList) {
                if (option.checked) {
                    const optionsItem = createElement('div', 'options-item')
                    const elem = option.parentNode
                    const imgElem = elem.querySelector('img')
                    const labelElem = elem.querySelector('label')
                    // TODO элементы не копируются а забираются с формы
                    optionsItem.appendChild(labelElem).cloneNode(true)
                    optionsItem.appendChild(imgElem).cloneNode(true)
                    trueOptionsItem.appendChild(optionsItem)

                    // console.log(imgElem, labelElem)
                    // result.push(option.getAttribute('data'))
                }
            }
            // return result.join(', ')
            return trueOptionsItem
        }
        
        

        // console.log(optionsLogo)

        fields.forEach(field => {
            const { name, value, type, checked } = field
            data[name] = isCkeckboxOrRadio(type) ? checked : value;
        })       


        const title = createElement('div', 'brief-title')
        title.textContent = `Бриф на разработку логотипа ${data.companyName}`
        content.appendChild(title)
        // формирование dom с данными из формы для вывода в pdf    
        createBriefItem(content, '1. НАЗВАНИЕ КОМПАНИИ/ПРОДУКТА, КОТОРОЕ ДОЛЖНО БЫТЬ НЕПОСРЕДСТВЕННО ОТРАЖЕНО В ЛОГОТИПЕ:', data.companyName)
        createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem(content, '3. КРИТИЧЕН ЛИ ДЛЯ ВАС ТАКОЙ ПАРАМЕТР КАК РЕГИСТР ШРИФТА В НАЗВАНИИ:', data.fontCase)
        createBriefItem(content, '4. ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ, КОТОРЫЕ ДОЛЖНЫ ПРИСУТСТВОВАТЬ В ЛОГОТИПЕ', data.slogan)
        createBriefItem(content, '6. ПРЕДПОЧИТАЕМЫЙ ТИП ЛОГОТИПА:', getTrueChecked(optionsLogo))
        createBriefItem(content, '7. ПРЕДПОЧИТАЕМЫЙ СТИЛЬ ЛОГОТИПА:', getTrueChecked(stylesLogo))

        const backButton = createElement('button', 'back-to-form')


        // pageWidth = document.documentElement.scrollWidth
        // pageHeight = document.documentElement.scrollHeight
        // console.log('Page size:' + pageWidth + ' x ' + pageHeight)

        // console.log(`Размер content: ${content.offsetHeight} X ${content.offsetWidth}`)
        
        // при DPI = 150, разрешение формата А4 имеет 1240 × 1754 пикселей; при DPI = 300, разрешение формата А4 имеет 2480 × 3508 пикселей.
        // opt объект конфигурации html2pdf
        const opt = {
            margin: [1, 2, 1, 2],
            filename: `${data.companyName}_logo_brief_Cliptic`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas:  {
                width: 1080,
                height: 1524,
                scale: 2,
                removeContainer: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            jsPDF: { 
                // unit: 'px',
                // hotfixes: ['px_scaling'],
                format: 'a4',
                // format: [1240, 1754],
                // floatPrecision: 16,
                precision: 16
                /* orientation: 'portrait' */
            }
        }

        // console.log(`opt: ${opt.jsPDF.format[0]} x ${opt.jsPDF.format[1]}`)

        //* вызов метода для сохранения в pdf
        html2pdf().set(opt).from(content).save()
    }

    // проверка на checkbox и radio
    function isCkeckboxOrRadio(type) {
        return ['checkbox', 'radio'].includes(type)
    }

    // создание контейнера для формирования листа для вывода в pdf
    function createBriefItem(dadElement, text, formValue, classItem = 'brief-form__item', classContent = 'brief-form__label') {
        const briefItem = createElement('div', classItem)
        const itemContent = createElement('div', classContent)
        const itemFormValue = createElement('div', 'form-value')

        if (typeof formValue === 'string') {
            itemFormValue.textContent = formValue
        } else {
            itemFormValue.appendChild(formValue)            
        }
        
        
        itemContent.textContent = `${text}`
        itemContent.appendChild(itemFormValue)
        briefItem.appendChild(itemContent)
        dadElement.appendChild(briefItem)
    }

    function getTruCheckedsElems(checketList) {

    }

    // создаем dom элемент с классом
    function createElement(type, className) {
        const element = document.createElement(type)
        element.className = className
        return element
    }

    

    // навешивает событие click на блок targetClassName с radio/checkbox исключая наложенные сверху блоки exceptionClassName
    function onOffCheckedList(targetClassName, inputClassName, onClassName = '') {
        const elems = document.querySelectorAll(`.${targetClassName}`)
        for (item of elems) {
            item.addEventListener('click', (event) => {                
                
                if (event.target.className === targetClassName) {

                    const elem = event.target
                    let elemInput = elem.querySelector(`.${inputClassName}`)
                    elemInput.checked ? elemInput.checked = false : elemInput.checked = true
                    
                } else if (event.target.className !== targetClassName && event.target.className !== inputClassName) {

                    const elem = event.target.parentNode
                    let elemInput = elem.querySelector(`.${inputClassName}`)
                    elemInput.checked ? elemInput.checked = false : elemInput.checked = true

                    // проверяем на совпадение для открытия доп полей формы
                    if (elem.querySelector('.logo-options__label').textContent === 'Интегрированный' || elem.querySelector('.logo-options__label').textContent === 'Знак + шрифт') {
                        console.log(elem.querySelector('.logo-options__label').textContent)
                    }
                }
            })
        }
    }
}); /* DOMContentLoaded */