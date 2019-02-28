
var badgetControler = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.parcentage = -1;
    };

    Expense.prototype.calcPercentages = function(totalIncom) {
        if(totalIncom > 0) {
            this.parcentage = Math.round((this.value / totalIncom)* 100);
        } else {
            this.parcentage = -1;
        }
    };

    Expense.prototype.getPercentages = function() {
        return this.parcentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems : {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        badget: 0,
        percentage: -1
    };


    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
    
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBadget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.badget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)* 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentages(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentages();
            });
            return allPerc;
        },
        
        deletItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        getBadget: function() {
            return {
                badget: data.badget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        testing: function() {
            console.log(data);
        }
    }


})();


var UIControler = (function() {

    var DOMStrings = {
        inputBtn: '.add__btn',
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        incomeContainer: '.income-list',
        expensesContainer: '.expenses-list',
        incomeLable: '.budget-income__value',
        expensesLable: '.budget-expenses__value',
        badgetLable: '.budget-value',
        percentageLable: '.budget-expenses__percentage',
        container: '.container',
        expPercLable: '.item-expenses__percentage',
        dateLable: '.budget-title__month'

    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
         callback(list[i], i);
        }

    };

    return {

        getinput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item" id="inc-%id%"><div class="item-description">%description%</div><div class="right">\
                        <div class="item__value-income">%value%</div><button class="item__delete-income">\
                        <i class="ion-ios-close-outline"></i></button></div></div>';
            } else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item" id="exp-%id%"><div class="item-description">%description%</div><div class="right">\
                        <div class="item__value-expenses">%value%</div><div class="item-expenses__percentage">45%</div>\
                        <button class="item__delete-expenses"><i class="ion-ios-close-outline"></i></button></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deletListElement: function(selectorID) {
            var el = document.getElementById(selectorID);
            if(el) {
                el.parentNode.removeChild(el);
            }
            
        },
        

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();

        },

        displayBadget: function(obj) { 
            var type;

            obj.badget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.badgetLable).textContent = formatNumber(obj.badget, type);
            
            document.querySelector(DOMStrings.incomeLable).textContent = formatNumber (obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLable).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.totalInc > 0) {
                document.querySelector(DOMStrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLable).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
           var fields = document.querySelectorAll(DOMStrings.expPercLable);

           nodeListForEach(fields, function(current, index) {
               if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
               } else {
                    current.textContent = '---';
               }
                
           });
        },

        displayMonth: function() {
            var now, months, month, year;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLable).textContent = months[month] + ' ' + year;

        },

        changeType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            })

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },


        getDomStr: function() {
            return DOMStrings;
        }
    }

})();



var controler = (function(badgetCtrl, UICtrl) {

    var setupEventListener = function() {
        var DOM = UICtrl.getDomStr();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    }

    var updateBadget = function() {
        badgetCtrl.calculateBadget();
        var badget = badgetCtrl.getBadget();
        UICtrl.displayBadget(badget);
    };

    var updatePercentages = function() {
        // 1. calculate percentages
        badgetCtrl.calculatePercentages();
        // 2. read percentage from badget controler
        var percentage = badgetCtrl.getPercentages();

        // 3. Update UI with the new percentages
        UICtrl.displayPercentages(percentage);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        input = UICtrl.getinput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = badgetCtrl.addItem(input.type, input.description, input.value);
            UIControler.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBadget();
        };
        
        updatePercentages();
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            badgetCtrl.deletItem(type, ID);
        }
        UICtrl.deletListElement(itemID);
        updateBadget();

        updatePercentages();


    }

    return {
        init: function() {
            UICtrl.displayMonth();
            UICtrl.displayBadget({
                badget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1
            });
            setupEventListener();
        }
    }

})(badgetControler, UIControler);

controler.init();
