// Variables declarations
const readline = require('readline');
const figlet = require('figlet');
const chalk = require('chalk');
const Table = require('cli-table');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Assistand> '
});
let commandWords = [];
let plants = [];
let plots = [];
let bal = 1;
let onFarm;
let location;

// Classes declaration
class Plant {
    constructor(name, price, growRate, sellingPrice){
        this.name = name;
        this.price = price;
        this.growRate = growRate;
        this.sellingPrice = sellingPrice;
        this.seedsOwned = 0;
        this.prpductOwned = 0;
        this.growProgress = 0;
    }
    getName(){
        return this.name;
    }
    getPrice(){
        return this.price;
    }
    getGrowRate(){
        return this.growRate;
    }
    addSeeds(amount){
        this.seedsOwned += amount;
    }
    addProducts(amount){
        this.prpductOwned += amount;
    }
    addProgress(percentage) {
        this.growProgress += percentage;
    }
}
class Plot {
    constructor(name, slots){
        this.name = name;
        this.slots = slots;
        this.planted = [];
    }
    getName() {
        return this.name;
    }
    getSlots() {
        return this.slots;
    }
    addPlanted(plant) {
        this.planted.push(plant);
    }
    getAmountPlanted(){
        return this.planted.length;
    }
    getSlotsOver(){
        return this.getSlots() - this.getAmountPlanted();
    }
}

const plot1 = new Plot('plot 1', 9);
plots.push(plot1);
const plotsLen = plots.length;

const bush = new Plant('bush', 5, 10, 50);
const corn = new Plant('corn', 1, 5, 7);
plants.push(bush);
plants.push(corn);
const pLen = plants.length;

showFarm();
MenuStart();

