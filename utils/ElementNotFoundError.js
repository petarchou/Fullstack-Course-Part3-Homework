class ElementNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ElementNotFoundError';
    }
}

module.exports = ElementNotFoundError;