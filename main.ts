let moneyMade = { dollars: 0, cents: 0 }

// FUNCTION TESTS ======================================
console.log("tests, ignore. =======================")
console.log(timeStr(0))
console.log(timeStr(0.25))
console.log(timeStr(0.5))
console.log(timeStr(0.75))
console.log(timeStr(1))
console.log(timeStr(7.5))
makeMoney(1, 0)
printMoney()
takeMoney(15, 0)
printMoney()
makeMoney(20, 15)
printMoney()
makeMoney(0, 99)
printMoney()
takeMoney(0, 85)
printMoney()
console.log("end tests ============================\n\n\n\n")
waitClear();
// INTRODUCTION ========================================
let ans: string | undefined = undefined

while (ans !== "y" && ans !== "yes") {
    if (ans) console.log("You really should read it.");
    ans = prompt("You see a sticky note. Read it? (y/n)")?.toLowerCase();
}

console.log(`
Welcome to the pet store! Happy first day!!!
You got here at noon like I told you, right?
Please clock out before 8pm or I will get in trouble.
The store takes about 15 minutes to walk across, I find
that I can only do about four tasks an hour.
Customers come in about once an hour.
Sorry I couldn't make it on your first day,
bad stomach bug. I think you can figure it out on your own!
See you tomorrow and good luck.

- Boss
`)

waitClear();

// INVENTORY ============================================
// Current status of game items

type Dictionary<T = any> = {
  [key: string]: T;
};
export type Stock = { name: string, alive: boolean, fed: number };

let tanksLastCleaned = 0;
let floorLastCleaned = 0;
let aisleLastOrganized = 0;
let payDock = 0;
let hour = 0;

let inventory: Dictionary<Stock> = {
    // Fishes
    g: {
        name: "[G]oldfish",
        alive: true,
        fed: 0,
    } as Stock,
    s: {
        name: "[S]nail",
        alive: true,
        fed: 0,
    } as Stock,
    m: {
        name: "[M]ini Seahorse",
        alive: true,
        fed: 0,
    } as Stock,

    // Plants
    u: {
        name: "S[u]cculent",
        alive: true,
        fed: 0,
    } as Stock,
    t: {
        name: "[T]ulip",
        alive: true,
        fed: 0,
    } as Stock,
    v: {
        name: "[V]ine",
        alive: true,
        fed: 0,
    } as Stock,
}

// CUSTOMERS ============================================
export type Customer = {
    name: string,
    dialog: string,
    accepts: string[],
    yayDialog: string, // if you provide an item from accepts[] and it's alive
    booDialog: string, // if you fail
    yayCallback?: Function,
    booCallback?: Function,
}

const customers: Customer[] = [
    { // 12:30
        name: "Shelby",
        dialog: "I'm looking for an easy fish for my daughter?",
        accepts: ["g"],
        yayDialog: "Wow, pretty. Thank you.",
        yayCallback: () => {makeMoney(4, 95)},
        booDialog: "I'm not so sure.",
    },
    { // 1:30
        name: "James",
        dialog: "Hi, do you have snacks here?",
        accepts: ["s"],
        yayDialog: "Yum! Escargot!",
        yayCallback: () => {makeMoney(6, 49)},
        booDialog: "What, I can't eat that! Goodbye.",
    },
    { // 2:30
        name: "Krista",
        dialog: "Do you have a plant I don't need to water often?",
        accepts: ["u"],
        yayDialog: "This is great! Thank you very much",
        yayCallback: () => {makeMoney(9, 95)},
        booDialog: "Eeek! That sounds like a lot of work!",
    },
    { // 3:30
        name: "Dee",
        dialog: "Is there anything that can cover my walls? I keep telling my husband the brick is ugly.",
        accepts: ["g"],
        yayDialog: "Yes, this will work. MIKE! I FOUND SOMETHING!!! ... Thank you. Goodbye.",
        yayCallback: () => {makeMoney(8, 95)},
        booDialog: "I'm not so sure.",
    },
    { // 4:30
        name: "Mike",
        dialog: "I hate pet stores.",
        accepts: ["t"],
        yayDialog: "This... *sniffle*... reminds me of my mother. Have all of my cash! *sniffle* I have to go *sobbing*",
        yayCallback: () => {makeMoney(20, 0)},
        booDialog: "I still hate pet stores. Give me your money.",
        booCallback: () => {takeMoney(20, 0)}
    },
    { // 5:30
        name: "Dale",
        dialog: "Do you have any cool looking fish",
        accepts: ["m"],
        yayDialog: "This is awesome. I'm gonna go build an epic tank for it.",
        yayCallback: () => {makeMoney(14, 59)},
        booDialog: "Laaaame. Good-bye.",
    },
    { // 6:30
        name: "Lexy",
        dialog: "Is it OK if I put any of these fish in a regular cup?",
        accepts: ["g", "s", "m"],
        yayDialog: "Thanks.\n\n( You should not have sold them a fish )",
        yayCallback: () => {payDock++},
        booDialog: "Ugh. You pet store employees are such jerks. Who cares, they are just fish.\n\n( You made the right call )",
    },
    { // 7:30
        name: "Dr. Horton",
        dialog: "I would like any living creature. For... science.",
        accepts: ["g","s","m","u","t","v"],
        yayDialog: "Yes. This will do.",
        yayCallback: () => {makeMoney(5, 99)},
        booDialog: "Mmmm. I suppose I will revive one of these dead ones like doctor Frankenstein! Great idea, have a big tip.",
        booCallback: () => {makeMoney(8, 49)},
    },
]

