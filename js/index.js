const url='..//Docs/42-Silicon-Valley-Student-Booklet.pdf';

let pdfDoc=null,
    pageNum=1,
    pageIsRendering=false,
    pageNumIsPending=null;

const scale=1.5,
    canvas=document.querySelector('#pdf-render'),
    ctx=canvas.getContext('2d');
//Render the page
const renderPage=num=>{
    pageIsRendering=true;

    //Get the page
    pdfDoc.getPage(num).then(page=>{
    //Set the scale
    const viewport=page.getViewport({scale});
    canvas.height=viewport.height;
    canvas.width=viewport.width;

    const renderCtx={
        canvasContext:ctx,
        viewport
    };
    page.render(renderCtx).promise.then(()=>{
        pageIsRendering=false;

        if(pageNumIsPending !==null){
           renderPage(pageNumIsPending) ;
           pageNumIsPending=null;
        }
    });
    //outputting the current page
    document.querySelector('#page-num').textContent=num;
    });
};
//checking for the pages rendering
const queueRenderPage=num=>{
    if(pageIsRendering){
        pageNumIsPending=num;
    }else{
        renderPage(num);
    }
};
//show previous page
const showprevPage=()=>{
    if(pageNum <=1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};
//show Next page
const showNextPage=()=>{
    if(pageNum >=pdfDoc.numPages ){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};
//Getting the document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
}).catch(err=>{
    //Display error
    const div =document.createElement('div');
    div.className='error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    //Remove the top bar;
    document.querySelector('.top-bar').style.display='none';
})
//button event
document.querySelector('#prev-page').addEventListener('click',showprevPage);
document.querySelector('#Next-page').addEventListener('click',showNextPage);
