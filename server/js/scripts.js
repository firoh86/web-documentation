// guarda los ultimos menús seleccionados para no repetir
let menuNoRepeat
// 
const menu = document.getElementById('menu')
addEventListener('load', () => {
    let xhr
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
    else xhr = new ActiveXObject("Microsoft.XMLHTTP")

    xhr.open('GET', '/getMenus')

    //al cargar la página recogemos del servidor para mostrar el menu y submenu de elementos de la documentacion
    xhr.addEventListener('load', (data) => {

        const menuItems = JSON.parse(data.target.response);

        const menuFragment = document.createDocumentFragment()
        // por cada elemento en la base de menuItem
        for (const menuItem of menuItems[0]) {
            const listItem = document.createElement('LI')
            listItem.dataset.id = menuItem.id
            listItem.classList.add('menu__item')
            const listItemSpan = document.createElement('SPAN')
            listItemSpan.textContent = menuItem.title
            listItemSpan.classList.add('menu__text')
            listItem.append(listItemSpan)
            const submenulistItem = document.createElement('UL')

            if (menuItems[0].indexOf(menuItem) == 0) {
                submenulistItem.classList.add('submenu--show')
            }
            submenulistItem.classList.add('menu', 'submenu')
            submenulistItem.dataset.id = menuItem.id

            listItem.append(submenulistItem)
            menuFragment.append(listItem)
            //por cada elemento de la base menu subitem
            for (const submenu of menuItems[1]) {
                if (submenu.menu_id == menuItem.id) {
                    const listItem = document.createElement('LI')
                    listItem.textContent = submenu.title
                    listItem.dataset.id = submenu.id
                    listItem.classList.add('submenu__item')
                    submenulistItem.append(listItem)
                }
            }

        }

        menu.append(menuFragment)
    })

    xhr.send()

})

menu.addEventListener('click', (e) => {

    let element

    const target = e.target
    //mover a los anclas
    navigateTarget(target)

    if (e.target.classList.contains('menu__item')) {
        element = e.target.children[1]
        getContent(element.dataset.id)
    } else if (e.target.classList.contains('menu__text') && !e.target.classList.contains('menu')) {
        element = e.target.nextElementSibling
        getContent(element.dataset.id)
    }
    else return

    if (!e.target.classList.contains('submenu__item')) {
        const submenus = Array.from(document.querySelectorAll('.submenu'))
        submenus.map(submenu => submenu.classList.remove('submenu--show'))

        const hijos = element.children.length
        const calculo = 26 * hijos
        document.documentElement.style.setProperty('--submenu-height', calculo + 'px')
        element.classList.add('submenu--show')
    }

})

const main = document.getElementById('main')
const getContent = (menuId) => {
    let xhr
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
    else xhr = new ActiveXObject("Microsoft.XMLHTTP")

    xhr.open('GET', `/getContent/${menuId}`)
    xhr.addEventListener('load', (data) => {
        const text = JSON.parse(data.target.response);
        main.innerHTML = (text[0].text)
        inyectaStyle()
    })
    xhr.send()
}

const inyectaStyle = () => {
    const elem = document.getElementById('inyeccion')
    if (elem) {
        elem.parentNode.removeChild(elem)
        console.log(elem + 'borrado');

        const inyeccion = document.createElement('script')
        inyeccion.src = 'js/prism.js'
        inyeccion.id = 'inyeccion'
        document.body.appendChild(inyeccion)
        console.log('creado');
    } else {
        const inyeccion = document.createElement('script')
        inyeccion.src = 'js/prism.js'
        inyeccion.id = 'inyeccion'
        document.body.appendChild(inyeccion)
        console.log('creado');
    }
}
const navigateTarget = (target) => {
    // console.log(target);
    if (target.classList.contains('submenu__item')) {
        const anclas = Array.from(main.querySelectorAll('h2'))
        const anclasFiltered = anclas.filter(h2 => h2.textContent.toLowerCase().startsWith(target.textContent.toLowerCase()))[0]
        scrollTo(0, anclasFiltered.offsetTop - 110)
    }
    else scrollTo(0, -110)

}

getContent(1)
