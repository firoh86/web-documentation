//inputs
const form = document.getElementById('form')
const title = document.getElementById('title')
const sectionTitle = document.getElementById('section-title')
const sectionParagraph = document.getElementById('section-paragraph')
const codeParagraph = document.getElementById('code-paragraph')
const preview = document.getElementById('preview')
// formulario botones
const titleButton = document.getElementById('title-button')
const sectionTitleButton = document.getElementById('section-title-button')
const sectionParagraphButton = document.getElementById('section-paragraph-button')
const codeParagraphButton = document.getElementById('code-paragraph-button')
const buttonInsert = document.getElementById('submitForm')

//constructor de pagina para subir a las bases de datos
const finalTitle = []
const sectionTitles = []
const completDocument = []



if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        // console.log('titulo final =' + finalTitle);
        // if (sectionTitles.length > 0) console.log('subtitulos de seccion =' + sectionTitles);
        // console.log('documento completo =' + completDocument);
    })
    titleButton.addEventListener('click', (e) => {

        preview.innerHTML = `<h1>${title.value}</h1>`
        completDocument[0] = `<h1>${title.value}</h1>`
        finalTitle[0] = `<h1>${title.value}</h1>`
        title.value = ''

    })
    sectionTitleButton.addEventListener('click', (e) => {
        preview.innerHTML += `<h2>${sectionTitle.value}</h2>`
        sectionTitles.push(`<h2>${sectionTitle.value}</h2>`)
        completDocument.push(`<h2>${sectionTitle.value}</h2>`)
        sectionTitle.value = ''
    })
    sectionParagraphButton.addEventListener('click', (e) => {
        preview.innerHTML += `<p>${sectionParagraph.value}</p>`
        completDocument.push(`<p>${sectionParagraph.value}</p>`)
        sectionParagraph.value = ''
    })

    codeParagraphButton.addEventListener('click', (e) => {
        preview.innerHTML += `<pre><code class='language-css'>${codeParagraph.value}</code></pre>`
        completDocument.push(`<pre><code class='language-css'>${codeParagraph.value}</code></pre>`)
        codeParagraph.value = ''
    })
    buttonInsert.addEventListener('click', (e) => {
        console.log('boton correcto');

        sendInfo(finalTitle, sectionTitles, completDocument)
    })

}


const sendInfo = (titles, sections, completDoc) => {


    /*     const data = {
            titles,
            sections,
            completDoc
        }
        console.log('llega');
        let xhr
        if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
        else xhr = new ActiveXObject("Microsoft.XMLHTTP")
    
        
        xhr.open('POST', '/insertContent', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xhr.send(JSON.stringify(data)) */

    console.log(JSON.stringify(titles));

    axios({
        method: 'POST',
        url: '/insertContent',
        params: {
            text: 'hola mundo'
            /* title: titles,
             section: sections,
             doc: completDoc  */
        }
    }).then(res => console.log(res.data))
        .catch(err => console.log(err))



}


