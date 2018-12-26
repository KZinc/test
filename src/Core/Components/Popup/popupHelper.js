import React from 'react'
import ReactDOM from 'react-dom'

function getMaxZIndex(){
    if(!window.maxZIndex){
        window.maxZIndex = 100;
    }else{
        window.maxZIndex++;
    }
    return window.maxZIndex;
}

//Открывает попап. Если подан e.target тогда открывает попап по краю расположения элемента, иначе по координатам клика мышки
//displayOptions опции для открытия попапа
//Доступны: animate(по умолчанию true)/offsetLeft/offsetTop/shiftMethod/disableZIndex/currentZIndex/center/autoClose(по умолчанию true)/updatePosition(по умолчанию true)
export function openPopup(popupType, popupProps = {}, popupContent, eventOrTarget, displayOptions = {}) {
    let id = Date.now() + Math.random().toFixed(5);
    popupProps.id = id;
    //Создание контейнера для попапа
    let reactPopupContainer = document.createElement("div");
    reactPopupContainer.id = 'reactPopupContainer-' + id;
    reactPopupContainer.style.zIndex = getMaxZIndex();
    reactPopupContainer.style.position = 'fixed';
    reactPopupContainer.setAttribute('popupType', popupType.name);
    //Установка его позиции
    let target;
    let targetRect = {};
    let offsetLeft = displayOptions.offsetLeft || 0;
    let offsetTop = displayOptions.offsetTop || 0;
    let top, left;
    if (eventOrTarget.nodeType === 1) {
        //Подана нода
        target = eventOrTarget;
        targetRect = target.getBoundingClientRect();
        top = targetRect.top + (offsetTop || targetRect.height);
        left = targetRect.left + offsetLeft;
    } else {
        //Подано событие
        target = eventOrTarget.target;
        top = eventOrTarget.clientY + offsetTop;
        left = eventOrTarget.clientX + offsetLeft;
    }
    reactPopupContainer.style.top = top + 'px';
    reactPopupContainer.style.left = left + 'px';

    document.body.appendChild(reactPopupContainer);
    ReactDOM.render(
        React.createElement(popupType, popupProps, popupContent),
        reactPopupContainer,
    );

    if (displayOptions['center']) {
        updatePopupToCenterPosition(id, {top: offsetTop, left: offsetLeft});
        if (displayOptions.animate || displayOptions.animate === undefined) _animateDisplayPopup(reactPopupContainer);
    } else {
        let shiftOrOffset = {};
        if (displayOptions.shiftMethod) {
            shiftOrOffset = true;
        } else { //Если не используется offset подготавливаем сдвиги на края элемента target
            shiftOrOffset.top = offsetTop ? 0 : targetRect.height;
            shiftOrOffset.left = offsetLeft ? 0 : targetRect.width;
        }

        if (displayOptions['updatePosition'] || displayOptions['updatePosition'] === undefined) {
            if (displayOptions.animate || displayOptions.animate === undefined) {
                _updatePopupPositionWithAnimation(id, shiftOrOffset);
            } else {
                updatePopupPosition(id, shiftOrOffset);
            }
        }
    }


    _updatePopupParents(id, target);

    if (displayOptions['autoClose'] || displayOptions['autoClose'] === undefined) {
        _addAutoCloseEvent(id);
    } else {
        _addAutoFocusEvent(id);
    }

    return id;
}

//Обновление позиции попапа, чтобы всегда влезал на экран
//По умолчанию обновление позиции происходит инвертированно от левого верхнего угла попапа
//shiftOrOffset - опционально: true || {top, left}
//Если === true тогда используется обновление позиции сдвигом,
//иначе применяется offset, например, чтоб при обновлении позиции не перекрыть target попапом
export function updatePopupPosition(id, shiftOrOffset = {}) {
    let reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return;
    let popupPosition = reactPopupContainer.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const shiftMethod = (shiftOrOffset === true);
    const offsetLeft = shiftOrOffset.left || 0;
    const offsetTop = shiftOrOffset.top || 0;
    let result = {};
    let correctValue = 0;

    if (windowWidth < (popupPosition.left + popupPosition.width)) {
        if (shiftMethod) {
            correctValue = windowWidth - (popupPosition.width + 5);
        } else {
            correctValue = (popupPosition.left - popupPosition.width) + offsetLeft;
        }
        if (correctValue < 0) correctValue = 0;
        reactPopupContainer.style.left = correctValue + 'px';
        result.width = true;
    }
    if (windowHeight < (popupPosition.top + popupPosition.height)) {
        if (shiftMethod) {
            correctValue = windowHeight - (popupPosition.height + 5);
        } else {
            correctValue = (popupPosition.top - popupPosition.height) - offsetTop;
        }
        if (correctValue < 0) correctValue = 0;
        reactPopupContainer.style.top = correctValue + 'px';
        result.height = true;
    }

    result.shiftMethod = shiftMethod;
    return result;
}

