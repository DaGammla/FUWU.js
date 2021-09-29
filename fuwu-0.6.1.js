/*
* FUWU.js JavaScript Library v0.6.1
* https://github.com/DaGammla/FUWU.js
*
* Released under the MIT license
* https://github.com/DaGammla/FUWU.js/blob/main/LICENSE
*
* 2021 by DaGammla
*/

//Shorter version of js native document.querySelectorAll
//with option for callback on each of the found elements
function $a(cssSelector, eachCallback){

    //Every element that matches the css selector
    let matches = document.querySelectorAll(cssSelector);

    if (eachCallback){
        //If there is a callback
        matches.forEach(eachCallback);
    }

    //Always return matches no matter of callback
    return matches;
}

//Just a shorter version of js native document.querySelector
function $o(cssSelector){
    return document.querySelector(cssSelector);
}

//$cookies object simplifies storing cookies
const $cookies = {

    //Set a cookie to a value. An expiry Date can be provided
    set: function(cookieName, cookieValue, expDate){

        //The path of this page
        let path = window.location.pathname;
        //The path of the folder, so the path until the last '/'
        path = path.substring(0, path.lastIndexOf("/") + 1);

        //Redirected to global cookies with the path of the local folder
        $cookies.g.set(cookieName, cookieValue, path, expDate);
    },

    //Returns the value of a cookie
    get: function(cookieName){
        //Encoded cookieName to prevent issues with '=' or ';'
        cookieName = encodeURIComponent(cookieName);

        //All cookies available for this page
        let cookieString = document.cookie;

        //Find where 'cookieName=' is located within the cookie string
        let startIndex = cookieString.indexOf(cookieName + "=");

        //If it's not in there, that cookie does not have a value
        if (startIndex < 0){
            return null;
        }

        //Find where that cookies value ends
        let cookieEnd = cookieString.indexOf(";", startIndex);

        //No ';' at the end of the cookie string, so set the index just to one after the last character
        if (cookieEnd < 0){
            cookieEnd = cookieString.length;
        }

        //Decode the cookies as it is stored encoded
        return decodeURIComponent(
            //Substring from after the cookieName + 1 ('=') and to the end (';' or end) 
            cookieString.substring(startIndex + cookieName.length + 1, cookieEnd).trim());
    },
    
    //Clears a cookie
    clear: function(cookieName){
        //Remove the cookies value and set it to expire immediately
        $cookies.set(cookieName, "", new Date());
    },

    //Returns all cookies available to this page as an object
    all: function(){
        //All cookies available for this page
        let cookieString = document.cookie;

        //Every cookie is seperated by a ';'
        let cookieArray = cookieString.split(";");

        //Return object
        let cookieObject = {};

        //Loop through all cookie strings
        cookieArray.forEach(cookie => {

            //Find index where cookieName stops and cookieValue starts
            let equalsIndex = cookie.indexOf("=");

            //If no equals index is present, it is no cookie
            if (equalsIndex < 0)
                return; //= contine;

            //Substring until the equals symbol is cookie name
            let cookieName = decodeURIComponent(cookie.substring(0, equalsIndex).trim())

            //Only the first cookie with that name is stored
            if (cookieObject[cookieName]){
                return; //= contine;
            }

            //The cookie name and value  were encoded to prevent problems with '=' or ';'
            cookieObject[cookieName]
                //Substring after equals sign is cookie value
                = decodeURIComponent(cookie.substring(equalsIndex + 1).trim());
        });

        return cookieObject;
    },

    //T object for temporary cookies, that are deleted when the browser closes
    t: {

        //Set a cookie to a value
        set: function(cookieName, cookieValue){
            //The path of this page
            let path = window.location.pathname;
            //The path of the folder, so the path until the last '/'
            path = path.substring(0, path.lastIndexOf("/") + 1);

            //Redirected to global cookies with the path of the local folder
            $cookies.g.t.set(cookieName, cookieValue, path);
        },

        //Redirect get, clear to $cookies

        get: function(cookieName){ return $cookies.get(cookieName); },
        clear: function(cookieName){ $cookies.clear(cookieName); },
        
    },

    //G object is for global cookies or cookies of a specific path
    g: {

        //Set a cookie to a value. A path and an expiry Date can be provided
        set: function(cookieName, cookieValue, path, expDate){

            //Current day
            let date = new Date();
            
            if (expDate){
                //If an expiry date is given, use it
                date = expDate;
            } else {
                //Else set the cookies to expire in 8 years
                date.setTime(date.getTime() + 8 * 365.25 * 24 * 60 * 60 * 1000)
            }

            //Partial string that sets the expiry date
            let expires = "expires="+ date.toUTCString();

            //If no path is defined use global path '/'
            if (!path){
                path = "/"
            }

            //Partial string that sets the path
            let pathString = "path=" + path;
            
            //encoding the cookie name and value to prevent problems with '=' or ';'
            document.cookie = 
                //cookieName=cookievalue
                encodeURIComponent(cookieName) + "="
                //if cookievalue doesn't exist, put ""
                + (cookieValue ? encodeURIComponent(cookieValue) : "") + ";"
                //Append expiry and path
                + expires + ";" + pathString;
        },


        //Clears a global cookie or a cookie of a specific path
        clear: function(cookieName, path){
            //Remove the cookies value and set it to expire immediately
            $cookies.set(cookieName, "", path, new Date());
        },

        //Redirect get to $cookies

        get: function(cookieName){ return $cookies.get(cookieName); },


        //G.T object is for temporary cookies with global or specific path
        t: {

            //Set a cookie to a value. A path can be provided
            set: function(cookieName, cookieValue, path){


                //If no path is defined use global path '/'
                if (!path){
                    path = "/"
                }

                //Partial string that sets the path
                let pathString = "path=" + path;

                //encoding the cookie name and value to prevent problems with '=' or ';'
                document.cookie = 
                    //cookieName=cookievalue
                    encodeURIComponent(cookieName) + "="
                    //if cookievalue doesn't exist, put ""
                    + (cookieValue ? encodeURIComponent(cookieValue) : "") + ";"
                    //Append path
                    + pathString;
            },

            //Redirect get, clear to $cookies

            get: function(cookieName){ return $cookies.get(cookieName); },
            clear: function(cookieName, path){ $cookies.g.clear(cookieName, path); },
            
        },
    }
};