//Functions declarations
function MenuStart() {
    rl.prompt();

    rl.on('line', (line) => {
        line = line.trim().toLowerCase();
        commandWords = line.split(' ');
        switch (commandWords[0]) {
            case 'help':
                showHelp();
                break;
            case 'exit':
                rl.close();
                break;
            case 'buy':
                buy(commandWords[1], commandWords[2]);
                break;
            case 'shop':
                showShop();
                break;
            case 'farm':
                showFarm();
                break;
            case 'plot':
                showPlot('plot ' + commandWords[1]);
                break;
            case 'plant':
                plant(commandWords[1], commandWords[2]);
                break;
            case 'sleep':
                sleep();
                break;
            case 'harvest':
                harvest(commandWords[1]);
                break;
            case 'sell':
                sell(commandWords[1], commandWords[2]);
                break;
            default:
                console.log(`I dont understand you. I might have heard '${line}'. Use help if you are stuck`);
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });
}

function showTitle() {
    console.clear();
    console.log(
        chalk.yellow(
            figlet.textSync(location, { horizontalLayout: 'full' })
        )
    );
}

function showHelp() {
    console.log('-------------------------------------');
    console.log('help: Shows all the comments and their functions');
    console.log('exit: Exit the game');
    console.log('buy "item" "amount": If you are in the shop you can buy items with this comment');
    console.log('shop: Travels you to the shop');
    console.log('farm: Travels you to the farm');
    console.log('plot X: Travels you to plot x');
    console.log('plant "item" "amount": If you are on a plot you can plant seeds you have in storage.');
    console.log('sleep: You go to bed.');
    console.log('harvest x: Harvest a product on slot x');
    console.log('sell "item" "amount": sells items.')
    console.log('-------------------------------------');
}

function buy(product, amount) {
    console.clear();
    showShop();
    if(onFarm){
        console.log('You need to be in the shop to be able to buy!');
        return;
    }
    if(product === undefined){
        console.log('Buy what?');
        return;
    }
    let checker = false;
    for(let i = 0; i < pLen; i++){
        const pName = plants[i].getName();
        const pPrice = plants[i].getPrice() * amount;
        if(pName === product){
            checker = true;
            if(pPrice > bal){
                console.log('You dont have enough money!');
            }
            else {
                bal -= (plants[i].getPrice());
                plants[i].addSeeds(parseInt(amount));
                showShop();
                console.log('You bought the ' + pName);
            }
        }
    }
    if(!checker){
        console.log('That plant does not exist.')
    }
}

function showFarm() {
    location = 'farm';
    showTitle();
    console.log('Balance: ' + bal);
    showStorage();
    const plotTable = new Table({
       head: ['Plot', 'Slots over'],
       colWidths: [10, 15]
    });
    for(let i = 0; i < plotsLen; i++){
        const name = plots[i].getName();
        const slotsOver = plots[i].getSlotsOver();
        plotTable.push([name, slotsOver]);
    }
    console.log(plotTable.toString());
}

function showShop() {
    location = 'shop';
    showTitle();
    console.log('Balance: ' + bal);
    showStorage();
    const shopTable = new Table({
       head: ['Name', 'Price'],
       colWidths: [10, 10]
    });
    console.log('-------------------------------------');
    for(let i = 0; i < pLen; i++){
        const name = plants[i].name;
        const price = plants[i].price;
        shopTable.push([name, price]);
    }
    console.log(shopTable.toString());
    console.log('-------------------------------------');
}

function showPlot(plot) {
    let exists = false;
    for(let i = 0; i < plotsLen; i++){
        const plotIndex = i;
        const name = plots[i].getName();
        const amountPlanted = plots[i].getAmountPlanted();
        if(plot === name){
            location = name;
            exists = true;
            showTitle();
            showStorage();
            const slotsTable =  new Table({
                head: ['Total slots', 'In use', 'Left over']
            });
            const plotTable = new Table({
                head: ['Slot', 'Plant', 'Progress']
            });
            slotsTable.push([plots[i].slots, amountPlanted, plots[i].getSlotsOver()]);
            for(let i = 0; i < amountPlanted; i++){
                const plant = plots[plotIndex].planted[i];
                plotTable.push([i, plant.name, (plant.growProgress + '%')]);
            }
            console.log(slotsTable.toString());
            console.log(plotTable.toString());
        }
    }
    if(!exists){
        console.log('This plot does not exist.');
    }
}

function showStorage() {
    console.log('-------------------------------------');
    const table = new Table({
        head: ['Name', 'Grow rate', 'Seeds owned', 'Harvest']
        , colWidths: [10, 15, 15, 15]
    });
    for(let i = 0; i < plants.length; i++){
        const name = plants[i].name;
        const growRate = plants[i].growRate;
        const seeds = plants[i].seedsOwned;
        const products = plants[i].prpductOwned;
        table.push([name, growRate, seeds, products]);
    }
    console.log(table.toString());
    console.log('-------------------------------------');
}

function plant(seed, amount) {
    let x = location.split(' ');
    const plotIndex = x[1] - 1;
    let checker = false;
    if(x[0] !== 'plot'){
        console.log('You are not on a plot');
        return;
    }
    if(seed === undefined){
        console.log('What do you want to plant?');
        return;
    }
    if(amount === undefined || isNaN(amount)) {
        console.log('Fill in the amount of seeds you want to plant.');
        return;
    }
    if(amount > plots[plotIndex].getSlotsOver()){
        console.log('There are not enough slots in this plot try to plant less');
        return;
    }
    for(let i = 0; i < plants.length; i++) {
        if(seed === plants[i].name){
            checker = true;
            if(amount > plants[i].seedsOwned){
                console.log('You dont have enough seeds');
                return;
            }
            for(let x = 0; x < amount; x++) {
                plants[i].seedsOwned--;
                plots[plotIndex].addPlanted(plants[i]);
            }
            showPlot(location);
            if(!checker){
                console.log("That plant does not exist!");
            }
        }

    }
}

function harvest(plotSlot) {
    let x = location.split(' ');
    const plotIndex = x[1] - 1;
    const plot = plots[plotIndex];
    console.log(plot.planted.length)

    if(x[0] !== 'plot'){
        console.log('You are not on a plot. So you cant harvest a thing');
        return;
    }
    if(plotSlot === undefined || isNaN(plotSlot)){
        console.log('Harvest what?');
        return;
    }
    if(plotSlot > plot.slots){
        console.log('This plot does not have so much slots');
        return;
    }
    if((plotSlot) >= plot.planted.length){
        console.log('That slot is not filled.');
        return;
    }
    if(plotSlot < 0){
        console.log('I wish we could harvest negativity');
        return;
    }
    if(plot.planted[plotSlot].growProgress !== 100){
        console.log('This product is not ready for harvest');
        return;
    }
    const name = plot.planted[plotSlot].name;
    for(let i = 0; i < plants.length; i++){
        if(name === plants[i].name){
            plants[i].addProducts(1);
        }
    }
    plot.planted.splice(plotSlot, 1)
    showPlot(location);
}

function sell(product, amount) {
    let checker = false;
    if(product === undefined){
        console.log('Sell what now?');
        return;
    }
    if(amount === undefined || isNaN(amount)){
        console.log('Give a valid amount you want to sell.');
        return;
    }
    for(let i = 0; i < plants.length; i++){
        if(plants[i].name === product){
            if(amount > plants[i].prpductOwned){
                console.log('You do not own that much.')
                return
            }
            plants[i].prpductOwned -= amount;
            const profit = amount * plants[i].sellingPrice;
            bal += profit;
            console.log('You sold ' + amount + ' ' + plants[i].name + ' for: $' + profit);
            checker = true;
        }
    }
    if(!checker){
        console.log('This plant does not exist.');
    }
    showFarm();
}

function sleep() {
    if(location !== 'farm'){
        console.log('You can only sleep at the farm');
        return;
    }
    for(let i = 0; i < plots.length; i++){
        const plotIndex = i;
        for( let x = 0; x < plots[plotIndex].planted.length; x++){
            const plant = plots[plotIndex].planted[x];
            const percentage = (1 / plant.getGrowRate()) * 100;
            if(plant.growProgress < 100){
                plant.addProgress(percentage);
            }
        }
    }
    showFarm();
}