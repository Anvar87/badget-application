var badgetControler = (function() {
    var Expense = function(id, desccription, value) {
        this.id = id;
        this.desccription = desccription;
        this.value = value;
    }
    var Income = function(id, desccription, value) {
        this.id = id;
        this.desccription = desccription;
        this.value = value;
    }


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    }


    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].di + 1;
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

        testing: function() {
            console.log(data);
        }
    }
})();


var UIControler = (function() {
    var DOMStrings = {
        inputType: '.add-type',
        inputDes: '.add-description',
        inputValue: '.add-value',
        inputBtn: '.add__btn',
        incomeContainer: '.income-list',
        expensesContainer: '.expenses-list'
    }

    return {
        getinput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desccription: document.querySelector(DOMStrings.inputDes).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }   

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><div class="item-description">%descriptions%</div><div class="right">\
                <div class="item__value-income">+%value%</div><button class="item__delete-income">\
                <i class="ion-ios-close-outline"></i></button></div></div>'
            } else if(type == 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item" id="expenses-%id%"><div class="item-description">%descriptions%</div><div class="right">\
                <div class="item__value-expenses">-%value%</div><div class="item-expenses__percentage">45%</div>\
                <button class="item__delete-expenses"><i class="ion-ios-close-outline"></i></button></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%descriptions%', obj.desccription);
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearField: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDes + ',' + DOMStrings.inputValue);
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
        var DOM = UICtrl.getDomStr();
            document.querySelector(DOM.inputBtn).addEventListener('click', addItem);
            document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        })
    }
    
    var updatebadget = function() {

    }


    var addItem = function() {
        var input, newItem;

        input = UICtrl.getinput();

        if(input.desccription !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = badgetCtrl.addItem(input.type, input.desccription, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearField();
            updatebadget();
        }
        
        
    }

    return {
        init: function() {
            return setupEventListener();
        }
    }
    

})(badgetControler, UIControler);

controler.init();

