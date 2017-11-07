const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Assistand> '
});
let commandWords = [];
let plants = [];
let bal = 0;


class plant {
    constructor(name, price){
        this.name = name;
        this.price = price;
    }
    getName(){
        return this.name;
    }
    getPrice(){
        return this.price;
    }
}
const bush = new plant('Bush', 5);

plants.push(bush);

const pLen = plants.length;

getStats();
MenuStart();

function MenuStart() {
    rl.prompt();

    rl.on('line', (line) => {
        line = line.trim();
        commandWords = line.split(' ');
        switch (commandWords[0]) {
            case 'hello':
                console.log('world!');
                break;
            case 'close':
                rl.close();
                break;
            case 'bal':
                bal += 5;
                getStats();
                break;
            case 'buy':
                buy(commandWords[1]);
                break;
            default:
                console.log(`Say what? I might have heard '${line}'`);
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });
}

function getStats() {
    console.log('Balance: ' + bal);
}

function buy(plant) {
    console.clear();
    let checker = false;
    for(let i = 0; i < pLen; i++){
        const pName = plants[i].getName();
        const pPrice = plants[i].getPrice();
        if(pName === plant){
            checker = true;
            if(pPrice > bal){
                console.log('You dont have enough money!');
            }
            else {
                bal -= bush.getPrice();
                console.log('You baught the ' + pName);
            }
        }
    }
    if(!checker){
        console.log('That plant does not exist.')
    }
    getStats();
}