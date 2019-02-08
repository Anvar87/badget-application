var badgetControler = (function() {
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        })

        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        badget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
            

            if(type === 'exp') {
                newItem = new Expenses(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;

        },

        calculateBadget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            
            if(data.totals.inc > 0) {
                data.badget = data.totals.inc - data.totals.exp;
            } else {
                data.percentage = -1;
            }
            
        },

        getBadget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                badget: data.badget,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }

    }

})();


var UIControler = (function() {
    var DOMStrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        inputBtn: '.add__btn',
        incomContainer: '.income-list',
        expensesContainer: '.expenses-list'
    }

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }  
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMStrings.incomContainer;
                html = '<div class="item" id="income-%id%"><div class="item-description">%description%</div><div class="right">\
                <div class="item__value-income">+%value%</div><button class="item__delete-income">\
                <i class="ion-ios-close-outline"></i></button></div></div>'
            } 
            else if(type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item" id="expenses-%id%"><div class="item-description">%description%</div><div class="right">\
                <div class="item__value-expenses">-%value%</div><div class="item-expenses__percentage">45%</div>\
                <button class="item__delete-expenses"><i class="ion-ios-close-outline"></i></button></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            })

            fieldsArr[0].focus();

        },

        getDomStr: function() {
            return DOMStrings;
        }
    }



})();


var controler = (function(badgetCtrl, UICtrl) {

    var setupEventListener = function() {
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        var DOM = UICtrl.getDomStr();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    };

    var updateBadget = function() {
        badgetCtrl.calculateBadget()
        var budget = badgetCtrl.getBadget();
        console.log(budget);
    }


    var ctrlAddItem = function() {
        var input, newItem;
        input = UICtrl.getinput();
        if(input.description !== "" &  !isNaN(input.value) & input.value > 0) {
            newItem = badgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBadget();
        }
        
        
    };


    return {
        init: function() {
            return setupEventListener();
        }
    }


})(badgetControler, UIControler);


controler.init();