//Обновление позиции попапа, чтобы он был по центру
//offset - опционально: {top, left}
export function updatePopupToCenterPosition(id, offset = {}) {
    let reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return;
    let popupPosition = reactPopupContainer.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const offsetLeft = offset.left || 0;
    const offsetTop = offset.top || 0;
    let result = {};
    let correctValue;

    correctValue = (windowWidth - popupPosition.width) / 2 + offsetLeft;
    if (correctValue < 0) correctValue = 0;
    if ((correctValue + popupPosition.width) > windowWidth) correctValue = windowWidth - popupPosition.width;
    reactPopupContainer.style.left = correctValue + 'px';
    result.width = true;

    correctValue = (windowHeight - popupPosition.height) / 2 - offsetTop;
    if (correctValue < 0) correctValue = 0;
    if ((correctValue + popupPosition.height) > windowHeight) correctValue = windowHeight - popupPosition.height;
    reactPopupContainer.style.top = correctValue + 'px';
    result.height = true;

    return result;
}

function updateNodePath(path,target){
    if(target){
        path.push(target);
        updateNodePath(path, target.parentNode)
    }
}

//Обновляет массив где хранятся связи попапа и его родителей-попапов
function _updatePopupParents(id, target) {
    let path = [];
    updateNodePath(path, target);

    if (!window.popupParents) window.popupParents = {};
    if (!window.popupParents[id]) window.popupParents[id] = [];

    for (let i = 0; i < path.length; i++) {
        if (path[i].id && path[i].id.startsWith('reactPopupContainer-')) {
            let parentId = path[i].id.split('-')[1];
            let parentChildren = window.popupParents[parentId];
            window.popupParents[id] = window.popupParents[id].concat(parentChildren);
            window.popupParents[id].push(parentId);
            break;
        }
    }
}

//Возвращает div в который вложен реакт-попап
export function getPopupContainer(id) {
    return document.getElementById('reactPopupContainer-' + id);
}

//Удаляет попап по id
export function removePopup(id) {
    if (!id) return false;
    _removeAutoCloseEvent(id);
    _removeAutoFocusEvent(id);
    let reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return false;
    ReactDOM.unmountComponentAtNode(reactPopupContainer);
    delete window.popupParents[id];
    document.body.removeChild(reactPopupContainer);
}

//Обработчик события клика по document.body
function _handlerClose(id, e) {
    let path = [];
    updateNodePath(path, e.target);
    let reactPopupContainer = getPopupContainer(id);

    for (let i = 0; i < path.length; i++) {
        //Если в пути встречается сам попап, тогда ничего не делаем, так как клик произошел во внутреннем элементе
        //Проверка произошел ли клик в дочерний элемент закрываемого попапа
        if (path[i] === reactPopupContainer) {
            return;
        }

        //Если в пути встречается другой попап, тогда проверяем ребенок ли он текущего попапа. Если ребенок, тогда ничего не делаем.
        //Проверка произошел ли клик в дочерний попап закрываемого попапа
        if (path[i].id && path[i].id.startsWith('reactPopupContainer-')) {
            let targetId = path[i].id.split('-')[1]; //в пути до кликнутого элемента есть попап
            let parents = window.popupParents[targetId]; //получаем всех родителей для попапа в который кликнули
            if (parents.indexOf('' + id) !== -1) { //если текущий закрываемый попап это родитель кликнутого,
                // тогда ничего не делаем
                return;
            }
        }
    }

    removePopup(id);
}