//$params object simplifies retrieving parameters from the url
const $params = {
    //Get the value of a parameter
    get: function(name, url){
        //With an URL instance, the parameters can easily be extracted from the url with .search
        let urlInstance = new URL(url ? url : window.location);
        //URLSearchParams can automatically find all parameters and their values
        let paramsInstance = new URLSearchParams(urlInstance.search);

        return paramsInstance.get(name);
    },
    //Get an array of all values of parameters with that name
    getEvery: function(name, url, eachCallback){

        //Url aargument is optional but in the middle of the arguments
        if (typeof url == 'function') {
            //So if theres a function on the second place, it is the callback
            eachCallback = arguments[1];
            url = null;
        }

        //With an URL instance, the parameters can easily be extracted from the url with .search
        let urlInstance = new URL(url ? url : window.location);
        //URLSearchParams can automatically find all parameters and their values
        let paramsInstance = new URLSearchParams(urlInstance.search);

        //All parameters with that name parsed by the URLSearchParams object
        let all = paramsInstance.getAll(name);

        //If there is a callback, call if for every element
        if (eachCallback){
            all.forEach(eachCallback);
        }

        //Even if there is a callback, also return the found parameter values
        return all;
    },
    has: function(name, url){
        //With an URL instance, the parameters can easily be extracted from the url with .search
        let urlInstance = new URL(url ? url : window.location);
        //URLSearchParams can automatically find all parameters and their values
        let paramsInstance = new URLSearchParams(urlInstance.search);

        return paramsInstance.has(name);
    },
    all: function(url){
        //With an URL instance, the parameters can easily be extracted from the url with .search
        let urlInstance = new URL(url ? url : window.location);
        //URLSearchParams can automatically find all parameters and their values
        let paramsInstance = new URLSearchParams(urlInstance.search);

        //Add all key value pairs to this object
        let paramsObject = {}
        for (const [key, value] of paramsInstance) {
            //Only use first of that key
            if (paramsObject[key]){
                continue;
            }
            paramsObject[key] = value;
        }
        return paramsObject;
    }
}

