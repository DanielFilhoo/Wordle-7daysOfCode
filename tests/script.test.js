const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function mockToastify() {
    return jest.fn().mockImplementation(() => ({
        showToast: jest.fn()
    }));
}

function unMockToastify() {
    global.Toastify.mockRestore();
}

describe('Wordle Clone', () => {
    let document;
    let dom;

    beforeEach(async () => {
        global.Toastify = mockToastify();

        const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;
        global.window = dom.window;
        global.document = dom.window.document;
    });

    afterEach(() => {
        unMockToastify();
    });

    test('should add letters to the guess and display them on the screen', () => {
        const key = document.querySelector('#keyboard button');
        key.click();
        expect(document.querySelector('.row:nth-child(1) .cell').textContent).toBe(key.textContent);
    });

    test('should delete the last letter when the backspace key is pressed', () => {
        const key = document.querySelector('#keyboard button');
        key.click();
        const backspace = document.querySelector("#keyboard button:nth-child(9)");
        backspace.click();
        expect(document.querySelector('.row:nth-child(1) .cell').textContent).toBe('');
    });

    test('should display a win notification', () => {
        window.showNotification("You guessed right! Game over!", "green");
        expect(global.Toastify).toHaveBeenCalled();
    });
});