// MAIN GAME LOOP =======================================

while (hour < 8) {
    console.log("\n\n===\nThe clock says " + timeStr(hour));
    printInventory();
    printMoney();

    // Events/surprises ====
    if (hour - floorLastCleaned > 2) console.log("The floor stinks.");
    if (hour - floorLastCleaned > 3) payDock++;
    if (hour - tanksLastCleaned > 2) console.log("The fish tanks stink.");
    if (hour - tanksLastCleaned > 3) payDock++;
    if (hour - tanksLastCleaned > 4) {
        console.log("The fish have died due to unclean tanks.");
        inventory.g.alive = false;inventory.s.alive = false;inventory.m.alive = false;
    };
    if (hour - floorLastCleaned > 1) console.log("The aisles are uneven.");
    if (hour - floorLastCleaned > 2) console.log("Actually, the aisles are a total mess.");
    if (hour - floorLastCleaned > 3) payDock++;
    // end events ==========

    if (hour - Math.floor(hour) == 0.5) {
        // Deal with customer!
        console.log("A customer walks up.\n");
        const customer = customers[Math.floor(hour)];
        console.log(`${customer.name}: ${customer.dialog}`);
        let itemGiven = prompt("Offer them an item by letter (or X to skip): ") ?? ""
        itemGiven = itemGiven.toLowerCase();
        if (isValidItem(itemGiven) && customer.accepts.includes(itemGiven)) {
            console.log(`${customer.name}: ${customer.yayDialog}`);
            customer.yayCallback != undefined ? customer.yayCallback() : undefined;
        } else {
            console.log(`${customer.name}: ${customer.booDialog}`);
            customer.booCallback != undefined ? customer.booCallback() : undefined;
        }
    } else {
        console.log("")
        // Do a task!
        let task: string = "";
        const validTasks = ["f", "t", "l", "o", "p"];

        console.log(`
You may:
- [F]eed or water fish and plants
- Clean the fish [t]anks
- Clean the f[l]oor
- [O]rganize the aisles
- [P]lay on your phone
`)
        while (!validTasks.includes(task)) {
            if (task != "") console.log("You wave your arms, looking confused.")
            task = prompt("What to do: ") ?? ""
        }
        task = task?.toLowerCase() ?? "";
        if (task == "f") {
            let stock = prompt("Which to feed or water: ") ?? "";
            stock = stock.toLowerCase();
            if (isValidItem(stock)) {
                inventory[stock].fed += 1;
            }
        }
        if (task == "t") {
            tanksLastCleaned = hour;
        }
        if (task == "l") {
            floorLastCleaned = hour;
        }
        if (task == "o") {
            aisleLastOrganized = hour;
        }
        if (task == "p") {
            payDock++;
        }
    }

    // Fish/plant feeding and watering
    if (inventory.g.alive && inventory.g.fed > 3) {
        console.log("Goldfish was overfed and died.");
        inventory.g.alive = false;
    }
    if (inventory.s.alive && inventory.s.fed > 1) {
        console.log("Snail was overfed and died.");
        inventory.s.alive = false;
    }
    if (inventory.m.alive && inventory.m.fed > 6) {
        console.log("Mini Seahorse was overfed and died.");
        inventory.m.alive = false;
    }
    if (inventory.u.alive && inventory.u.fed > 1) {
        console.log("Succulent was overwatered and died.");
        inventory.u.alive = false;
    }
    if (inventory.t.alive && inventory.t.fed > 9) {
        console.log("Tulip was overwatered and died.");
        inventory.t.alive = false;
    }
    if (inventory.v.alive && inventory.v.fed > 9) {
        console.log("Vine was overwatered and died.");
        inventory.v.alive = false;
    }


    if (inventory.g.alive && hour > 4 && inventory.g.fed < 1) {
        console.log("Goldfish was hungry and died.");
        inventory.g.alive = false;
    }
    if (inventory.s.alive && hour > 6 && inventory.s.fed < 1) {
        console.log("Snail was hungry and died.");
        inventory.s.alive = false;
    }
    if (inventory.m.alive && hour > 4 && inventory.m.fed < 1) {
        console.log("Mini Seahorse was hungry and died.");
        inventory.m.alive = false;
    }
    if (inventory.m.alive && hour > 7 && inventory.m.fed < 2) {
        console.log("Mini Seahorse was hungry and died.");
        inventory.m.alive = false;
    }
    if (inventory.t.alive && hour > 5 && inventory.t.fed < 1) {
        console.log("Tulip was thirsty and died.");
        inventory.t.alive = false;
    }
    if (inventory.v.alive && hour % 2 == 0 && inventory.v.fed < hour/2) {
        console.log("Vine was thirsty and died.");
        inventory.v.alive = false;
    }

    waitClear();
    hour += 0.25;
}