//$http object for http requests
const $http = {

    request: function(options, callback, errorCallback, synchronous){

        //Using js native XMLHttpRequest

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            //Check if the http request is finished loading, when the state changes
            if (xmlHttp.readyState == 4){

                //Check if the http request responded 200
                //200 being the response for OK, meaning the request was successful
                if (xmlHttp.status >= 200 && xmlHttp.status <= 299){
                    if (callback){
                        //Call the callback when available
                        callback(xmlHttp.responseText, xmlHttp.status);
                    }
                } else {
                    //If response code is different to 200 something did not go as expected
                    //so call the errorCallback, when available
                    if (errorCallback){
                        errorCallback(xmlHttp.responseText, xmlHttp.status);
                    }
                }
            }
        }
        
        //Open the HttpRequest with all the parameters
        xmlHttp.open(options.method, options.url, !synchronous, options.user, options.password);

        if (options.headers){

            //Add all headers from the options.headers object, if any specified
            for (const key in options.headers) {
                xmlHttp.setRequestHeader(key, options.headers[key]);
            }

            //Header objects look like:{ "SOME_HEADER": "SOME_VALUE", "OTHER_HEADER": "OTHER_VALUE" }
        }

        //Send the HttpRequest
        xmlHttp.send(options.data);

        if (synchronous){
            //With synchronous requests, no callback can be provided
            //so the response is also returned
            return xmlHttp.responseText
        }
    },

    
    //Redirect all http request methods to $http.request with their respective string
    //not using ...arguments as this is shorter in minified js

    get: function(url, callback, errorCallback){ $http.request({method:"GET", url:url}, callback, errorCallback) },
    post: function(url, data, callback, errorCallback){ $http.request({method:"POST", url:url, data:data}, callback, errorCallback) },

    //$http.s for synchronous http requests
    //shouldn't really be used on websites but can be really useful
    //when operation order is important
    s : {

        //Redirect $http.s.request to $http.request with synchronous set to true
        request: function(options, callback, errorCallback){ return $http.request(options, callback, errorCallback, true) },

        //Redirect all http request methods to $http.s.request with their respective string
        //not using ...arguments as this is shorter in minified js

        get: function(url, callback, errorCallback){ return $http.s.request({method:"GET", url:url}, callback, errorCallback) },
        post: function(url, data, callback, errorCallback){ return $http.s.request({method:"POST", url:url, data:data}, callback, errorCallback) },
    }
}

//$json object for parsing and stringfying json and for retrieving json objects from urls
const $json = {
    
    //Redirect $json to JSON for parse and string
    parse: function(jsonString){ return JSON.parse(jsonString)},
    string: function(jsObject){ return JSON.stringify(jsObject)},

    //Returns an js object represented by the json at the given url
    get: function(url, callback, errorCallback){

        //Use http get request to perform this
        $http.get(url, function(responseText, statusCode){
            if (callback){
                //When a callback is given, call it with the parsed response form the http request
                callback($json.parse(responseText), statusCode);
            }
        }, errorCallback);
    },

    //$json.s for synchronous getting a json object
    s: {
        get: function(url, callback, errorCallback){

            //Use http get request to perform this
            let responseText = $http.s.get(url, function(responseText, statusCode){
                if (callback){
                    //When a callback is given, call it with the parsed response form the http request
                    callback($json.parse(responseText), statusCode);
                }
            }, errorCallback);

            //Synchronous http requests don't necessarily need callback
            //the json object is also returned by this function

            return $json.parse(responseText);
        }
    }
}


//Wrapped around in anonymous function to prevent global scope for readyCallbacks and domReady
//those shouldn't be possible to tamper with
const $domReady = function(){

    //A list of callback that will be executed when the dom is ready
    let readyCallbacks = []

    let domReady = false;

    //Check if the dom is already ready
    if (document.readyState == "interactive" || document.readyState == "complete"){
        domReady = true;
    } else {
        //if not add a listener to it
        document.addEventListener("DOMContentLoaded", function(){

            domReady = true;

            //Execute all callbacks
            readyCallbacks.forEach(callback => callback());

            //No need to keep storing them
            readyCallbacks = null;
        });
    }

    //This is the actual $domReady function
    return function(callback){
        //If the dom is already ready
        if (domReady){
            //then execute the callback now
            callback();
        } else {
            //Otherweise add it to the list of callbacks that are waiting
            readyCallbacks.push(callback);
        }
    }
}()