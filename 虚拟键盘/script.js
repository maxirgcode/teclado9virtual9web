
// 虚拟键盘配置
const keyboardLayout = [
    [
        {value: '`', shift: '~'},
        {value: '1', shift: '!'},
        {value: '2', shift: '@'},
        {value: '3', shift: '#'},
        {value: '4', shift: '$'},
        {value: '5', shift: '%'},
        {value: '6', shift: '^'},
        {value: '7', shift: '&'},
        {value: '8', shift: '*'},
        {value: '9', shift: '('},
        {value: '0', shift: ')'},
        {value: '-', shift: '_'},
        {value: '=', shift: '+'},
        {value: 'Backspace', type: 'function', span: 'col-span-2'}
    ],
    [
        {value: 'Tab', type: 'function', span: 'col-span-1'},
        {value: 'q', shift: 'Q'},
        {value: 'w', shift: 'W'},
        {value: 'e', shift: 'E'},
        {value: 'r', shift: 'R'},
        {value: 't', shift: 'T'},
        {value: 'y', shift: 'Y'},
        {value: 'u', shift: 'U'},
        {value: 'i', shift: 'I'},
        {value: 'o', shift: 'O'},
        {value: 'p', shift: 'P'},
        {value: '[', shift: '{'},
        {value: ']', shift: '}'},
        {value: '\\', shift: '|', span: 'col-span-1'}
    ],
    [
        {value: 'CapsLock', type: 'function', span: 'col-span-2'},
        {value: 'a', shift: 'A'},
        {value: 's', shift: 'S'},
        {value: 'd', shift: 'D'},
        {value: 'f', shift: 'F'},
        {value: 'g', shift: 'G'},
        {value: 'h', shift: 'H'},
        {value: 'j', shift: 'J'},
        {value: 'k', shift: 'K'},
        {value: 'l', shift: 'L'},
        {value: ';', shift: ':'},
        {value: "'", shift: '"'},
        {value: 'Enter', type: 'function', span: 'col-span-2'}
    ],
    [
        {value: 'Shift', type: 'function', span: 'col-span-3'},
        {value: 'z', shift: 'Z'},
        {value: 'x', shift: 'X'},
        {value: 'c', shift: 'C'},
        {value: 'v', shift: 'V'},
        {value: 'b', shift: 'B'},
        {value: 'n', shift: 'N'},
        {value: 'm', shift: 'M'},
        {value: ',', shift: '<'},
        {value: '.', shift: '>'},
        {value: '/', shift: '?'},
        {value: 'Shift', type: 'function', span: 'col-span-3'}
    ],
    [
        {value: 'Ctrl', type: 'function'},
        {value: 'Win', type: 'function'},
        {value: 'Alt', type: 'function'},
        {value: ' ', shift: ' ', span: 'col-span-6'},
        {value: 'Alt', type: 'function'},
        {value: 'Win', type: 'function'},
        {value: 'Menu', type: 'function'},
        {value: 'Ctrl', type: 'function'}
    ]
];

let isShiftPressed = false;
let isCapsLockOn = false;

// 初始化键盘
function initKeyboard() {
    const keyboardContainer = document.getElementById('virtualKeyboard');
    keyboardContainer.innerHTML = '';
    
    keyboardLayout.forEach(row => {
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = `key-btn flex items-center justify-center h-12 rounded-lg font-medium cursor-pointer
                ${key.type === 'function' ? 'bg-gray-300 text-gray-700' : 'bg-white text-gray-800 border border-gray-300'}
                ${key.span || 'col-span-1'}`;
            
            keyElement.textContent = key.value;
            keyElement.dataset.key = key.value;
            
            if (key.type !== 'function') {
                keyElement.classList.add('hover:bg-blue-50', 'active:bg-blue-100');
            }
            
            keyElement.addEventListener('click', () => handleKeyPress(key));
            keyboardContainer.appendChild(keyElement);
        });
    });
}

// 处理按键点击
function handleKeyPress(key) {
    const textDisplay = document.getElementById('textDisplay');
    
    switch(key.value) {
        case 'Backspace':
            textDisplay.textContent = textDisplay.textContent.slice(0, -1);
            break;
        case 'Enter':
            textDisplay.textContent += '\n';
            break;
        case 'CapsLock':
            isCapsLockOn = !isCapsLockOn;
            updateKeyStyles();
            break;
        case 'Shift':
            isShiftPressed = !isShiftPressed;
            updateKeyStyles();
            break;
        case 'Tab':
            textDisplay.textContent += '    ';
            break;
        default:
            const char = getDisplayChar(key);
            textDisplay.textContent += char;
            if (isShiftPressed && key.value !== ' ') {
                isShiftPressed = false;
                updateKeyStyles();
            }
    }
    
    // 滚动到底部
    textDisplay.scrollTop = textDisplay.scrollHeight;
}

// 获取显示字符
function getDisplayChar(key) {
    if (isShiftPressed && key.shift) {
        return key.shift;
    } else if (isCapsLockOn && key.value.length === 1 && key.value.match(/[a-z]/)) {
        return key.value.toUpperCase();
    }
    return key.value;
}

// 更新按键样式
function updateKeyStyles() {
    document.querySelectorAll('.key-btn').forEach(btn => {
        if (btn.dataset.key === 'Shift') {
            btn.classList.toggle('bg-blue-500', isShiftPressed);
            btn.classList.toggle('text-white', isShiftPressed);
        }
        if (btn.dataset.key === 'CapsLock') {
            btn.classList.toggle('bg-blue-500', isCapsLockOn);
            btn.classList.toggle('text-white', isCapsLockOn);
        }
    });
}

// 物理键盘支持
document.addEventListener('keydown', (e) => {
    const textDisplay = document.getElementById('textDisplay');
    
    if (e.key === 'Backspace') {
        textDisplay.textContent = textDisplay.textContent.slice(0, -1);
        e.preventDefault();
    } else if (e.key === 'Enter') {
        textDisplay.textContent += '\n';
    } else if (e.key === 'Tab') {
        textDisplay.textContent += '    ';
        e.preventDefault();
    } else if (e.key.length === 1) {
        textDisplay.textContent += e.key;
    }
    
    // 处理特殊按键状态
    if (e.key === 'Shift') {
        isShiftPressed = true;
        updateKeyStyles();
    }
    if (e.key === 'CapsLock') {
        isCapsLockOn = !isCapsLockOn;
        updateKeyStyles();
    }
    
    textDisplay.scrollTop = textDisplay.scrollHeight;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        isShiftPressed = false;
        updateKeyStyles();
    }
});

// 清空文本
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('textDisplay').textContent = '';
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initKeyboard();
});