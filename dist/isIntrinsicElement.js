"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.isIntrinsicElement=isIntrinsicElement;function isIntrinsicElement(element){var elements=["div","p","h1","h2","h3","a","main","header","footer","section","article","abbr","address","area","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","dl","dt","em","embed","fieldset","figcaption","figure","form","h4","h5","h6","head","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","map","mark","menu","menuitem","meta","meter","nav","noindex","noscript","object","ol","optgroup","option","output","param","picture","pre","progress","q","rp","rt","ruby","s","samp","slot","script","select","small","source","span","strong","style","sub","summary","sup","table","template","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","svg","animate","animateMotion","animateTransform","circle","clipPath","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","image","line","linearGradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","stop","switch","symbol","text","textPath","tspan","use","view"];return elements.includes(element)}