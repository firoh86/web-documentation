"use strict";

//inputs
var form = document.getElementById('form');
var title = document.getElementById('title');
var sectionTitle = document.getElementById('section-title');
var sectionParagraph = document.getElementById('section-paragraph');
var codeParagraph = document.getElementById('code-paragraph');
var preview = document.getElementById('preview'); // formulario botones

var titleButton = document.getElementById('title-button');
var sectionTitleButton = document.getElementById('section-title-button');
var sectionParagraphButton = document.getElementById('section-paragraph-button');
var codeParagraphButton = document.getElementById('code-paragraph-button');
var buttonInsert = document.getElementById('submitForm'); //constructor de pagina para subir a las bases de datos

var finalTitle = [];
var sectionTitles = [];
var completDocument = [];

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // console.log('titulo final =' + finalTitle);
    // if (sectionTitles.length > 0) console.log('subtitulos de seccion =' + sectionTitles);
    // console.log('documento completo =' + completDocument);
  });
  titleButton.addEventListener('click', function (e) {
    preview.innerHTML = "<h1>".concat(title.value, "</h1>");
    completDocument[0] = "<h1>".concat(title.value, "</h1>");
    finalTitle[0] = "<h1>".concat(title.value, "</h1>");
    title.value = '';
  });
  sectionTitleButton.addEventListener('click', function (e) {
    preview.innerHTML += "<h2>".concat(sectionTitle.value, "</h2>");
    sectionTitles.push("<h2>".concat(sectionTitle.value, "</h2>"));
    completDocument.push("<h2>".concat(sectionTitle.value, "</h2>"));
    sectionTitle.value = '';
  });
  sectionParagraphButton.addEventListener('click', function (e) {
    preview.innerHTML += "<p>".concat(sectionParagraph.value, "</p>");
    completDocument.push("<p>".concat(sectionParagraph.value, "</p>"));
    sectionParagraph.value = '';
  });
  codeParagraphButton.addEventListener('click', function (e) {
    preview.innerHTML += "<pre><code class='language-css'>".concat(codeParagraph.value, "</code></pre>");
    completDocument.push("<pre><code class='language-css'>".concat(codeParagraph.value, "</code></pre>"));
    codeParagraph.value = '';
  });
  buttonInsert.addEventListener('click', function (e) {
    sendInfo(finalTitle, sectionTitles, completDocument);
  });
}

var sendInfo = function sendInfo(titles, sections, completDoc) {
  fetch('/insertContent', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titles: titles,
      sections: sections,
      completDoc: completDoc
    })
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    return console.log(data);
  });
};
"use strict";

// guarda los ultimos menús seleccionados para no repetir
var menuNoRepeat;
var menu = document.getElementById('menu');

if (menu) {
  addEventListener('load', function () {
    var xhr;
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();else xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('GET', '/getMenus'); //al cargar la página recogemos del servidor para mostrar el menu y submenu de elementos de la documentacion

    xhr.addEventListener('load', function (data) {
      var menuItems = JSON.parse(data.target.response);
      var menuFragment = document.createDocumentFragment(); // por cada elemento en la base de menuItem

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = menuItems[0][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var menuItem = _step.value;
          var listItem = document.createElement('LI');
          listItem.dataset.id = menuItem.id;
          listItem.classList.add('menu__item');
          var listItemSpan = document.createElement('SPAN');
          listItemSpan.textContent = menuItem.title;
          listItemSpan.classList.add('menu__text');
          listItem.append(listItemSpan);
          var submenulistItem = document.createElement('UL');

          if (menuItems[0].indexOf(menuItem) == 0) {
            submenulistItem.classList.add('submenu--show');
          }

          submenulistItem.classList.add('menu', 'submenu');
          submenulistItem.dataset.id = menuItem.id;
          listItem.append(submenulistItem);
          menuFragment.append(listItem); //por cada elemento de la base menu subitem

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = menuItems[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var submenu = _step2.value;

              if (submenu.menu_id == menuItem.id) {
                var _listItem = document.createElement('LI');

                _listItem.textContent = submenu.title;
                _listItem.dataset.id = submenu.id;

                _listItem.classList.add('submenu__item');

                submenulistItem.append(_listItem);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      menu.append(menuFragment);
    });
    xhr.send();
  });
  menu.addEventListener('click', function (e) {
    var element;
    var target = e.target; //mover a los anclas

    navigateTarget(target);

    if (e.target.classList.contains('menu__item')) {
      element = e.target.children[1];
      getContent(element.dataset.id);
    } else if (e.target.classList.contains('menu__text') && !e.target.classList.contains('menu')) {
      element = e.target.nextElementSibling;
      getContent(element.dataset.id);
    } else return;

    if (!e.target.classList.contains('submenu__item')) {
      var submenus = Array.from(document.querySelectorAll('.submenu'));
      submenus.map(function (submenu) {
        return submenu.classList.remove('submenu--show');
      });
      var hijos = element.children.length;
      var calculo = 26 * hijos;
      document.documentElement.style.setProperty('--submenu-height', calculo + 'px');
      element.classList.add('submenu--show');
    }
  });
  var main = document.getElementById('main');

  var getContent = function getContent(menuId) {
    var xhr;
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();else xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('GET', "/getContent/".concat(menuId));
    xhr.addEventListener('load', function (data) {
      var text = JSON.parse(data.target.response);
      main.innerHTML = text[0].text;
      inyectaStyle();
    });
    xhr.send();
  };

  var inyectaStyle = function inyectaStyle() {
    // pendiente de revision
    var elem = document.getElementById('inyeccion');

    if (elem) {
      elem.parentNode.removeChild(elem);
      var inyeccion = document.createElement('script');
      inyeccion.src = 'js/prism.js';
      inyeccion.id = 'inyeccion';
      document.body.appendChild(inyeccion);
    } else {
      var _inyeccion = document.createElement('script');

      _inyeccion.src = 'js/prism.js';
      _inyeccion.id = 'inyeccion';
      document.body.appendChild(_inyeccion);
    }
  };

  var navigateTarget = function navigateTarget(target) {
    if (target.classList.contains('submenu__item')) {
      var anclas = Array.from(main.querySelectorAll('h2'));
      var anclasFiltered = anclas.filter(function (h2) {
        return h2.textContent.toLowerCase().startsWith(target.textContent.toLowerCase());
      })[0];
      scrollTo(0, anclasFiltered.offsetTop - 110);
    } else scrollTo(0, -110);
  };

  getContent(1);
}