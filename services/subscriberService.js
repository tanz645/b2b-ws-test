class SubscriberService {

    // private attributes
    #subscribers = 0;
    #timeoutSubscribe = 4000;
    #timeoutUnsubscribe = 8000;

    validMethods = ['Subscribe', 'Unscubscribe', 'CountSubscribers'];

    get subscribers() {
        return this.#subscribers;
    }

    isValidMethod(methodName) {
        return this.validMethods.includes(methodName)
    }

    handleMethod(methodName) {
        const methodHandlerMapping = {
            'Subscribe': this.#handleSubscribe.bind(this),
            'Unscubscribe': this.#handleUnsubscribe.bind(this),
            'CountSubscribers': this.#handleCountSubscibers.bind(this)
        }
        return methodHandlerMapping[methodName]()
    }

    #handleSubscribe() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.#addSubscriber();
                resolve({
                    type: "Subscribe",
                    status: "Subscribed",
                    updatedAt: Date()
                })
            }, this.#timeoutSubscribe)
        })
    }

    #handleUnsubscribe() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.#removeSubscriber();
                resolve({
                    type: "Unsubscribe",
                    status: "Unsubscribed",
                    updatedAt: Date()
                })
            }, this.#timeoutUnsubscribe)
        })
    }

    #handleCountSubscibers() {
        return Promise.resolve({
            type: "CountSubscribers",
            count: this.subscribers,
            updatedAt: Date()
        })
    }

    #addSubscriber() {
        this.#subscribers += 1
    }

    #removeSubscriber() {
        if (this.#subscribers > 0) {
            this.#subscribers -= 1
        }
    }
}

module.exports = SubscriberService