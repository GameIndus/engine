export namespace Key {
    export function fromCode(code: number): Key {
        return code;
    }

    export function fromName(name: string): Key {
        return Key.codeFromName(name);
    }

    export function codeFromName(name: string): number {
        return Key.fromName(name);
    }

    export function nameFromCode(code: number): string {
        return Key[Key.fromCode(code)];
    }

    export function toString(key: Key): string {
        return Key[key];
    }

    export function toCode(key: Key): number {
        return key;
    }
}

export enum Key {
    A = 65,
    ALT = 18,
    B = 66,
    BACKSPACE = 8,
    BACKWARD_SLASH = 220,
    C = 67,
    CAPS_LOCK = 20,
    CLEAR = 12,
    CLOSED_BRACKET = 221,
    COLON = 186,
    COMMA = 188,
    CONTROL = 17,
    D = 68,
    DELETE = 46,
    DOWN = 40,
    E = 69,
    EIGHT = 56,
    END = 35,
    ENTER = 13,
    EQUALS = 187,
    ESC = 27,
    F = 70,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    F13 = 124,
    F14 = 125,
    F15 = 126,
    FIVE = 53,
    FOUR = 52,
    G = 71,
    H = 72,
    HELP = 47,
    HOME = 36,
    I = 73,
    INSERT = 45,
    J = 74,
    K = 75,
    L = 76,
    LEFT = 37,
    M = 77,
    MINUS = 44,
    N = 78,
    NINE = 57,
    NUMPAD_0 = 96,
    NUMPAD_1 = 97,
    NUMPAD_2 = 98,
    NUMPAD_3 = 99,
    NUMPAD_4 = 100,
    NUMPAD_5 = 101,
    NUMPAD_6 = 102,
    NUMPAD_7 = 103,
    NUMPAD_8 = 104,
    NUMPAD_9 = 105,
    NUMPAD_ADD = 107,
    NUMPAD_DECIMAL = 110,
    NUMPAD_DIVIDE = 111,
    NUMPAD_ENTER = 108,
    NUMPAD_MULTIPLY = 106,
    NUMPAD_SUBTRACT = 109,
    NUM_LOCK = 144,
    O = 79,
    ONE = 49,
    OPEN_BRACKET = 219,
    P = 80,
    PAGE_DOWN = 34,
    PAGE_UP = 33,
    PERIOD = 190,
    PLUS = 43,
    Q = 81,
    QUESTION_MARK = 191,
    QUOTES = 222,
    R = 82,
    RIGHT = 39,
    S = 83,
    SEVEN = 55,
    SHIFT = 16,
    SIX = 54,
    SPACEBAR = 32,
    T = 84,
    TAB = 9,
    THREE = 51,
    TILDE = 192,
    TWO = 50,
    U = 85,
    UNDERSCORE = 189,
    UP = 38,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    ZERO = 48,
}
