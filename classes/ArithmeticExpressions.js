class ArithmeticExpressions {
    constructor(channel) {
        this.channel = channel;
        const operators = ['+', '-', '*', '/', '^'];
        this.operator = operators[Math.floor(Math.random()*5)];
        this.nums = [];
        this.isResolved = false;
        switch (operators.indexOf(this.operator)){
            case 0:
                this.nums[0] = Math.floor(Math.random()*1000)
                this.nums[1] = Math.floor(Math.random()*1000)
                this.answer = this.nums[0] + this.nums[1]
                this.expression = `${this.nums[0]} ${this.operator} ${this.nums[1]} = ?`
                break;
            case 1:
                this.nums[0] = Math.floor(Math.random()*1000)
                this.nums[1] = Math.floor(Math.random()*1000)
                this.answer = this.nums[0] - this.nums[1]
                this.expression = `${this.nums[0]} ${this.operator} ${this.nums[1]} = ?`
                break;
            case 2:
                this.nums[0] = Math.floor(Math.random()*20+2)
                this.nums[1] = Math.floor(Math.random()*20+2)
                this.answer = this.nums[0] * this.nums[1]
                this.expression = `${this.nums[0]} ${this.operator} ${this.nums[1]} = ?`
                break;
            case 3:
                this.nums[1] = (Math.floor(Math.random()*100)/10).toFixed(1)
                this.nums[0] = this.nums[1] * Math.floor(Math.random()*20)
                this.answer = this.nums[0] / this.nums[1]
                this.expression = `${this.nums[0]} ${this.operator} ${this.nums[1]} = ?`
                break;
            case 4:
                this.nums[0] = Math.floor(Math.random()*25)
                this.expression = `${this.nums[0]}${this.operator}2 = ?`
                this.answer = Math.pow(this.nums[0], 2)
                break;
            default:
                this.nums[0] = Math.floor(Math.random()*1000)
                this.nums[1] = Math.floor(Math.random()*1000)
                this.answer = this.nums[0] + this.nums[1]
                this.expression = `${this.nums[0]} ${this.operator} ${this.nums[1]} = ?`
                break;
        }

        this.send()
    }

    async send() {
        this.message = await this.channel.send(this.expression)
    }
}

module.exports = ArithmeticExpressions;