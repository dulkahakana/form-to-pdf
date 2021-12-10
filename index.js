document.addEventListener("DOMContentLoaded", () => {
    
    console.log(new Date())

    //? dom элемент для вывода в pdf
    //? const printBox = document.getElementById('brief-content')

    // блок с формой (скрыть перед выводом в pdf)
    const wrapperForm = document.getElementById('wrapper__form')
    // блок с данными из формы (показать перед выводом в pdf)
    const wrapperContent = document.getElementById('wrapper__content')
    // блок, содержимое которого, сохраняется в pdf
    const content = document.getElementById('pdf-content')
    // подключение к форме
    const briefForm = document.getElementById('brief-form')
    // опция "Знак + шрифт"
    const iconFontOption = document.getElementById('iconFont')
    // опция "Интегрированный"
    const integratedOption = document.getElementById('integrated')
    // блок с 8. ВЫБЕРИТЕ ТИП ЗНАКА:
    const typeIconOptions = document.getElementById('typeIconOptions')
    // блок с 9. ПРЕДПОЧИТАЕМЫЙ СТИЛЬ ОФОРМЛЕНИЯ ЗНАКА:
    const styleIconOptions = document.getElementById('styleIconOptions')


    // кнопка возвращающая назад к форме (для возможности изменить введенные данные)
    // не попадает в pdf
    const backToForm = document.getElementById('back-to-form')

    //? получение размера страницы
    //? let pageWidth = document.documentElement.scrollWidth
    //? let pageHeight = document.documentElement.scrollHeight

    // прослушивание событий
    briefForm.addEventListener('submit', retrieveFormValue)
    onOffCard('logo-options__item', 'logo-options__input')
    onOffCard('style-options__item', 'style-options__input')
    onOffCard('icon-options__item', 'icon-options__input')
    onOffCard('preferred-style-options__item', 'preferred-style-options__input')
    onOffCard('font-options__item', 'font-options__input')

    backToForm.addEventListener('click', () => {
        wrapperForm.classList.add('show')
        wrapperForm.classList.remove('hide')

        wrapperContent.classList.remove('show')
        wrapperContent.classList.add('hide')
        content.innerHTML = ''
    })

    // основная функция приложения, которая срабатывает на submit
    // собирает данные с формы => формирует новый блок для вывода в pdf => сохраняет в pdf
    function retrieveFormValue(event) {
        // отключение стандратного поведентия у события
        event.preventDefault()

        // скрывает форму
        wrapperForm.classList.add('hide')
        wrapperForm.classList.remove('show')

        // показывает блок для pdf
        wrapperContent.classList.remove('hide')
        wrapperContent.classList.add('show')
                
        // псевдомассив всех input
        const formInputs = document.querySelectorAll('input, textarea')

        // псевдомассивы для каждой группы checkbox 
        const logoOptions = document.querySelectorAll('.logo-options__input')
        const styleOptions = document.querySelectorAll('.style-options__input')
        const iconOptions = document.querySelectorAll('.icon-options__input')
        const preferredStyleOptions = document.querySelectorAll('.preferred-style-options__input')
        const fontOptions = document.querySelectorAll('.font-options__input')

        // сохранение данных с формы в объект
        // используется isCkeckboxOrRadio(type)
        const data = {}  
        formInputs.forEach(field => {
            const { name, value, type, checked } = field
            data[name] = isCkeckboxOrRadio(type) ? checked : value;
        })
        // console.log(data)

        // формирование dom с данными из формы для вывода в pdf
        const title = createElement('div', 'brief-title__pdf')
        title.textContent = `Бриф на разработку логотипа: "${data.companyName}"`
        content.appendChild(title)

        createBriefItem('1. НАЗВАНИЕ КОМПАНИИ/ПРОДУКТА, КОТОРОЕ ДОЛЖНО БЫТЬ НЕПОСРЕДСТВЕННО ОТРАЖЕНО В ЛОГОТИПЕ:', data.companyName)
        createBriefItem('2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem('3. ГДЕ БУДЕТ ИСПОЛЬЗОВАТЬСЯ ЛОГОТИП:', data.appointment)
        createBriefItem('4. КРИТИЧЕН ЛИ ДЛЯ ВАС ТАКОЙ ПАРАМЕТР КАК РЕГИСТР ШРИФТА В НАЗВАНИИ:', data.fontCase)
        createBriefItem('5. ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ, КОТОРЫЕ ДОЛЖНЫ ПРИСУТСТВОВАТЬ В ЛОГОТИПЕ:', data.slogan)
        
        const groupStyleType = createElement('div', 'group-options__container')
        createBriefItem('6. ТИП ЛОГОТИПА:', getOptionsGroup(logoOptions), 'form-value__options', groupStyleType)
        createBriefItem('7. СТИЛЬ ЛОГОТИПА:', getOptionsGroup(styleOptions), 'form-value__options', groupStyleType)        
        content.appendChild(groupStyleType)

        if (typeIconOptions.className.includes('show')) {
            const groupIconOptions = createElement('div', 'group-options__container')        
            createBriefItem('8. ТИП ЗНАКА:', getOptionsGroup(iconOptions), 'form-value__options', groupIconOptions)
            createBriefItem('9. СТИЛЬ ОФОРМЛЕНИЯ ЗНАКА:', getOptionsGroup(preferredStyleOptions), 'form-value__options', groupIconOptions)
            content.appendChild(groupIconOptions)
        }
        

        // const groupIconFont = createElement('div', 'group-options__container')
        createBriefItem('10. СТИЛЬ ШРИФТОВОГО РЕШЕНИЯ:', getOptionsGroup(fontOptions), 'form-value__options')
        // content.appendChild(groupIconFont)

        createBriefItem('11. ЦВЕТОВОЕ РЕШЕНИЕ ЛОГОТИПА:', data.colors)
        createBriefItem('12. ХАРАКТЕРИСТИКА ЗНАКА:', data.patternLogo)
        createBriefItem('13. КЛЮЧЕВЫЕ СЛОВА:', data.keywords)
        createBriefItem('14. ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:', data.additionalInfo)

                        
        // opt объект конфигурации html2pdf
        const opt = {
            margin: [1, 2, 1, 2],
            filename: `${data.companyName}_logo_brief_Cliptic`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas:  {
                width: 980,
                // height: 1524,
                height: document.documentElement.scrollHeight,
                scale: 2,
                removeContainer: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            jsPDF: { 
                // format: 'a4',
                precision: 16,
                unit: 'px',
                hotfixes: ['px_scaling'],
                format: [980, document.documentElement.scrollHeight],
                // floatPrecision: 16,
                /* orientation: 'portrait' */
            }
        }

        
        // возвращает страницу вывода в pdf в начало страницы
        // спасает от рассыпания pdf 
        // window.scrollTo(0, 0) // не работает на мобилках
        title.scrollIntoView(top)
        //* вызов метода для сохранения в pdf
        html2pdf().set(opt).from(content).save()
    }

    // проверка на checkbox и radio
    function isCkeckboxOrRadio(type) {
        return ['checkbox', 'radio'].includes(type)
    }

    // создание контейнера для формирования листа для вывода в pdf
    function createBriefItem(
        text,
        formValue,
        classValue = 'form-value',
        dadElement = content,
        classItem = 'brief-item__pdf',
        classTitle = 'item-label__pdf'
    ) {
        const briefItem = createElement('div', classItem)
        const itemTitle = createElement('div', classTitle)
        const itemFormValue = createElement('div', classValue)

        itemTitle.textContent = `${text}`
        briefItem.appendChild(itemTitle)

        if (typeof formValue === 'string') {
            itemFormValue.textContent = formValue
            briefItem.appendChild(itemFormValue)
            
        } else {
            briefItem.appendChild(formValue)            
        }
        
        dadElement.appendChild(briefItem)        
    }

    // возвращает dom элемент с выбранными опциями
    function getOptionsGroup(checkedList) {
        const trueOptionsItem = createElement('div', 'container__to-pdf')
        for (option of checkedList) {
            if (option.checked) {
                const optionsItem = createElement('div', 'item__to-pdf')
                const elem = option.parentNode
                const imgElem = elem.querySelector('img').cloneNode()
                const labelElem = elem.querySelector('label').cloneNode(true)                
                labelElem.classList = ''
                labelElem.textContent = `${labelElem.textContent.substr(0, 7)}...`

                optionsItem.appendChild(labelElem)
                optionsItem.appendChild(imgElem)
                trueOptionsItem.appendChild(optionsItem)
            }
        }
        return trueOptionsItem
    }

    // создаем dom элемент с классом
    function createElement(type, className) {
        const element = document.createElement(type)
        element.className = className
        return element
    }        

    // добавление события на options__input с помощью рекурсии getCheckbox
    function onOffCard(targetClassName, inputClassName) {
        const elems = document.querySelectorAll(`.${targetClassName}`)
        for (elem of elems) {
            elem.addEventListener('click', (event) => {
                const elem = event.target
                if (!elem.className.includes(inputClassName)) {
                    checkboxDad(elem, targetClassName, inputClassName)
                } else if (elem.getAttribute('data') === 'icon-options') {
                    if (!iconFontOption.checked && !integratedOption.checked) {
                        hideGroupe(typeIconOptions, styleIconOptions)                    
                    } else if (iconFontOption.checked || integratedOption.checked) {
                        showGroupe(typeIconOptions, styleIconOptions)
                    }
                }
            })
        }
    }

    // функция рекурсия в поиске родителя input и запуска вкл/выкл на input
    function checkboxDad(elem, targetClassName, inputClassName) {
        if (elem.className.includes(targetClassName)) {
            const inputElem = elem.querySelector(`.${inputClassName}`)
            onOffChecked(inputElem)
            
            if (inputElem.getAttribute('data') === 'icon-options') {
                if (!iconFontOption.checked && !integratedOption.checked) {
                    hideGroupe(typeIconOptions, styleIconOptions)             
                } else if (iconFontOption.checked || integratedOption.checked) {
                    showGroupe(typeIconOptions, styleIconOptions)
                }
            }
        } else {
            checkboxDad(elem.parentNode, targetClassName, inputClassName)
        }
    }

    // вспомогательная функция запускается в checkboxDad 
    function onOffChecked (input) {
        input.checked ? input.checked = false : input.checked = true
    }

    function hideGroupe(...arr) {
        for (item of arr) {
            item.classList.remove('show')
            item.classList.add('hide')
        }
    }

    function showGroupe(...arr) {
        for (item of arr) {
            item.classList.remove('hide')
            item.classList.add('show')
        }
    }

}); /* DOMContentLoaded */