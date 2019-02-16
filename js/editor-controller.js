'use strict';
var gCtx
var gNumOfTxtLines = 2
var gInFocusTxtId = '1'

function initEditor(meme) {
    var elTxts = document.querySelectorAll('.meme-txt')
    elTxts.forEach(txt => txt.parentElement.classList.remove('hidden'))
    var imgSrc = meme.src
    var txts = document.querySelectorAll('.meme-txt')
    txts.forEach((txt) => txt.innerText = '  ')
    resetCanvasState()
    initCanvas(imgSrc)
    document.querySelector('.meme-txt.txt-1').focus()
}

function setInFocusTxtId(txtContainer) {
    gInFocusTxtId = txtContainer.firstElementChild.dataset.id
}

function initCanvas(src = 'img/meme-imgs/patrick.jpg') {
    setImg(src)
    var canvas = document.querySelector('#meme-canvas')
    gCtx = canvas.getContext('2d')
    drawImg()
    resizeCanvas(canvas)
}


function drawImg() {
    var imgSrc = getImgSrc()
    document.querySelector('.canvas-img').src = imgSrc
    var elImg = document.querySelector('.canvas-img')
    var canvas = document.querySelector('#meme-canvas')
    elImg.onload = function () {
        gCtx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    }
}


function resizeCanvas(canvas) {
    var elCanvasContainer = document.querySelector('.canvas-container')
    setCanvasContainerSize(elCanvasContainer)
    setRelativeHeights()
    canvas.width = elCanvasContainer.offsetWidth
    canvas.height = elCanvasContainer.offsetHeight
}

function setCanvasContainerSize(elCanvasContainer) {
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    //we want to make the img as big as we can, will still in ratio
    //since it's canvas we don't have features like object-fit
    var ratio = (imgObj.height < imgObj.width) ? imgObj.height / imgObj.width : imgObj.width / imgObj.height
    elCanvasContainer.style.height = `${elCanvasContainer.clientWidth * ratio}px`
}

function setRelativeHeights() {
    var elCanvasContainer = document.querySelector('.canvas-container')
    var containerHeight = elCanvasContainer.offsetHeight
    document.querySelector('.meme-txt.txt-2').style.top = (0.85 * containerHeight) + 'px' //need to put this line in a better place
    document.querySelector('.txt-2.delete').style.top = (0.85 * containerHeight) + 'px' //need to put this line in a better place
    document.querySelector('.flex-container').style.height = (containerHeight + 40) + 'px'
}


function renderTxt(txtId, txt = null) {
    if (txtId === '1') var elTextPlace = document.querySelector('.txt-1')
    else var elTextPlace = document.querySelector('.txt-2')
    if (txt) elTextPlace.innerText = txt;
    elTextPlace.style.color = getTxtSettings(txtId, 'color');
    elTextPlace.style.font = `${getTxtSettings(txtId, 'size')}/100% ${getTxtSettings(txtId, 'font')}`;
    elTextPlace.style.height = getTxtSettings(txtId, 'size');
    elTextPlace.style.textAlign = getTxtSettings(txtId, 'align');
}


function onEndTyping(elTxtInput) {
    var txtId = elTxtInput.dataset.id
    var txt = elTxtInput.innerText
    setTxtSettings(txtId, 'content', txt)
}

function onTextEdit(elTxtInput) {
    document.querySelector('.editable-txt').style.border = 'none'
    var txtId = elTxtInput.dataset.id
    renderTxt(txtId)
}

function onDisplayChange(elTxtDisplay) {
    var changeType = elTxtDisplay.dataset.type
    var ChangeVal = elTxtDisplay.value
    setTxtSettings(gInFocusTxtId, changeType, ChangeVal)
    submitChange(gInFocusTxtId)
}

function submitChange(txtId) {
    var txt = getTxt(txtId)
    renderTxt(txtId, txt)
}

function getTxt(txtId) {
    return getTxtSettings(txtId, 'content')
}

function downloadImg(elLink) {
    addCanvasTxt()
    var canvas = document.querySelector('#meme-canvas')
    var imgContent = canvas.toDataURL('image/png');
    elLink.href = imgContent
    gCtx.clearRect(0, 0, canvas.width, canvas.height)
    drawImg()
}

function resizeCanvasForDownload(canvas) {
    var imgSrc = getImgSrc()
    var imgObj = new Image();
    imgObj.src = imgSrc;
    canvas.width = imgObj.width
    canvas.height = imgObj.height
}

function addCanvasTxt() {
    var elTxts = document.querySelectorAll('.meme-txt')
    for (let i = 0; i < gNumOfTxtLines; i++) {
        var txtId = (i + 1) + ''
        var txt = getTxt(txtId)
        var font = `${getTxtSettings(txtId, 'size')} ${getTxtSettings(txtId, 'font')}`
        gCtx.font = font
        gCtx.fillStyle = getTxtSettings(txtId, 'color')
        gCtx.shadowColor = '#000000'
        gCtx.shadowBlur = 1;
        gCtx.textBaseline = 'bottom'
        var xLocation = elTxts[i].offsetLeft
        var yLocation = elTxts[i].offsetTop + elTxts[i].offsetHeight - 55 //padding
        if (getTxtSettings(txtId, 'align') === 'center') xLocation += elTxts[i].offsetWidth / 2 - getTxtWidth(txt, font) / 2
        else if (getTxtSettings(txtId, 'align') === 'right') xLocation += elTxts[i].offsetWidth - getTxtWidth(txt, font)
        gCtx.fillText(txt, xLocation, yLocation);
        console.log(gCtx);

    }
}

function onDelete(elTxt) {
    
    elTxt.parentElement.classList.add('hidden')
    setTxtSettings(elTxt.dataset.id, 'content')
}

function getTxtWidth(txt, font) {
    var canvas = document.querySelector('#help-canvas')
    var ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.fillText(txt, 0, 0);
    return ctx.measureText(txt).width
}

function moveTxt(direction) {
    var txt = document.querySelector(`p[data-id="${gInFocusTxtId}"]`)
    var deleteBtn = document.querySelector(`.delete[data-id="${gInFocusTxtId}"]`)
    switch (direction) {
        case 'left':
            var currPos = txt.offsetLeft
            txt.style.left = currPos - 4 + 'px'
            deleteBtn.style.left = currPos - 4 + 'px'
            break
        case 'right':
            var currPos = txt.offsetLeft
            txt.style.left = currPos + 4 + 'px'
            deleteBtn.style.left = currPos -+4 + 'px'
            break
        case 'up':
            var currPos = txt.offsetTop
            txt.style.top = currPos - 4 + 'px'
            deleteBtn.style.top = currPos - 4 + 'px'
            break
        case 'down':
            var currPos = txt.offsetTop
            txt.style.top = currPos + 4 + 'px'
            deleteBtn.style.top = currPos + 4 + 'px'
            break
    }
}








//Hadas:
//line on img instead of input - done.
// reset input text when new pic - done
// move text
//Align left, right, center - done
//delete line -done
//arrange functions in logical order

// move control panel in editor to side in desktop - Done
// css control panel - Done
//TODO: arrange functions in logical order



// Yanai
// navigation + hide show
// add share
// shadow 
// render fonts to select from js




//change font size to range
// add painter




function onBackToGallery() {
    document.querySelector('section.editor').classList.add('hide');
    document.querySelector('section.gallery').classList.remove('hide');
}