console.log("\n===\n\nAnd with that, your shift is over...\n\n")

// SUBROUTINES ==========================================

function timeStr(hr: number): string {
    const flr = Math.floor(hr);
    let fullhr = flr;
    if (fullhr == 0) fullhr = 12;
    let mins: any = Math.floor(60.0 * (hr - flr));
    if (mins == 0) mins = "00"
    return `${fullhr}:${mins} p.m.`;
}

function makeMoney(dollars: number, cents: number) {
    cents = Math.floor(cents);
    dollars = Math.floor(dollars);
    if (cents > 99) console.log("make money error A")
    if (cents < 0) console.log("make money error B")
    if (dollars < 0) console.log("make money error C")
    moneyMade.cents += cents;
    while (moneyMade.cents > 99) {
        moneyMade.cents -= 100;
        moneyMade.dollars += 1;
    }
    moneyMade.dollars += dollars;

    let centsp: string = "" + cents;
    if (cents < 10) centsp = "0" + centsp;
    console.log(`You made ${"$"}${dollars}.${centsp}`)
}

function takeMoney(dollars: number, cents: number) {
    cents = Math.floor(cents);
    dollars = Math.floor(dollars);
    if (cents > 99) console.log("take money error A")
    if (cents < 0) console.log("take money error B")
    if (dollars < 0) console.log("take money error C")
    moneyMade.cents -= cents;
    while (moneyMade.cents < 0) {
        moneyMade.cents += 100;
        moneyMade.dollars -= 1;
    }
    moneyMade.dollars -= dollars;
}

function printMoney() {
    let cents: string = "" + moneyMade.cents;
    if (moneyMade.cents < 10) cents = "0" + cents;
    console.log(`You have ${"$"}${moneyMade.dollars}.${cents} in your wallet.`)
}

function printInventory() {
    console.log("STORE INVENTORY:")
    for (const inv of Object.values(inventory)) {
        if (inv.alive) {
            console.log(inv.name);
        }
    }
}

function isValidItem(item: string | null | undefined): boolean {
    if (item == null || item == undefined) {
        return false;
    }
    if (Object.keys(inventory).includes(item.toLowerCase())) {
        if (inventory[item.toLowerCase()].alive) {
            return true;
        }
    }
    return false;
}

function waitClear() {
    prompt("\n\nPress enter to continue.");
    console.clear();
}

// GAME FINISH ==============================================
const end = Date.now() + 1_000;
while (Date.now() < end);
console.log(`
             ___________
            '._==_==_=_.'
            .-\:      /-.
           | (|:.     |) |
            '-|:.     |-'
              \::.    /
               '::. .'
                 ) (
               _.' '._
              '"""""""'
YOU FINISHED THE JOB! CONGRATULATIONS!
Your stats:

        `)
if (payDock != 0) {
    console.log("You were docked $" + payDock + " at the end of the day for not doing your job.");
    takeMoney(payDock, 0);
}
printInventory();
printMoney();
console.log("\n\n\n\nThank you for playing!")
