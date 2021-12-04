document.addEventListener("DOMContentLoaded", function(event) {
    
    console.log(new Date())

    //? dom элемент для вывода в pdf
    //? const printBox = document.getElementById('brief-content')

    // блок с формой (скрыть перед выводом в pdf)
    const wrapperForm = document.getElementById('wrapper__form')
    // блок с даддыми из формы (показать перед выводом в pdf)
    const wrapperCaontent = document.getElementById('wrapper__content')
    // блок, содержимое которого, сохраняется в pdf
    const content = document.getElementById('pdf-content')
    // подключение к форме
    const briefForm = document.getElementById('brief-form')

    //? получение размера страницы
    //? let pageWidth = document.documentElement.scrollWidth
    //? let pageHeight = document.documentElement.scrollHeight

    // прослушивание собитий
    briefForm.addEventListener('submit', retrieveFormValue)
    onOffCheckedList('logo-options__item', 'logo-options__input', 'logo-options__item__on')

    // основная функция приложения, которая срабатывает на submit
    // собирает данные с формы => формирует новый блок для вывода => сохраняет в pdf
    function retrieveFormValue(event) {
        // отключение стандратного поведентия у события
        event.preventDefault()
        
        //? test log
        console.log('sumbit')

        const fields = document.querySelectorAll('input, textarea')
        const data = {}


        const optionsLogo = document.querySelectorAll('.logo-options__input')

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
        // TODO не верный подход, нужно делать через убрать показать блок
        // TODO чтобы была возможность изменить данные в идеале все сохранить в локал storage
        // content.innerHTML = ''
        briefForm.classList.add('hide')
        content.classList.add('show')

        // content.classList.remove('brief-content')
        // content.classList.add('brief-content__pdf')

        const title = createElement('div', 'brief-title')
        title.textContent = `Бриф на разработку логотипа ${data.companyName}`
        content.appendChild(title)
        // TODO реализовать кнопку назад вне элемента контент content возвращающую форму
        // формирование dom с данными из формы для вывода в pdf    
        createBriefItem(content, '1. НАЗВАНИЕ КОМПАНИИ/ПРОДУКТА, КОТОРОЕ ДОЛЖНО БЫТЬ НЕПОСРЕДСТВЕННО ОТРАЖЕНО В ЛОГОТИПЕ:', data.companyName)
        createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem(content, '2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem(content, '3. КРИТИЧЕН ЛИ ДЛЯ ВАС ТАКОЙ ПАРАМЕТР КАК РЕГИСТР ШРИФТА В НАЗВАНИИ:', data.fontCase)
        createBriefItem(content, '4. ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ, КОТОРЫЕ ДОЛЖНЫ ПРИСУТСТВОВАТЬ В ЛОГОТИПЕ', data.slogan)
        createBriefItem(content, '6. ПРЕДПОЧИТАЕМЫЙ СТИЛЬ ЛОГОТИПА:', getTrueChecked(optionsLogo))

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
    function onOffCheckedList(targetClassName, inputClassName, onClassName = '') {
        const elems = document.querySelectorAll(`.${targetClassName}`)
        for (item of elems) {
            item.addEventListener('click', (event) => {
                // onOffClass(elems, onClassName)
                if (event.target.className === targetClassName) {
                    const elem = event.target
                    elem.querySelector(`.${inputClassName}`).checked = true
                    console.log(elem)
                    // elem.classList.toggle(onClassName)
                } else {
                    const elem = event.target.parentNode
                    elem.querySelector(`.${inputClassName}`).checked = true
                    // проверяем на совпадение 
                    if (elem.querySelector('.logo-options__label').textContent === 'Интегрированный' || elem.querySelector('.logo-options__label').textContent === 'Знак + шрифт') {
                        console.log(elem.querySelector('.logo-options__label').textContent)
                    }
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

}); /* DOMContentLoaded */