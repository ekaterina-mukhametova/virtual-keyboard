const area = document.getElementById("area");

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

      Keyboard.properties.value += transcript;

    //let i = transcript;
    //Keyboard.properties.value += i;
    if (e.results[0].isFinal) {
        if (Keyboard.properties.value) Keyboard.properties.value += ' ';
        //Keyboard.properties.value.slice(i.length);
        //Keyboard.properties.value += transcript;
    }
    //Keyboard.properties.value = transcript;
    Keyboard._triggerEvent('oninput');
    console.log(transcript);
    
});

recognition.addEventListener('end', () => {
    if (Keyboard.properties.speech === true) recognition.start();
});

var cursorPoint = 0;

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false,
        lang: false,
        speech: false
    },

    keyboards: {
        keyLayoutENG: [
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "left", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "right",
            "lang", "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "\'", "Enter",
            "Shift", "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "speech"
        ],
        keyLayoutRU : [
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "left", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "right",
            "lang", "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
            "Shift", "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "speech"
        ],
        specialCharactersENG : [
            "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace",
            "left", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}", "right",
            "lang", "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l",":", "\"", "Enter",
            "Shift", "done", "z", "x", "c", "v", "b", "n", "m","<", ">", "?", "speech"
        ],
        specialCharactersRU : [
            "~", "!","\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "Backspace",
            "left", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "right",
            "lang", "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
            "Shift", "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "speech"
        ]
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "left", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "right",
            "lang", "capsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "\'", "enter",
            "shift", "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "speech",
            "space"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            //const insertLineBreak = ["backspace", "right", "Enter", "speech"].indexOf(key) !== -1;
            const insertLineBreak = ["backspace"].indexOf(key) !== -1;
            let audio = document.querySelector('audio');

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "backspace":
                    //keyElement.classList.add("keyboard__key--wide", "backspace");
                    keyElement.classList.add("backspace");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this.properties.value = this.properties.value.substring(0, cursorPoint - 1) + this.properties.value.substring(cursorPoint);
                        this._triggerEvent("oninput");
                        cursorPoint--;
                        area.selectionStart = area.selectionEnd = cursorPoint;
                        area.focus();
                    });

                    break;

                case "left":
                    //keyElement.classList.add("keyboard__key--wide", "arrowLeft");
                    keyElement.classList.add("arrowLeft");
                    keyElement.innerHTML = createIconHTML("arrow_left");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        cursorPoint--;
                        area.selectionStart = area.selectionEnd = cursorPoint;
                        area.focus();
                    });

                    break;

                case "right":
                    //keyElement.classList.add("keyboard__key--wide", "arrowRight");
                    keyElement.classList.add("arrowRight");
                    keyElement.innerHTML = createIconHTML("arrow_right");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        cursorPoint++;
                        area.selectionStart = area.selectionEnd = cursorPoint;
                        area.focus();
                    });
    
                    break;

                case "lang":
                    //keyElement.classList.add("keyboard__key--wide", "lang");
                    keyElement.classList.add("lang");
                    keyElement.innerHTML = createIconHTML("language");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this._toggleLang();
                        area.focus();
                    });

                    break;

                case "capsLock":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "capsLock");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                        area.focus();
                    });

                    break;

                case "enter":
                    //keyElement.classList.add("keyboard__key--wide", "enter");
                    keyElement.classList.add("enter");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        area.focus();
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide", "space");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this.properties.value = this.properties.value.slice(0, cursorPoint) + " " + this.properties.value.slice(cursorPoint);
                        this._triggerEvent("oninput");
                        cursorPoint++;
                        area.selectionStart = area.selectionEnd = cursorPoint;
                        area.focus();
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "shift");
                    keyElement.innerHTML = createIconHTML("keyboard_shift");
    
                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
                        area.focus();
                    });
    
                    break;

                case "done":
                    keyElement.classList.add("keyboard__key--dark", "done");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "speech":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "speech");
                    keyElement.innerHTML = createIconHTML("keyboard_voice");

                    keyElement.addEventListener("click", () => {
                        audio.play();
                        this._toggleSpeech();
                        keyElement.classList.toggle("keyboard__key--active");
                        //recognition.start();
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    break;
            }
            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        this._runOnKeys(
            this._toggleLang,
            "Shift",
            "Alt"
          );

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _runOnKeys(func, ...keys) {
        let pressed = new Set();
  
        document.addEventListener('keydown', function(event) {
          pressed.add(event.key);
  
          for (let key of keys) { // все ли клавиши из набора нажаты?
            if (!pressed.has(key)) {
              return;
            }
          }
  
          // да, все
  
          // во время показа alert, если посетитель отпустит клавиши - не возникнет keyup
          // при этом JavaScript "пропустит" факт отпускания клавиш, а pressed[keyCode] останется true
          // чтобы избежать "залипания" клавиши -- обнуляем статус всех клавиш, пусть нажимает всё заново
          pressed.clear();
  
          func();
        });
  
        document.addEventListener('keyup', function(event) {
          pressed.delete(event.key);

          if (event.key === "Shift") {
            this._toggleShift();
          }
        });
    },

    _defaultKeyListener () {
        this.elements.keys.forEach(key => {
            if (key.childElementCount === 0) {
                key.addEventListener("click", () => {
                    let audio = document.querySelector('audio');
                    audio.play();
                    let k = Array.from(this.elements.keys).indexOf(key);
                    this._defaultKey(k, key);
                    this._triggerEvent("oninput");
                    cursorPoint++;
                    area.selectionStart = area.selectionEnd = cursorPoint;
                    area.focus();
                });
            }
        })

        document.addEventListener("keydown", (e) => {
            event.preventDefault();
             if (e.repeat) { 
                return; }
            //console.log(e.key);

            //let button = document.querySelectorAll('.keyboard__key');  
            //console.log(button.classList); 
            function backlight (key) {
                return document.querySelector(key).classList.toggle("keyboard__key--click");
            }
            let capsLock = document.querySelector('.capsLock');
            let shift = document.querySelector('.shift');
            let audio = document.querySelector('audio');
            audio.play();
            if (e.key === "CapsLock") {
                backlight('.capsLock');
                Keyboard._toggleCapsLock();
                capsLock.classList.toggle("keyboard__key--active", this.properties.capsLock);
                area.focus();
            }
            else if (e.key === "Backspace") {
                backlight('.backspace');
                this.properties.value = this.properties.value.substring(0, cursorPoint - 1) + this.properties.value.substring(cursorPoint);
                this._triggerEvent("oninput");
                cursorPoint--;
                area.selectionStart = area.selectionEnd = cursorPoint;
                area.focus();
            }
            else if (e.key === "Enter") {
                backlight('.enter');
                this.properties.value += "\n";
                this._triggerEvent("oninput");
                area.focus();
            }
            else if (e.code === "Space") {
                backlight('.space');
                this.properties.value = this.properties.value.slice(0, cursorPoint) + " " + this.properties.value.slice(cursorPoint);
                this._triggerEvent("oninput");
                cursorPoint++;
                area.selectionStart = area.selectionEnd = cursorPoint;
                area.focus();
            }
            else if (e.key === "Shift") {
                backlight('.shift');
                Keyboard._toggleShift();
                shift.classList.toggle("keyboard__key--active", this.properties.shift);
                area.focus();
            }
            else if (e.key === "ArrowLeft") {
                backlight('.arrowLeft');
                cursorPoint--;
                area.selectionStart = area.selectionEnd = cursorPoint;
                area.focus();
            }
            else if (e.key === "ArrowRight") {
                backlight('.arrowRight');
                cursorPoint++;
                area.selectionStart = area.selectionEnd = cursorPoint;
                area.focus();
            }
            else {
                //console.log(e.key);
                this.elements.keys.forEach(key => {
                    if (e.key === key.textContent.toUpperCase() || (e.key === key.textContent)) {
                        key.classList.toggle("keyboard__key--click");
                        //console.log(key);
                        //console.log("yes");
                        area.focus();
                        let k = Array.from(this.elements.keys).indexOf(key);
                        //button.classList.toggle('.keyboard__key--click');
                        this._defaultKey(k, key);
                        this._triggerEvent("oninput");
                        cursorPoint++;
                        area.selectionStart = area.selectionEnd = cursorPoint;
                    }
                })
            }
        })

        document.addEventListener("keyup", (e) => {
            let shift = document.querySelector('.shift');
            if (e.key === "Shift") {
                this._toggleShift();
                shift.classList.toggle("keyboard__key--active", this.properties.shift);
                area.focus();
            }
            this.elements.keys.forEach( key => {
                if (key.classList.contains("keyboard__key--click")) key.classList.toggle("keyboard__key--click");
            })
        })
    },

    _defaultKey(k, key) {

        //console.log(k + " " + key);
        //console.log(key.textContent.toUpperCase());

        if (this.properties.shift) {
            if (this.properties.lang) {
                this.properties.value = this.properties.value.slice(0, cursorPoint) + this.keyboards.specialCharactersRU[k].toUpperCase() + this.properties.value.slice(cursorPoint);
            } else {
                this.properties.value = this.properties.value.slice(0, cursorPoint) + Keyboard.keyboards.specialCharactersENG[k].toUpperCase() + this.properties.value.slice(cursorPoint);
            }
        } else {
            if (this.properties.lang) {
                this.properties.value = this.properties.value.slice(0, cursorPoint) + (this.properties.capsLock ? this.keyboards.keyLayoutRU[k].toUpperCase() : this.keyboards.keyLayoutRU[k].toLowerCase()) + this.properties.value.slice(cursorPoint);
            } else {
                this.properties.value = this.properties.value.slice(0, cursorPoint) + (Keyboard.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()) + this.properties.value.slice(cursorPoint);
            }
        }

        this._triggerEvent("oninput");
        area.focus();

    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
            //console.log(key.textContent);
        }
    },

    _toggleSpeech() {
        this.properties.speech = !this.properties.speech;
        
        if (this.properties.speech === true) recognition.start();
        //console.log("y");
    },

    _toggleLang() {
        Keyboard.properties.lang = !Keyboard.properties.lang;
        console.log(Keyboard.properties.lang);

        if (Keyboard.properties.lang) recognition.lang = 'ru';
        else recognition.lang = 'en-US';

        for(let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0) {
                if (Keyboard.properties.lang) {
                    if (Keyboard.properties.shift) this.elements.keys[i].textContent = Keyboard.keyboards.specialCharactersRU[i].toUpperCase();
                    else this.elements.keys[i].textContent = Keyboard.properties.capsLock ? Keyboard.keyboards.keyLayoutRU[i].toUpperCase() : Keyboard.keyboards.keyLayoutRU[i].toLowerCase();
                } 
                else {
                    if (Keyboard.properties.shift) this.elements.keys[i].textContent = Keyboard.keyboards.specialCharactersENG[i].toUpperCase();
                    else this.elements.keys[i].textContent = Keyboard.properties.capsLock ? Keyboard.keyboards.keyLayoutENG[i].toUpperCase() : Keyboard.keyboards.keyLayoutENG[i].toLowerCase();
                }
            }
        }
    },

    _toggleShift() {
        this.properties.shift = !this.properties.shift;

        for (let i = 0; i < this.elements.keys.length; i++) {
            if (this.elements.keys[i].childElementCount === 0) {
                if (this.properties.shift) {
                    if(this.properties.lang) {
                        this.elements.keys[i].textContent = this.keyboards.specialCharactersRU[i].toUpperCase();
                    } else {
                        this.elements.keys[i].textContent = this.keyboards.specialCharactersENG[i].toUpperCase();
                    }
                } else {
                    if (this.properties.lang) this.elements.keys[i].textContent = this.properties.capsLock ? this.keyboards.keyLayoutRU[i].toUpperCase() : this.keyboards.keyLayoutRU[i].toLowerCase();
                    else this.elements.keys[i].textContent = this.properties.capsLock ? this.keyboards.keyLayoutENG[i].toUpperCase() : this.keyboards.keyLayoutENG[i].toLowerCase();
                }
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Keyboard._defaultKeyListener ();
});
