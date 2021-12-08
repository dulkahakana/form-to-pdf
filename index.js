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
    // кнопка возвращающая назад к форме (для возможности изменить введенные данные)
    // не попадает в pdf
    const backToForm = document.getElementById('back-to-form')

    //? получение размера страницы
    //? let pageWidth = document.documentElement.scrollWidth
    //? let pageHeight = document.documentElement.scrollHeight

    // прослушивание собитий
    briefForm.addEventListener('submit', retrieveFormValue)
    onOffCard('logo-options__item', 'logo-options__input')
    // onOffCheckedList('style-options__item', 'style-options__input')
    // TODO только style-options__item' работает через рекурсию
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
            console.log(type)
            data[name] = isCkeckboxOrRadio(type) ? checked : value;
        })
        console.log(data)

        // формирование dom с данными из формы для вывода в pdf
        const title = createElement('div', 'brief-title__pdf')
        title.textContent = `Бриф на разработку логотипа: "${data.companyName}"`
        content.appendChild(title)

        createBriefItem('1. НАЗВАНИЕ КОМПАНИИ/ПРОДУКТА, КОТОРОЕ ДОЛЖНО БЫТЬ НЕПОСРЕДСТВЕННО ОТРАЖЕНО В ЛОГОТИПЕ:', data.companyName)
        createBriefItem('2. ОСНОВНЫЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ КОМПАНИИ/ОПИСАНИЕ ПРОДУКТА:', data.aboutCompany)
        createBriefItem('3. ГДЕ БУДЕТ ИСПОЛЬЗОВАТЬСЯ ЛОГОТИП:', data.appointment)
        createBriefItem('4. КРИТИЧЕН ЛИ ДЛЯ ВАС ТАКОЙ ПАРАМЕТР КАК РЕГИСТР ШРИФТА В НАЗВАНИИ:', data.fontCase)
        createBriefItem('5. ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ, КОТОРЫЕ ДОЛЖНЫ ПРИСУТСТВОВАТЬ В ЛОГОТИПЕ:', data.slogan)
        
        // TODO в полях где есть возможность выбрать другое нужно сделать text input
        const groupStyleType = createElement('div', 'group-options__container')  
        createBriefItem('6. ТИП ЛОГОТИПА:', getTrueChecked(logoOptions), 'form-value__options', groupStyleType)
        createBriefItem('7. СТИЛЬ ЛОГОТИПА:', getTrueChecked(styleOptions), 'form-value__options', groupStyleType)        
        createBriefItem('8. ТИП ЗНАКА:', getTrueChecked(iconOptions), 'form-value__options', groupStyleType)
        content.appendChild(groupStyleType)

        const groupIconFont = createElement('div', 'group-options__container')
        createBriefItem('9. СТИЛЬ ОФОРМЛЕНИЯ ЗНАКА:', getTrueChecked(preferredStyleOptions), 'form-value__options', groupIconFont)
        createBriefItem('10. СТИЛЬ ШРИФТОВОГО РЕШЕНИЯ:', getTrueChecked(fontOptions), 'form-value__options', groupIconFont)
        content.appendChild(groupIconFont)

        createBriefItem('11. ЦВЕТОВОЕ РЕШЕНИЕ ЛОГОТИПА:', data.colors)
        createBriefItem('12. ХАРАКТЕРИСТИКА ЗНАКА:', data.patternLogo)
        createBriefItem('13. КЛЮЧЕВЫЕ СЛОВА:', data.keywords)
        createBriefItem('14. ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:', data.additionalInfo)

        

        
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

        
        // возвращает блок вывода в pdf в начало страницы
        // спасает от рассыпания pdf 
        // window.scrollTo(0, 0)
        title.scrollIntoView(top)
        //* вызов метода для сохранения в pdf
        html2pdf().set(opt).from(content).save()

        // TODO нельзя просто взять и не дождаться выполения печати в pdf (async)
        // wrapperForm.classList.add('show')
        // wrapperForm.classList.remove('hide')

        // wrapperContent.classList.remove('show')
        // wrapperContent.classList.add('hide')
        // content.innerHTML = ''
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
        } else {
            // TODO Здесь формируются блоки с Img 
            briefItem.appendChild(formValue)            
        }        
        
        briefItem.appendChild(itemFormValue)
        dadElement.appendChild(briefItem)
    }

    // TODO нет описания функции
    // TODO нужно выводить по два блока в одну строку
    function getTrueChecked(checkedList) {
        // const result = []
        const trueOptionsItem = createElement('div', 'container__to-pdf')
        for (option of checkedList) {
            if (option.checked) {
                const optionsItem = createElement('div', 'item__to-pdf')
                const elem = option.parentNode
                // TODO возникает проблема если внутри блока нет тегов img label
                const imgElem = elem.querySelector('img').cloneNode()
                const labelElem = elem.querySelector('label').cloneNode(true)                
                labelElem.classList = ''

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
                event.target.tagName !== 'INPUT'
                    ?   checkboxDad(event.target, targetClassName, inputClassName)
                    :   f = () => f                
            })
        }
    }

    // функция рекурсия в поиске родителя input и запуска вкл/выкл на input
    function checkboxDad(elem, targetClassName, inputClassName) {
        if (elem.className.includes(targetClassName)) {
            onOffChecked(elem, inputClassName)
        } else {
            checkboxDad(elem.parentNode, targetClassName, inputClassName)
        }
    }

    // вспомогательная функция запускается в checkboxDad 
    function onOffChecked (elem, inputClassName) {
        let elemInput = elem.querySelector(`.${inputClassName}`)
        elemInput.checked ? elemInput.checked = false : elemInput.checked = true
    }
    
    // навешивает событие click на блок targetClassName 
    // для переключения внутри radio/checkbox с классами inputClassName
    // function onOffCheckedList(targetClassName, inputClassName) {
    //     const elems = document.querySelectorAll(`.${targetClassName}`)
    //     for (item of elems) {
    //         item.addEventListener('click', (event) => {
    //             if (event.target.className.includes(targetClassName)) {
    //                 const elem = event.target
    //                 onOffChecked(elem, inputClassName)                    
    //             } else if (!event.target.className.includes(targetClassName) && !event.target.className.includes(inputClassName) && event.target.tagName !== 'IMG') {
    //                 const elem = event.target.parentNode
    //                 onOffChecked(elem, inputClassName)
    //             } else if (event.target.tagName === 'IMG') {
    //                 const divImg = event.target.parentNode
    //                 const elem = divImg.parentNode
    //                 onOffChecked(elem, inputClassName)
    //             }
    //         })
    //     }
    // }


}); /* DOMContentLoaded */







