interface TagAttribute {
    [propName: string]: any;
}

export const createSvgElement = function (tagName: string, tagAttribute: TagAttribute) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.keys(tagAttribute).forEach((attr: string)=>{
        if(tagAttribute.hasOwnProperty(attr)){
            el.setAttribute(attr, tagAttribute[attr]);
        }
    });
    return el;
};

export const createCanvasAndContext = function (canvasAttribute: TagAttribute): ({canvas: Node, context: CanvasRenderingContext2D}) {
    // 可以不要{canvas: Node, context: CanvasRenderingContext2D}，ts可以推导出来，只是写在这里熟悉一下
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    Object.keys(canvasAttribute).forEach((attr: string)=>{
        if(canvasAttribute.hasOwnProperty(attr)){
            canvas.setAttribute(attr, canvasAttribute[attr]);
        }
    });
    return {
        canvas,
        context
    }
};
