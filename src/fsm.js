class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config
        this.state = config.initial
        this.transitions = [this.state]
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (Object.keys(this.config.states).includes(state)) {
            this.state = state
            this.transitions.push(state)
        }
        else {
            throw new Error()
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (this.state !== undefined) {
            if (getDeepProp(this.config, this.state, event) !== undefined) {
                this.state = getDeepProp(this.config, this.state, event)
                this.transitions.push(this.state)
            }
            else {
                throw new Error()
            }
        }
        else {
            throw new Error()
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const result = []
        if (event === undefined) {
            return Object.keys(this.config.states)
        }
        else {
            Object.keys(this.config.states).forEach((e) => {
                getDeepProp(this.config, e, event) !== undefined ? result.push(e) : ""
            })
        }
        return result
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let flag = true
        if (this.transitions.length > 1) {
            this.transitions[this.transitions.indexOf(this.state) - 1] !== undefined ?
                this.state = this.transitions[this.transitions.indexOf(this.state) - 1] :
                flag = false
        }
        else {
            flag = false
        }
        return flag
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let flag = true
        if (this.transitions.length > 1) {
            this.transitions[this.transitions.lastIndexOf(this.state) + 1] !== undefined ?
                this.state = this.transitions[this.transitions.indexOf(this.state) + 1] :
                flag = false
        }
        else {
            flag = false
        }
        return flag
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.transitions = []
    }
}


const getDeepProp = (obj, state, event) => {
    return obj["states"][state]["transitions"][event]
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
