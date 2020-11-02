alert('Доброго времени суток! \n Язык меняется: \n -- на физической клавиатуре - сочетванием клавиш shift + alt; \n -- на виртуальной - посредством нажатия на клавишу шара.  ')

function playSpace() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/space.mp3";
    myAudio.play();
}

function playMain() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/main.mp3";
    myAudio.play();
}

function playOut() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/out.mp3";
    myAudio.play();
}

function playEnter() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/enter.mp3";
    myAudio.play();
}

function playShift() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/shift.mp3";
    myAudio.play();
}

function playCaps() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/caps.mp3";
    myAudio.play();
}

function playBackspace() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/backspace.mp3";
    myAudio.play();
}

function mainRU() {
    let myAudio = new Audio;
    myAudio.src = "/sounds/mainRU.mp3";
    myAudio.play();
}
const KEYBOARD = {
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
        value: '',
        capsLock: false,
        checkShift: false,
        language: 'en'
    },
    init() {
        // Create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // Setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },
    _createKeys() {
        const fragment = document.createDocumentFragment();
        var keyLayout = [
            "lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
            "done", "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
            "voice", "space", "left", "right"
        ];

        // Create HTML for an icon
        const createIconHtml = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        };
        keyLayout.forEach((key, index) => {
            const keyElement = document.createElement('button');
            if (this.properties.language === 'en') {
                var insertLineBreak = ['backspace', ']', 'enter', '/'].indexOf(key) !== -1;
            } else {
                var insertLineBreak = ['backspace', 'ъ', 'enter', '.'].indexOf(key) !== -1
            }

            // Add attribute/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {
                case 'lang':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('language');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        if (this.properties.language === 'en') {
                            this.properties.language = 'ru';
                        } else {
                            this.properties.language = 'en';
                        }
                        this._toggleLanguage();
                    });

                    keyElement.setAttribute('onclick', 'playMain()');
                    break;

                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('backspace');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    keyElement.setAttribute('onclick', 'playBackspace()');
                    break;

                case 'caps':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    keyElement.innerHTML = createIconHtml('keyboard_capslock');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                    });

                    keyElement.setAttribute('onclick', 'playCaps()');
                    break;

                case 'enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('keyboard_return');
                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });

                    keyElement.setAttribute('onclick', 'playEnter()');
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHtml('space_bar');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });

                    keyElement.setAttribute('onclick', 'playSpace()');
                    break;

                case 'voice':
                    keyElement.classList.add('keyboard__key');
                    keyElement.innerHTML = createIconHtml('settings_voice');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        keyElement.classList.toggle('red');

                        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

                        var recognition = new SpeechRecognition();
                        recognition.interimResults = true;
                        recognition.lang = 'en-En';

                        recognition.addEventListener('result', e => {
                            const transcript = Array.from(e.results)
                                .map(result => result[0])
                                .map(result => result.transcript)
                                .join('');

                            const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');
                            this.properties.value += poopScript;
                        });

                        recognition.addEventListener('end', recognition.start);

                        recognition.start();
                    });

                    keyElement.setAttribute('onclick', 'playMain()');
                    break;

                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElement.innerHTML = createIconHtml('check_circle');

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        this.close();
                        this._triggerEvent('onclose');
                    });

                    keyElement.setAttribute('onclick', 'playOut()');
                    break;

                case 'shift':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('keyboard');
                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        keyElement.classList.add('keyboard__key--shift', this.properties.checkShift);
                        this._toggleShift();
                    });

                    keyElement.setAttribute('onclick', 'playShift()');
                    break;

                case 'left':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('west');
                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').selectionStart = document.getElementById('textarea').selectionEnd -= 1;
                        document.getElementById('textarea').focus();
                    });

                    keyElement.setAttribute('onclick', 'playMain()');
                    break;

                case 'right':

                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHtml('east');
                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').selectionStart = document.getElementById('textarea').selectionEnd += 1;
                        document.getElementById('textarea').focus();
                    });

                    keyElement.setAttribute('onclick', 'playMain()');
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener('click', () => {
                        document.getElementById('textarea').focus();
                        if (this.properties.language === 'en') {
                            if (this.properties.checkShift) {
                                switch (key) {
                                    case '1':
                                        this.properties.value += '!';
                                        break;
                                    case '2':
                                        this.properties.value += '@';
                                        break;
                                    case '3':
                                        this.properties.value += '#';
                                        break;
                                    case '4':
                                        this.properties.value += '$';
                                        break;
                                    case '5':
                                        this.properties.value += '%';
                                        break;
                                    case '6':
                                        this.properties.value += '^';
                                        break;
                                    case '7':
                                        this.properties.value += '&';
                                        break;
                                    case '8':
                                        this.properties.value += '*';
                                        break;
                                    case '9':
                                        this.properties.value += '(';
                                        break;
                                    case '0':
                                        this.properties.value += ')';
                                        break;
                                    case '[':
                                        this.properties.value += '{';
                                        break;
                                    case ']':
                                        this.properties.value += '}';
                                        break;
                                    case ';':
                                        this.properties.value += ':';
                                        break;
                                    case `'`:
                                        this.properties.value += '"';
                                        break;
                                    case ',':
                                        this.properties.value += '<';
                                        break;
                                    case '.':
                                        this.properties.value += '>';
                                        break;
                                    case '/':
                                        this.properties.value += '?';
                                        break;
                                    default:
                                        if (!this.properties.capsLock) {
                                            this.properties.value += key.toUpperCase();
                                        } else {
                                            this.properties.value += key.toLowerCase();
                                        }
                                        break;
                                }

                                for (let key of this.elements.keys) {
                                    switch (key.innerHTML) {
                                        case '!':
                                            key.textContent = '1';
                                            break;
                                        case '@':
                                            key.textContent = '2';
                                            break;
                                        case '#':
                                            key.textContent = '3';
                                            break;
                                        case '$':
                                            key.textContent = '4';
                                            break;
                                        case '%':
                                            key.textContent = '5';
                                            break;
                                        case '^':
                                            key.textContent = '6';
                                            break;
                                        case '&amp;':
                                            key.textContent = '7';
                                            break;
                                        case '*':
                                            key.textContent = '8';
                                            break;
                                        case '(':
                                            key.textContent = '9';
                                            break;
                                        case ')':
                                            key.textContent = '0';
                                            break;
                                        case '&lt;':
                                            key.textContent = ',';
                                            break;
                                        case '&gt;':
                                            key.textContent = '.';
                                            break;
                                        case '{':
                                            key.textContent = '[';
                                            break;
                                        case '}':
                                            key.textContent = ']';
                                            break;
                                        case ':':
                                            key.textContent = ';';
                                            break;
                                        case `"`:
                                            key.textContent = `'`;
                                            break;
                                        case '?':
                                            key.textContent = '/';
                                            break;
                                        default:
                                            if (key.childElementCount === 0) {
                                                if (this.properties.capsLock) {
                                                    key.textContent = key.textContent.toUpperCase();
                                                } else {
                                                    key.textContent = key.textContent.toLowerCase();
                                                }
                                            }
                                            break;
                                    }
                                    if (key.classList.contains('keyboard__key--shift')) key.classList.remove('keyboard__key--shift');
                                }
                                this.properties.checkShift = false;

                            } else {
                                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            }
                        } else if (this.properties.language === 'ru') {
                            var keyLayoutRU = [
                                "lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                                "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
                                "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
                                "done", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
                                "voice", "space"
                            ];
                            let nmbLetter = 0;

                            for (let i = 0; i < keyLayout.length; i++) {
                                if (keyLayout[i] === key) {
                                    nmbLetter = i;
                                }
                            }
                            if (this.properties.checkShift) {
                                switch (keyLayoutRU[nmbLetter]) {
                                    case '1':
                                        this.properties.value += '!';
                                        break;
                                    case '2':
                                        this.properties.value += '"';
                                        break;
                                    case '3':
                                        this.properties.value += '№';
                                        break;
                                    case '4':
                                        this.properties.value += ';';
                                        break;
                                    case '5':
                                        this.properties.value += '%';
                                        break;
                                    case '6':
                                        this.properties.value += ':';
                                        break;
                                    case '7':
                                        this.properties.value += '?';
                                        break;
                                    case '8':
                                        this.properties.value += '*';
                                        break;
                                    case '9':
                                        this.properties.value += '(';
                                        break;
                                    case '0':
                                        this.properties.value += ')';
                                        break;
                                    case '.':
                                        this.properties.value += ',';
                                        break;
                                    default:
                                        if (!this.properties.capsLock) {
                                            this.properties.value += keyLayoutRU[nmbLetter].toUpperCase();
                                        } else {
                                            this.properties.value += keyLayoutRU[nmbLetter].toLowerCase();
                                        }
                                        break;
                                }
                                for (let key of this.elements.keys) {
                                    switch (key.innerHTML) {
                                        case '!':
                                            key.textContent = '1';
                                            break;
                                        case '"':
                                            key.textContent = '2';
                                            break;
                                        case '№':
                                            key.textContent = '3';
                                            break;
                                        case ';':
                                            key.textContent = '4';
                                            break;
                                        case '%':
                                            key.textContent = '5';
                                            break;
                                        case ':':
                                            key.textContent = '6';
                                            break;
                                        case '?':
                                            key.textContent = '7';
                                            break;
                                        case '*':
                                            key.textContent = '8';
                                            break;
                                        case '(':
                                            key.textContent = '9';
                                            break;
                                        case ')':
                                            key.textContent = '0';
                                            break;
                                        case ',':
                                            key.textContent = '.';
                                            break;
                                        default:
                                            if (key.childElementCount === 0) {
                                                if (this.properties.capsLock) {
                                                    key.textContent = key.textContent.toUpperCase();
                                                } else {
                                                    key.textContent = key.textContent.toLowerCase();
                                                }
                                            }
                                            break;
                                    }
                                    if (key.classList.contains('keyboard__key--shift')) key.classList.remove('keyboard__key--shift');
                                }
                                this.properties.checkShift = false;

                            } else {
                                this.properties.value += this.properties.capsLock ? keyLayoutRU[nmbLetter].toUpperCase() : keyLayoutRU[nmbLetter].toLowerCase();
                            }
                        }
                        this._triggerEvent('oninput');
                    });

                    if (this.properties.language) {
                        keyElement.setAttribute('onclick', 'playMain()');
                    } else {
                        keyElement.setAttribute('onclick', 'playMainRU()');
                    }
                    break;
            }
            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }


        });

        return fragment;
    },
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },
    _toggleLanguage() {
        if (this.properties.language === 'ru') {
            var keyLayoutRU = [
                "lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
                "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
                "done", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
                "voice", "space"
            ];
            let i = 0;

            for (let key of this.elements.keys) {
                if (key.childElementCount === 0) {
                    key.textContent = keyLayoutRU[i];
                    i++;
                } else {
                    i++;
                }
            }
            i = 0;
        } else if (this.properties.language === 'en') {
            var keyLayoutEN = [
                "lang", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
                "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
                "done", "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
                "voice", "space"
            ];
            let i = 0;
            for (let key of this.elements.keys) {
                if (key.childElementCount === 0) {
                    key.textContent = keyLayoutEN[i];
                    i++;
                } else {
                    i++;
                }
            }
        }

    },
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    _toggleShift() {
        this.properties.checkShift = true;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if (this.properties.language === 'en') {
                    switch (key.innerHTML) {
                        case '1':
                            key.textContent = '!';
                            break;
                        case '2':
                            key.textContent = '@';
                            break;
                        case '3':
                            key.textContent = '#';
                            break;
                        case '4':
                            key.textContent = '$';
                            break;
                        case '5':
                            key.textContent = '%';
                            break;
                        case '6':
                            key.textContent = '^';
                            break;
                        case '7':
                            key.textContent = '&';
                            break;
                        case '8':
                            key.textContent = '*';
                            break;
                        case '9':
                            key.textContent = '(';
                            break;
                        case '0':
                            key.textContent = ')';
                            break;
                        case '[':
                            key.textContent = '{';
                            break;
                        case ']':
                            key.textContent = '}';
                            break;
                        case ';':
                            key.textContent = ':';
                            break;
                        case `'`:
                            key.textContent = '"';
                            break;
                        case ',':
                            key.textContent = '<';
                            break;
                        case '.':
                            key.textContent = '>';
                            break;
                        case '/':
                            key.textContent = '?';
                            break;
                    }
                } else {
                    switch (key.innerHTML) {
                        case '1':
                            key.textContent = '!';
                            break;
                        case '2':
                            key.textContent = '"';
                            break;
                        case '3':
                            key.textContent = '№';
                            break;
                        case '4':
                            key.textContent = ';';
                            break;
                        case '5':
                            key.textContent = '%';
                            break;
                        case '6':
                            key.textContent = ':';
                            break;
                        case '7':
                            key.textContent = '?';
                            break;
                        case '8':
                            key.textContent = '*';
                            break;
                        case '9':
                            key.textContent = '(';
                            break;
                        case '0':
                            key.textContent = ')';
                            break;
                        case '.':
                            key.textContent = ',';
                            break;
                    }
                }

                if (this.properties.capsLock) {
                    key.textContent = key.textContent.toLowerCase();
                } else {
                    key.textContent = key.textContent.toUpperCase();
                }
            }
        }
    },
    voice() {

    },
    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },
    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }
};
document.getElementById('textarea').onfocus = () => {
    document.addEventListener('keydown', function(event) {
        KEYBOARD.properties.value += event.key;
        let ARRAY = document.querySelectorAll('.keyboard__key');
        let INDEX;
        for (let i = 0; i < ARRAY.length; i++) {
            if (event.key.toLowerCase() == ARRAY[i].innerHTML.toLowerCase()) {
                ARRAY[i].classList.add('keyboard__key-fiz');
            }
        }
        switch (event.keyCode) {
            case 8:
                ARRAY[11].classList.add('keyboard__key-fiz');
                break;
            case 13:
                ARRAY[36].classList.add('keyboard__key-fiz');
                break;
            case 20:
                ARRAY[24].classList.add('keyboard__key-fiz');
                KEYBOARD._toggleCapsLock();
                ARRAY[24].classList.toggle('keyboard__key--active');
                break;
            case 16:
                ARRAY[38].classList.add('keyboard__key-fiz');
                break;
            case 32:
                ARRAY[50].classList.add('keyboard__key-fiz');
                break;
            case 37:
                ARRAY[51].classList.add('keyboard__key-fiz');
                break;
            case 39:
                ARRAY[52].classList.add('keyboard__key-fiz');
                break;
        }
    });
    document.addEventListener('keyup', function(event) {
        KEYBOARD.properties.value += event.key;
        let ARRAY = document.querySelectorAll('.keyboard__key');
        let INDEX;
        for (let i = 0; i < ARRAY.length; i++) {
            if (event.key.toLowerCase() == ARRAY[i].innerHTML.toLowerCase()) {
                ARRAY[i].classList.remove('keyboard__key-fiz');
            }
        }
        switch (event.keyCode) {
            case 8:
                ARRAY[11].classList.remove('keyboard__key-fiz');
                break;
            case 13:
                ARRAY[36].classList.remove('keyboard__key-fiz');
                break;
            case 16:
                ARRAY[38].classList.remove('keyboard__key-fiz');
                break;
            case 20:
                ARRAY[24].classList.remove('keyboard__key-fiz');
                break;
            case 32:
                ARRAY[50].classList.remove('keyboard__key-fiz');
                break;
            case 37:
                ARRAY[51].classList.remove('keyboard__key-fiz');
                break;
            case 39:
                ARRAY[52].classList.remove('keyboard__key-fiz');
                break;
        }
    });
};

function runOnKeys(func, ...codes) {
    let pressed = new Set();
    document.addEventListener('keydown', function(event) {
        pressed.add(event.code);

        for (let code of codes) {
            if (!pressed.has(code)) {
                return;
            }
        }
        pressed.clear();
        func();
    });
    document.addEventListener('keyup', function(event) {
        pressed.delete(event.code);
    });
};

runOnKeys(
    () => {
        KEYBOARD.properties.language = KEYBOARD.properties.language === 'ru' ? 'en' : 'ru';
        KEYBOARD._toggleLanguage();
    },
    "ShiftLeft",
    "AltLeft"
);

window.addEventListener('DOMContentLoaded', function() {
    KEYBOARD.init();
});