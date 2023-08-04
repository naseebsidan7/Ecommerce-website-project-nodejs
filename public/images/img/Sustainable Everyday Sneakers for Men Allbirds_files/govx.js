(()=>{"use strict";const e=1,t=2,r=3,a=4,o=5,n=e=>{var t=e.parentNode&&e.parentNode.children;if(!(t&&t.length>0))return!1;if(e.className!==t[1].className)return!1;var r=[{element:t[0],dimension:"bottom"},{element:e,dimension:"height"}];r.forEach((function(e){var t=((e,t)=>{if(!e)return null;var r=e.getAttribute("style");if(!r)return null;var a=new RegExp(t+"[ ]*:[ ]*\\d+\\.{0,1}\\d*px"),o=r.match(a);return o&&o[0]?{regExp:a,style:r,value:Number(o[0].replace(/\D/g,""))}:null})(e.element,e.dimension);t&&t.value>0&&(e.newStyle=t.style.replace(t.regExp,e.dimension+":"+(t.value+80)+"px"))}));var a=r.filter((function(e){return!!e.newStyle}));if(r.length!==a.length)return!1;r.forEach((function(e){e.element.setAttribute("style",e.newStyle)}))},i=e=>{var t=e&&e.children&&e.children[0];t&&t.setAttribute("style","max-height: calc(100vh - 290px)")},s=(n,i)=>{let s=n?n.split("?"):[],c=(s.length>1?s[1].split("&"):[]).map((e=>{let t=e.split("=");return{key:t[0],value:t[1]}})).find((e=>"utm_campaign"===e.key));switch(c&&c.value){case"offer_button":return"/cart"===i?e:t;case"cart_drawer":return r;case"custom_link":return a;case"custom_page":return o;default:return null}},c=({className:e,dataGovXId:t,doc:r,innerHTML:a,type:o})=>{var n=r.createElement("i");return n.innerHTML=a||"",n.className=e||"",n.setAttribute(t,o),n},u=(a,o,s,u,l)=>{var p=s&&s.settings&&s.settings.find((function(e){return e.widgetType===o.widgetType}));if(!p)return!1;const{enabled:d,alignment:h}=p;if(!d)return!1;var m=(({doc:a,selector:o,widgetType:n})=>{if(o){var i=a.querySelector(o);if(i)return{element:i,selector:o}}else{var s=(a=>{switch(a){case e:return(n=[]).push(".cart "+(o='form[action="/cart"]')+" .cart__checkoutContainer"),n.push(".cart_top .cart_tbl "+o+" .cart_btn"),n.push(".cart-section "+o+" .offset-by-one"),n.push(".cart-section "+o),n.push(".content-area "+o+" .cart-tools"),n.push("#shopping-cart "+o+" #basket-right .cart-buttons"),n.push("#shopping-cart "+o+" #basket-right"),n.push("#shopping-cart "+o),n.push(o+" .bottompad .cart-options"),n.push("#shopify-section-cart .page-wrapper aside.cart-totals"),n.push("main .cart-wrapper__inner .container .cart-recap .card__section"),n.push(o+"#CartForm .cart-info-container"),n.push(o+" .grid--right div.cart__checkout"),n.push(o+" .cart__meta--desktop div.button-wrapper"),n.push(o+" .cart__meta--mobile div.button-wrapper"),n.push("main "+o),n.push(".main-content "+o+" .cart-footer div.cart-totals"),n.push(".main-content "+o),n.push('[role="main"] '+o),n.push(".cart "+o),n.push(".main "+o),n.push(".bodyWrap #Cart .checkout-buttons"),n;case t:return(()=>{var e=[];return e.push(".ajaxcart .cart"),e.push(".nav-dialog-inner-cart .modal-cart-form"),e.push(".header-minicart-content"),e.push("#ajaxifyCart form"),e.push("#Cart.open .checkout-buttons"),e.push(".cart_menu form"),e})();case r:return(()=>{var e=[];return e.push("form.cart .ajaxcart__footer"),e.push("form.cart .drawer__footer"),e.push(".sticky .header-cart"),e.push(".product__add__drawer .product__add__buttons"),e.push('form[action="/checkout"] .miniCart__details'),e.push(".cart-popover .buttons-wrap"),e.push(".cart-mini-footer"),e.push(".off-canvas--right-sidebar .cart--totals"),e.push(".header-cart .cart-summary"),e.push("#cart-summary .cart-summary-subtotal"),e.push("form.cart.ajaxcart .more"),e.push(".quick-cart footer"),e.push(".cart-popup-wrapper .cart-popup"),e.push(".cart-preview"),e.push(".atc-banner--cart"),e.push(".cart-drawer-form .slide-checkout-buttons"),e.push(".product__buy .product__form-status"),e.push(".header .mini-cart .mini-cart__recap"),e.push(".header .mini-cart"),e.push(".product-menu-slideout"),e.push(".mini-cart__footer form"),e.push(".sidebar__cart form"),e.push("#cart.mm-menu li:last-child"),e.push(".cart-drawer__footer-container"),e.push("form .Drawer__Footer"),e.push(".cart-mini form .cart-footer"),e.push(".cart_notification_content"),e.push("#site-cart-form-sidebar .cart-out"),e.push(".cart-summary-overlay__column-subtotal"),e.push("#shopify-section-header .mini-cart__buttons"),e.push(".ajaxified-cart-feedback.success"),e.push("form.drawer__contents .drawer__footer"),e})();default:return[]}var o,n})(n),c=((e,t)=>{for(var r=0;r<t.length;r++){var a=t[r],o=e.querySelector(t[r]);if(o)return{element:o,selector:a}}return null})(a,s);if(c)return{element:c.element,selector:c.selector}}return null})({doc:a,selector:p.selector,widgetType:o.widgetType});const{element:f,selector:g}=m||{};if(!f||!g)return!1;var v=((e,t,r,a,o,n,i)=>{if(!o)return!1;var s=(e=>{switch(e){case".header .mini-cart":case"#cart.mm-menu li:last-child":return!1}return!0})(a);if(s&&o.clientWidth<1)return!1;var u=(({button:e,dataGovXId:t})=>{var r=[];r.push(`.${e.full.className}`),r.push(`.${e.slim.className}`),r.push(`[${t}]`);for(var a='img[src="https://i',o=".govx.net/images/cdn/govxid-shopify-iapp-icon",n='.jpg"]',i=1;i<6;i++)r.push(`${a}${i}${o}${n}`),r.push(`${a}${i}${o}-50x50${n}`);return r})({button:e,dataGovXId:t});if(u.filter((function(e){return o.querySelector(e)})).length>0)return!1;var l=n===e.slim.type?e.slim.innerHTML:e.full.innerHTML,p=c({dataGovXId:t,doc:r,innerHTML:l,type:n}),d=(({alignment:e,button:t,doc:r,checkWidth:a,child:o,parent:n,type:i})=>{var s=[];return s.push(i===t.slim.type?t.slim.className:t.full.className),s.push(e?`govx-${e}`:""),s.push(n.clientWidth<300?"govx-mini":n.clientWidth<350?"govx-min":n.clientWidth>350?"govx-max":""),s.push(!a||n.clientWidth===r.body.clientWidth&&r.body.clientWidth===o.clientWidth?"govx-sides":""),s.filter((e=>!!e)).join(" ")})({alignment:i,button:e,doc:r,checkWidth:s,child:p,parent:o,type:n});return p.className=d,o.appendChild(p),!0})(u,l,a,g,f,o.button,h);if(!v)return!1;var y=((e,t)=>e===r?(e=>{switch(e){case"form.cart .ajaxcart__footer":case"form.cart .drawer__footer":return n;case".sticky .header-cart":return i}return null})(t):null)(o.widgetType,g);return"function"==typeof y&&y(f),v};function l(e,t,r,a,o,n){var i=e&&e.href||e;t=t||450,r=r||700,o=o||window;var s=(a=a||document).documentElement,c=s.clientWidth,u=s.clientHeight,l=o.innerWidth,p=o.innerHeight,d=o.screenLeft,h=o.screenTop,m=null!=d?d:o.screenX,f=null!=h?h:o.screenY,g=(l||c||screen.width)/2-t/2+m,v=(p||u||screen.height)/2-r/2+f,y=o.open(i,"GovX ID Authorization","width="+t+",height="+r+",top="+v+",left="+g);return n&&(n.pop=y),!1}const p=e=>`a[href^='${e}/shopify/verify']`,d=e=>`button[data-govx-href^='${e}/shopify/verify']`,h=({cta:e,ctaPopup:t})=>{if(!e||!e.dataset)return;let r="time";if(Number(e.dataset[r])>0);else{let a=(new Date).getTime();e.dataset[r]=a;let o=e.href||e.dataset.govxHref;e.href&&(e.target="popup"),e.onclick=()=>t(o)}},m=({doc:e,src:t})=>{var r=e.createElement("script");r.src=t,e.getElementsByTagName("head")[0].appendChild(r)},f=(a,o)=>{const{authorizationBaseUri:n,layout:i,css:c,dataGovXId:f,govxId:g,widgets:v}=o;let y=i;return(({doc:e,css:t,govxId:r,widgets:a})=>{const o="style";var n=`${r}-${o}`;if(!(e.querySelectorAll(`${o}#${n}`).length>0)){var i=e.createElement(o);i.id=n,i.innerHTML=(({css:e,widgets:t})=>`${e||""}${t&&t.length?" "+t.map((e=>e.css)).join(" "):""}`)({css:t,widgets:a}),e.getElementsByTagName("head")[0].appendChild(i)}})({doc:a,css:c,govxId:g,widgets:v}),(({button:a,dataGovXId:o,doc:n,widgets:i})=>{var s=[];s.push({button:a.slim.type,widgetType:r}),s.push({button:a.full.type,widgetType:t}),s.push({button:a.full.type,widgetType:e}),s.map((e=>u(n,e,i,a,o)))})({button:y,dataGovXId:f,doc:a,widgets:v}),(({layout:e,dataGovXId:t,doc:r})=>{for(var a=r.querySelectorAll(`[${t}]`),o=0,n=a.length;o<n;o++){var i=a[o];if(!i.innerHTML&&i.dataset){var s="",c="";switch(i.dataset.govxId){case e.slim.abbreviation:case e.slim.type:s=e.slim.className,c=e.slim.innerHTML;break;case e.page.abbreviation:case e.page.type:s=e.page.className,c=e.page.innerHTML}if(!c){if(i.dataset.govxId&&i.dataset.govxId.length)continue;s=e.full.className,c=e.full.innerHTML}i.className=s,i.innerHTML=c}}})({layout:i,dataGovXId:f,doc:a}),(({doc:e,authorizationBaseUri:t,ctaPopup:r})=>{let a=e.querySelectorAll(p(t));for(var o=0,n=a.length;o<n;o++)h({cta:a[o],ctaPopup:r});let i=e.querySelectorAll(d(t));for(o=0,n=i.length;o<n;o++)h({cta:i[o],ctaPopup:r})})({doc:a,authorizationBaseUri:n,ctaPopup:l}),(({doc:e,settings:t,authorizationBaseUri:r})=>{t.reportTimeoutId&&(window.clearTimeout(t.reportTimeoutId),t.reportTimeoutId=0),t.reportTimeoutId=window.setTimeout((()=>(({doc:e,settings:t,authorizationBaseUri:r})=>{if(t.reported)return;let a=(({doc:e,authorizationBaseUri:t})=>{let r=e&&e.location&&e.location.pathname,a={},o=e.querySelectorAll(p(t));for(var n=0,i=o.length;n<i;n++)a[s(o[n]&&o[n].href,r)]=1;let c=e.querySelectorAll(d(t));for(n=0,i=c.length;n<i;n++)a[s(c[n]&&c[n].dataset&&c[n].dataset.govxHref,r)]=1;let u=[];for(var l in a)l&&u.push(Number(l));return u})({doc:e,authorizationBaseUri:r}),o=a&&a.length||0;const{live:n,tunnelUri:i,myShopifyDomain:c}=t;o<1||(t.reported=!0,n>0||m({doc:e,src:`${i}/api/${c}/live.js`}),m({doc:e,src:`${i}/api/${c}/track.js?types=${a.join(",")}&ts=${(new Date).getTime()}`}))})({doc:e,settings:t,authorizationBaseUri:r})),500)})({doc:a,settings:o,authorizationBaseUri:n}),!1},g=({layout:e,format:t,value:r})=>{if(!r)return e;for(const a in e)if(e.hasOwnProperty(a)){let o="function"==typeof t?t(a):t,n=r.length?r:r[a];const i=new RegExp(o,"g");e[a].innerHTML=e[a].innerHTML.replace(i,n)}return e};(()=>{let e=(e=>{var t=null;try{t=JSON.parse(e)}catch(e){console.log("error",e)}if(!t)return;const r="govx-id";t.css="[data-govx-id]{width:100%;}[data-govx-id] .govx-id-text{fill:#231f20;}[data-govx-id] .govx-id-shield{fill:#ee6337;}.govx-id-full-wrapper{font-style:normal;clear:both;display:flex;font-family:sans-serif;padding:20px 0 !important;margin:0 auto;}.govx-id-full-wrapper.govx-mini{padding-left:0 !important;padding-right:0 !important;}.govx-id-full-wrapper.govx-sides{padding:20px 20px !important;}.govx-id-full-wrapper.govx-left{justify-content:flex-start;}.govx-id-full-wrapper.govx-center{justify-content:center;}.govx-id-full-wrapper.govx-right{justify-content:flex-end;}.preview .govx-id-full-wrapper{padding:inherit;height:auto;}.govx-id-full-wrapper a{color:#3d4246;text-decoration:none;}.govx-id-full-wrapper p{font-size:13px;font-family:sans-serif;margin:0 0 19.44444px;color:#333;}.govx-id-full-wrapper.govx-mini .govx-id-full,.govx-id-full-wrapper.govx-min .govx-id-full{width:100% !important;min-width:auto !important;}.govx-id-full-wrapper .govx-id-full{width:35%;min-width:325px;max-width:350px;text-align:left;line-height:1.5;font-size:12px;font-family:sans-serif;padding:15px;color:#333 !important;background-color:#fff;border:1px solid #eee;}.preview .govx-id-full-wrapper .govx-id-full{width:auto;}@media only screen and (max-width:749px){.govx-id-full-wrapper .govx-id-full{width:100%;padding:1em;margin-left:0;}}.govx-id-full-wrapper .govx-id-full .govx-id-button{width:100%;font-size:13px;font-family:sans-serif;border:1px solid #ddd;background-color:#eee;padding-top:0.5em;padding-bottom:0.5em;text-align:center;text-decoration:none;display:inline-block;}.govx-id-full-wrapper .govx-id-full .govx-id-button:hover{background-color:#fff;}.govx-id-full-wrapper .govx-id-full a.govx-id-link{display:block;text-align:right;color:#00a1df;padding-top:5px;border:0;}.govx-id-full-wrapper .govx-id-button-content{display:flex;justify-content:center;}.govx-id-button svg{margin:5px 0;width:114px !important;height:18px !important;}.govx-id-slim-wrapper{font-style:normal;clear:both;display:block !important;width:100%;padding:20px 0 !important;letter-spacing:initial;text-transform:none;}.govx-id-slim-wrapper .govx-id-slim{display:flex !important;}.govx-id-slim-wrapper.govx-sides{width:calc(100% - 40px);padding:20px 20px !important;}.govx-id-slim-wrapper.govx-max .govx-id-slim a{max-width:350px !important;}.govx-id-slim-wrapper.govx-left .govx-id-slim{justify-content:flex-start;}.govx-id-slim-wrapper.govx-center .govx-id-slim{justify-content:center;}.govx-id-slim-wrapper.govx-right .govx-id-slim{justify-content:flex-end;}[data-product-menu-state=\'addtocart\'] .product-menu-slideout [data-govx-id=\'slim\'].govx-id-slim-wrapper{display:none !important;}.header .mini-cart .mini-cart__recap .govx-id-slim-wrapper{padding:20px 0 0 0 !important;}.govx-id-slim-wrapper .govx-id-slim a{display:flex;width:100% !important;border:1px solid #eee;color:#333 !important;background-color:white !important;flex-direction:row;padding:10px;justify-content:flex-start;text-align:left;text-decoration:none;}.govx-id-slim img{width:50px;height:50px;max-width:50px;}.govx-id-slim i{display:block;flex-grow:0;align-self:center;width:60px;min-width:60px;height:50px;background-image:url(https://i5.govx.net/images/644224_govxid_new_logo_shopify_iapp_icon.svg?v=sQZpXJ91ehIbui8BnZNMVw==);background-repeat:no-repeat;}.govx-id-slim .govx-icon{display:block;flex-grow:0;align-self:center;width:50px;height:50px;}.govx-id-slim .govx-text{display:block;flex-grow:2;flex-wrap:wrap;align-self:center;padding-left:15px;max-width:400px;}.govx-id-slim .govx-text p{color:#333;line-height:16px;font-size:14px;margin:0px;}.govx-id-slim .govx-text span{font-weight:400;font-size:13px;white-space:normal;font-family:sans-serif;}.govx-id-page li{list-style-type:disc;list-style-position:inside;}.govx-id-page .govx-id-cta-wrapper{padding:0 0 16px 0;}.govx-id-page .govx-id-cta-wrapper,.govx-id-page .govx-id-cta{display:flex;justify-content:center;}.govx-id-page .govx-id-cta{width:250px !important;}.govx-id-page .govx-id-cta .shopify-product-form,.govx-id-page .govx-id-cta .shopify-payment-button,.govx-id-page .govx-id-cta button,.govx-id-page .govx-id-cta button.shopify-payment-button__button,.govx-id-page .govx-id-cta button.shopify-payment-button__button--unbranded{width:100% !important;}.govx-id-page button.govx-custom{border-radius:2px;padding:8px 16px;border:0;margin:16px 0;background-color:#eeeeee;font-weight:bold;font-size:18px;}.govx-id-page .govx-id svg{background-color:#fff;width:100px !important;height:35px !important;}.govx-widget-footer{display:flex;justify-content:center;flex-wrap:wrap;align-items:center;padding:16px 0;border-top:solid 1px #e3e3e3;border-bottom:solid 1px #e3e3e3;margin:48px 0;text-align:center;}.govx-widget-footer .footer-item{width:100%;}.govx-widget-footer .footer-item.govx-id{margin-top:8px;}.govx-widget-footer .footer-item.govx-id a{border-bottom:none;}.govx-widget-footer .footer-item.learn-more{display:none;}@media only screen and (min-width:749px){.govx-widget-footer .footer-item{width:auto;}.govx-widget-footer .footer-item.govx-id{margin-top:0;}.govx-widget-footer .footer-item.govx-id{position:relative;top:5px;}.govx-widget-footer .footer-item.learn-more{display:inline;}}",t.dataGovXId=`data-${r}`,t.govxId=r,t.logo='<svg version="1.1" alt="GovX ID" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 159.19"><path class="govx-id-shield" d="M73.94,77.83,35,118.64H71.44a8.19,8.19,0,0,0,5.94-2.54l14.5-15.19a3.11,3.11,0,0,0,0-4.28Z" /><path class="govx-id-shield" d="M77.38,33.13a8.23,8.23,0,0,0-5.94-2.54H35l81.85,85.75a7.24,7.24,0,0,0,5.23,2.23H127L81,70.39l4-4.18,47.93,50.08a7.4,7.4,0,0,0,5.34,2.28H143L89,62l4-4.19,55.47,58.11a8.48,8.48,0,0,0,6.14,2.63h4.36ZM65.43,37.64h3.51a.1.1,0,0,0,.1-.07l1.09-3.35a.1.1,0,0,1,.19,0l1.09,3.35a.1.1,0,0,0,.1.07H75a.1.1,0,0,1,.06.19l-2.84,2.06a.11.11,0,0,0,0,.12l1.09,3.34a.11.11,0,0,1-.16.12L70.29,41.4a.09.09,0,0,0-.12,0l-2.85,2.07a.11.11,0,0,1-.16-.12L68.25,40a.11.11,0,0,0,0-.12l-2.84-2.06A.11.11,0,0,1,65.43,37.64Zm-4.74.19-2.84,2.06a.11.11,0,0,0,0,.12l1.09,3.34a.11.11,0,0,1-.16.12L55.89,41.4a.09.09,0,0,0-.12,0l-2.84,2.07a.11.11,0,0,1-.16-.12L53.86,40a.13.13,0,0,0,0-.12L51,37.83a.11.11,0,0,1,.06-.19h3.52a.12.12,0,0,0,.1-.07l1.08-3.35a.11.11,0,0,1,.2,0L57,37.57a.1.1,0,0,0,.09.07h3.52A.11.11,0,0,1,60.69,37.83Zm11,11.27-2.84,2.07a.09.09,0,0,0,0,.11l1.09,3.35a.1.1,0,0,1-.16.11l-2.85-2.07a.13.13,0,0,0-.12,0l-2.84,2.07a.1.1,0,0,1-.16-.11l1.09-3.35a.09.09,0,0,0,0-.11L62,49.1a.11.11,0,0,1,.06-.19h3.52a.11.11,0,0,0,.1-.07l1.09-3.34a.1.1,0,0,1,.19,0L68,48.84a.1.1,0,0,0,.09.07h3.52A.11.11,0,0,1,71.67,49.1ZM82,60.27l-2.84,2.07a.09.09,0,0,0,0,.11l1.09,3.35a.1.1,0,0,1-.16.11l-2.84-2.07a.15.15,0,0,0-.13,0l-2.84,2.07a.1.1,0,0,1-.16-.11l1.09-3.35a.09.09,0,0,0,0-.11L72.3,60.27a.11.11,0,0,1,.06-.19h3.51A.1.1,0,0,0,76,60l1.09-3.34a.1.1,0,0,1,.19,0L78.34,60a.1.1,0,0,0,.1.07H82A.11.11,0,0,1,82,60.27Zm4.17-11.39L83.33,51a.09.09,0,0,0,0,.11l1.08,3.35a.1.1,0,0,1-.16.11l-2.84-2.06a.09.09,0,0,0-.12,0l-2.85,2.06a.1.1,0,0,1-.15-.11l1.08-3.35a.09.09,0,0,0,0-.11l-2.84-2.07a.1.1,0,0,1,.06-.18H80a.1.1,0,0,0,.09-.07l1.09-3.35a.11.11,0,0,1,.2,0l1.08,3.35a.12.12,0,0,0,.1.07h3.52A.1.1,0,0,1,86.18,48.88Z"/><path class="govx-id-shield" d="M122.17,69.18l36.76-38.51H122.48a8.17,8.17,0,0,0-5.94,2.54L99.94,50.59l17.75,18.59A3.09,3.09,0,0,0,122.17,69.18Z" /><path class="govx-id-shield" d="M183.28,10.21V127.75a1.9,1.9,0,0,1-1.48,1.86L97.39,148.93a1.87,1.87,0,0,1-.86,0L12.12,129.61a1.9,1.9,0,0,1-1.49-1.86V10.21H183.28M193.42.08H.5V127.75a12,12,0,0,0,9.36,11.74l84.41,19.32a12.21,12.21,0,0,0,5.38,0l84.41-19.32a12,12,0,0,0,9.36-11.74V.08Z" /><path class="govx-id-text" d="M358.8,30.27H259.38A12.35,12.35,0,0,0,247,42.62v63.9a12.35,12.35,0,0,0,12.35,12.35H358.8a12.35,12.35,0,0,0,12.35-12.35V74.23A5.26,5.26,0,0,0,365.89,69H329.13V82.28a5.43,5.43,0,0,0,5.43,5.42h10.87a1.81,1.81,0,0,1,1.8,1.8v8.08a1.8,1.8,0,0,1-1.8,1.8l-72.5-.09a1.81,1.81,0,0,1-1.8-1.8V51.92a1.8,1.8,0,0,1,1.8-1.79h72.5a1.8,1.8,0,0,1,1.8,1.79v7.59h23.92V42.62A12.35,12.35,0,0,0,358.8,30.27Z" /><path class="govx-id-text" d="M498.53,30.27H398.15a12.35,12.35,0,0,0-12.36,12.35v64A12.35,12.35,0,0,0,398.15,119H498.53a12.35,12.35,0,0,0,12.35-12.35v-64A12.35,12.35,0,0,0,498.53,30.27ZM486.78,97a2.09,2.09,0,0,1-.68,1.78,5.14,5.14,0,0,1-2.77.5h-70a5.22,5.22,0,0,1-2.68-.5A2,2,0,0,1,409.9,97V52.41a2,2,0,0,1,.77-1.77,5.1,5.1,0,0,1,2.68-.51h70a5,5,0,0,1,2.77.51,2.06,2.06,0,0,1,.68,1.77Z" /><path class="govx-id-text" d="M610.93,35.79,580.85,94.11l-.1.21-.11-.21L550.57,35.79a10.25,10.25,0,0,0-9.12-5.52H518.2l43.38,84.28a8,8,0,0,0,7.13,4.32h24.07a8,8,0,0,0,7.14-4.32l43.37-84.28H620A10.23,10.23,0,0,0,610.93,35.79Z" /><path class="govx-id-text" d="M769.21,30.3h-30.3a8.31,8.31,0,0,0-6,2.56L710,56.9l-23-24a8.28,8.28,0,0,0-6-2.56h-30.3l42.31,44.33L650.75,119h30.72a7.29,7.29,0,0,0,5.27-2.25L710,92.35l23.24,24.35a7.25,7.25,0,0,0,5.26,2.25h30.73L726.9,74.63Z" /><path class="govx-id-text" d="M825.73,119h21.19V30.26H825.73a2.91,2.91,0,0,0-2.91,2.92v82.9A2.91,2.91,0,0,0,825.73,119Z" /><path class="govx-id-text" d="M999.5,92.27V57a26.72,26.72,0,0,0-26.72-26.73H874.4V119h98.38A26.72,26.72,0,0,0,999.5,92.27Zm-37.06,6.55L902,99.24a5.22,5.22,0,0,1-2.68-.5,2,2,0,0,1-.77-1.77V52.41a2,2,0,0,1,.77-1.78,5.22,5.22,0,0,1,2.68-.5l60.48.42a12.37,12.37,0,0,1,12.28,12.37V86.46A12.36,12.36,0,0,1,962.44,98.82Z" /></svg>';let{discount:a,groups:o,logo:n,myShopifyDomain:i,page:s}=t;return t.layout=(({discount:e,govxId:t,groups:r,logo:a,myShopifyDomain:o,page:n})=>{let i={full:{type:"full",abbreviation:"f",innerHTML:'<div class="govx-id-full"><p> %%GROUPS_FULL%% discount available. Verify with GovX ID to instantly unlock your savings. </p><a title="GovX ID Button" target="_blank" data-action="govx-id-pop" class="govx-id-button" href="https://auth.govx.com/shopify/verify?shop=%%MY_SHOPIFY_DOMAIN%%&utm_source=shopify&utm_medium=govxid&utm_campaign=offer_button"><span class="govx-id-button-content"> %%HTML_GOVX_ID_SVG%% </span></a><a class="govx-id-link" href="https://www.govx.com/t/govx-id" target="_blank">What is GovX ID?</a></div>',className:`${t}-full-wrapper`},slim:{type:"slim",abbreviation:"s",innerHTML:'<span class="govx-id-slim"><a title="GovX ID Link" target="_blank" data-action="govx-id-pop" href="https://auth.govx.com/shopify/verify?shop=%%MY_SHOPIFY_DOMAIN%%&utm_source=shopify&utm_medium=govxid&utm_campaign=cart_drawer"><span class="govx-icon"><i></i></span><span class="govx-text"><p><span>%%GROUPS_SLIM%% discount available</span></p></span></a></span>',className:`${t}-slim-wrapper`},page:{type:"page",abbreviation:"p",innerHTML:'<meta charset="utf-8" /><div class="govx-id-page"><p style="text-align: center;">%%MESSAGE_TEXT%%</p><div class="govx-id-cta-wrapper" %%CUSTOMIZE_0%%><div class="govx-id-cta"><div class="shopify-product-form product_payments_btns smart-wrapper"><div class="shopify-payment-button"><button class="shopify-payment-button__button shopify-payment-button__button--unbranded" data-govx-href="https://auth.govx.com/shopify/verify?shop=%%MY_SHOPIFY_DOMAIN%%&utm_source=shopify&utm_medium=govxid&utm_campaign=custom_page"> Save up to %%DISCOUNT_TEXT%% </button></div></div></div></div><div class="govx-id-cta-wrapper" %%CUSTOMIZE_1%% ><div class="govx-id-cta"><button class="govx-custom" %%BUTTON_STYLE%% data-govx-href="https://auth.govx.com/shopify/verify?shop=%%MY_SHOPIFY_DOMAIN%%&utm_source=shopify&utm_medium=govxid&utm_campaign=custom_page"> Save up to %%DISCOUNT_TEXT%% </button></div></div><p><strong>This offer is eligible for:</strong></p> %%GROUPS_PAGE%% <p><strong>How it works:</strong></p><ul><li>Click the button to claim your discount and you\'ll be asked to verify your affiliation with GovX ID. Verification is real-time and secure. If you already have a GovX ID account, just log in!</li><li>After you verify, you\'ll receive a single-use discount code to apply at checkout. Be sure to copy your code.</li><li>For future purchases, simply log in with your GovX ID to unlock a new discount code.</li><li>There is a limit of one discount code per day.</li></ul><div class="govx-widget-footer"><div class="footer-item">Verification is powered by&nbsp;&nbsp;&nbsp;</div><div class="footer-item govx-id"><a href="https://www.govx.com/t/govx-id" target="_blank" rel="noopener noreferrer">%%HTML_GOVX_ID_SVG%%</a></div><div class="footer-item learn-more"> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <a href="https://www.govx.com/t/govx-id" target="_blank" rel="noopener noreferrer">Learn more</a></div></div></div>',className:`${t}-page-wrapper`}},s=e?"percentage"===e.type?`${e.value}%`:`$${e.value}`:"",c=(e?e.message:"").replace(/\n/g,"<br/>"),u=i.page.innerHTML,l=!1;if(n){let{customize:e,buttonColorBackground:t,buttonColorForeground:r}=n;l=e,u=u.replace("%%BUTTON_STYLE%%",l?`style="background-color:${t};color:${r};"`:"")}return u=u.replace(`%%CUSTOMIZE_${l?0:1}%%`,'style="display:none"'),u=u.replace(`%%CUSTOMIZE_${l?1:0}%%`,""),i.page.innerHTML=u,g({layout:i,format:"%%MESSAGE_TEXT%%",value:c}),g({layout:i,format:"%%HTML_GOVX_ID_SVG%%",value:a}),g({layout:i,format:"%%DISCOUNT_TEXT%%",value:s}),g({layout:i,format:"%%MY_SHOPIFY_DOMAIN%%",value:o}),g({layout:i,format:e=>`%%GROUPS_${e.toUpperCase()}%%`,value:r}),i})({discount:a,govxId:r,groups:o,logo:n,myShopifyDomain:i,page:s}),t})('{\"discount\":{\"message\":\"To thank you for your service, we\'ve partnered with GovX to offer a discount on our store.\",\"type\":\"percentage\",\"value\":10},\"groups\":{\"page\":\"<ul><li>Current & former U.S. military</li><li>Military spouses & dependents</li><li>First responders including law enforcement, fire, and EMS</li><li>Federal, state, and local government employees</li></ul>\",\"full\":\"Military, First Responder and Government Employee\",\"slim\":\"Military and First Responder\"},\"live\":1,\"myShopifyDomain\":\"weareallbirds.myshopify.com\",\"page\":null,\"widgets\":{\"settings\":[]},\"authorizationBaseUri\":\"https://auth.govx.com\",\"tunnelUri\":\"https://id-shop.govx.com\"}');e&&(((e,t)=>{f(e,t),((e,t)=>{"function"==typeof MutationObserver&&new MutationObserver((r=>{for(var a=!1,o=0,n=r.length;o<n;o++)switch(r[o].type){case"attributes":case"childList":case"subtree":a=!0}return!!a&&f(e,t)})).observe(e.body,{attributes:!0,childList:!0,subtree:!0})})(e,t)})(document,e),window.GovXIdApi={test:function({selector:t,type:r}){return(({dataGovXId:e,doc:t,selector:r,type:a})=>{var o=t.querySelector(r);o&&o.appendChild(c({dataGovXId:e,doc:t,type:a})),console.log({selector:r,type:a,parent:o})})({dataGovXId:e.dataGovXId,doc:document,selector:t,type:r})},popup:function(e){return l(e)},refresh:function(){return f(document,e)}})})()})();