//Закрыть все попапы подходящие под тип popupType
//Если подан excludeID, тогда попап с таким ID не будет закрыт
export function closePopupsByType(popupType, excludeID) {
    if (!window.popupParents) return false;
    let popup, popupID;
    for (popupID in window.popupParents) {
        if (!window.popupParents.hasOwnProperty(popupID)) continue;
        if (+popupID === +excludeID) continue;
        popup = getPopupContainer(popupID);
        if (popupType.name === popup.getAttribute('popupType')) removePopup(popupID);
    }
}

//Анимация при открытии попапа. Увеличение размера попапа из точки события. По умолчанию слева-направо, сверху-вниз.
//updatePositionResult {width, height} инвертирует анимацию для заданых направлений
function _animateDisplayPopup(reactPopupContainer, updatePositionResult = {}) {

    const transformOriginWidth = !updatePositionResult.width ? 'left' : 'right';
    const transformOriginHeight = !updatePositionResult.height ? ' top' : ' bottom';
    reactPopupContainer.style.transformOrigin = transformOriginWidth + transformOriginHeight;
    reactPopupContainer.style.transform = 'scale(0.1)';

    //Задержка нужна, чтоб сработал transition
    setTimeout(() => {
        if (!reactPopupContainer) return;
        reactPopupContainer.style.transition = 'transform 0.3s, left 0.2s, top 0.2s'; //left 0.2s, top 0.2s для shiftMethod
        reactPopupContainer.style.transform = 'scale(1)';
    }, 1);

    //Чистим следы анимации
    setTimeout(() => {
        if (!reactPopupContainer) return;
        reactPopupContainer.style.transition = '';
        reactPopupContainer.style.transform = '';
        reactPopupContainer.style.transformOrigin = '';
    }, 500);
}

//Обновление позиции попапа с анимацией открытия
function _updatePopupPositionWithAnimation(id, shiftOrOffset) {
    const reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return;
    const shiftMethod = (shiftOrOffset === true);

    if (shiftMethod) {
        _animateDisplayPopup(reactPopupContainer);
        setTimeout(() => {
            updatePopupPosition(id, shiftMethod);
        }, 330);
    } else {
        const updatePositionResult = updatePopupPosition(id, shiftOrOffset);
        _animateDisplayPopup(reactPopupContainer, updatePositionResult);
    }
}

//Навешивание события автоматического закрытия на функцию _handlerClose при клике мимо попапа
function _addAutoCloseEvent(id) {
    let autoClose = _handlerClose.bind(this, id);
    document.body.addEventListener('mousedown', autoClose, true);

    if (!window.popupAutoCloseEvents) window.popupAutoCloseEvents = {};
    window.popupAutoCloseEvents[id] = autoClose;
}

//Удаление события автоматического закрытия при клике мимо попапа
function _removeAutoCloseEvent(id) {
    if (!window.popupAutoCloseEvents || !window.popupAutoCloseEvents[id]) return false;
    let autoClose = window.popupAutoCloseEvents[id];
    document.body.removeEventListener('mousedown', autoClose, true);
    delete window.popupAutoCloseEvents[id];
}

//Навешивание события для того, чтоб попап был в фокусе (выше всех) при клике в него
function _addAutoFocusEvent(id) {
    const reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return;

    const autoFocus = () => {
        reactPopupContainer.style.zIndex = getMaxZIndex();
    };

    reactPopupContainer.addEventListener('mousedown', autoFocus, true);

    if (!window.popupAutoFocusEvents) window.popupAutoFocusEvents = {};
    window.popupAutoFocusEvents[id] = autoFocus;
}

//Удаление события фокуса (выше всех) при клике в попап
function _removeAutoFocusEvent(id) {
    const reactPopupContainer = getPopupContainer(id);
    if (!reactPopupContainer) return;

    if (!window.popupAutoFocusEvents || !window.popupAutoFocusEvents[id]) return false;
    let autoFocus = window.popupAutoFocusEvents[id];
    reactPopupContainer.removeEventListener('mousedown', autoFocus, true);
    delete window.popupAutoFocusEvents[id];
}

/**
 * Переключение displayOptions.autoClose после открытия попапа
 * @param id
 * @param autoClose
 */
export function changeDisplayOptionsAutoClose(id, autoClose) {
    _removeAutoCloseEvent(id);
    if (autoClose === true) {
        _addAutoCloseEvent(id);
    }
}


