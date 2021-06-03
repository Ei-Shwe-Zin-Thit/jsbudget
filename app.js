//BUDGET CONTROLLER
var budgetController = (function(){
   //create id for buy car,salary-must be unique,caz we dont have db,we use obj(description,value,+-)-obj twy amyr kyi yay ya tr ma ok lo con.obj pl sout,d ka nay instance sout
 var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }//instance obj aloke loke tr ti chin yin console mhr var exp = new Expense(1,'test',2)lo yite
 Expense.prototype.calculatePercentage = function(totalIncome){
     if(totalIncome > 0){
         this.percentage = Math.round((this.value / totalIncome )* 100);
     }else{
         this.percentage = -1;
     }//calculate prototype
 }
 Expense.prototype.getPercentage = function(){
     return this.percentage;//(for return) ans from if else
 }
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }//con.obj
    //income,exp obj are kept in array
    var data = {
        //    var allExpenses = [];//item 2 khu ui mhr kwal lo kwal p assign ya tr
//    var allIncomes = [];
//    var totalExpense = 0;//ui mhr in,ex ko + htr lo assign lote
//    var totalIncome = 0;
        allItems : {//2.ds
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1//all is income so yin per ka 0 ma lo tu loMaya -1 pay=per dont exist
    }
    var calculateTotal = function(type){//for calculating total of income and expanse
        var sum = 0;
        data.allItems[type].forEach(function(cur){
           sum += cur.value;
                 
        })//ex,in twy phan p +,cur htal mhr value twy win lr tr ko loop nae +
  
        data.totals[type] = sum;
    }
    return{//controller ka send tae data ko u phoe
        addItem : function(type,des,val)//income,ex,why=para3 khu pr(balout hwet lal so tr)-p yin alote lote ag con sout
        {
//            var incomeNewItem = new Income(ID,des,val);//income type yin income con ka alote lote
//            var expenseNewItem = new Expense(ID,des,val);
            var newItem,ID;//check value in or ex
            //ID = 0;//kyo thet mhat2.item ya yin ds htal mhr keep
            //takal ka id u phoe so yin
            //Create new id
            if(data.allItems[type].length > 0 ){
                 ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }else{
                ID = 0;
            }
           
            //create new item base inc or exp
            if(type === 'inc'){//check income or exp
                newItem = new Income(ID,des,val);
            }else if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }
           //PUsh it into our ds
        data.allItems[type].push(newItem);//dynamic phyit ag loke pay
            return newItem;//new item ko tachr module ka hlan use lo ya ag =return new element
        },
        deleteItem : function(type,id){
            //check in or ex 2.select id
            //id = 6
            //index = 3=so tw new array sout
//            [1 2 4 6 8]
//            data.allItems[exp][3]
            var ids = data.allItems[type].map(function(current){
                return current.id;//map ka type mhr shi tamya data ko array anay nae htoke p return 2 ko pr u twr tl
           
                 })
                
            var index = ids.indexOf(id);//element yaae index 6ko del chin lo
            if(index !== -1){
                data.allItems[type].splice(index,1);//index htal ka element 1lone ko del
            }
        },
        calculateBudget : function(){
            //1. calculate total income and total expense
            calculateTotal('exp');
            calculateTotal('inc');
            //2.calculate budget : income - expanse
            data.budget = data.totals.inc - data.totals.exp;//inc htal ka exp ko - ya tr
            //3.calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);//exp = 100 inc =200 spend =50%;100/200=.5*100-income ma htae yin
            }else{
                data.percentage = -1;//income ma htae pl ex pl htae yin console mhr infinity pya lo error pyin tr(if else nae)
            }
            
        },
        getBudget : function(){//for return budget in controller(many values malo obj nae return pr)
            return{
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },
        calculatePercentage : function(){
//            a = 20
//            b = 10
//            c = 40
//            total income = 100
//            a = 20/100 = 20%
//            b = 10/100 = 10%
//            c = 40/100 = 40%
            data.allItems.exp.forEach(function(cur){//for calculating only exp,anyo fun ka loop pat tr r lone ko return pyn lo cur ko phan
                cur.calculatePercentage(data.totals.inc);
            })
        },
        getPercentage : function(){
            //twat htr tae value twy ko phan phoe
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            })
            return allPerc;
        },
       
        test : function(){
            return data.allItems;
        }
        //putted inputs are in private budCon so u need to write public method
//        testing : function(){
//        console.log(data);//->data htal ko mainly win lo=checking
        
     
    }

})();



//UI CONTROLLER
var UIController = (function(){
    var DOMString = {//query twy ko customize ma lote chin lo,obj sout
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeElement : '.income__list',//html ko dom htalhtae chin lo
        expenseElement : '.expenses__list',
        budgetLabel : '.budget__value',//display calculated value in UI
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expensePercLable : '.item__percentage',
        dateLabel : '.budget__title--month'
    } //custom ma loke chin lo obj create p tw property anay nae htae
    var formatNumber = function(num,type){
            var numSplit,int,dec,type;
//            + or - befor number
//            2 decimal point
//            comma separating the thousands
//            2103.4567-> 2,103.46
//            2000 - > 2,000.00
            num = Math.abs(num);//format
            num = num.toFixed(2);//u will get num of word u want-but chg to string need to chg int
            numSplit = num.split('.');
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0,int.length - 3 ) + ',' + int.substr(int.length - 3,int.length);//sa phyat,bal hti
            }
              dec = numSplit[1];
            return  (type === 'exp' ? '-' : '+')+ ' ' + int + '.'+ dec;
          
        }
    return {//out ka controller ka tan u lo ya ag return obj htal mhr yay
        getInput : function(){
            return{ //var create loke yin return ma pyan lo obj create p var ko property anay nae chg
                type : document.querySelector(DOMString.inputType).value,//budget controller htal ka income con ka yout lr tr ko type nae phan tl //can call whatever public or public because they r in the same scope
                description : document.querySelector(DOMString.inputDescription).value,
                value : parseFloat(document.querySelector(DOMString.inputValue).value)//parseFloat ka value ka st nae win ny lo(money ko . nae lal twat mhr)
            }
           },
        getDOMString : function(){ //1. down
            return DOMString; //apaw ka obj twy btn ka u lo ya p
        },
        addListItem : function(obj,type){
            var html,newHTML,element;
           //1.fun ko new item pyit lr mae new obj 2.obj ka id lo
            if(type === 'inc'){
                element = DOMString.incomeElement;//in,ex twy ko data u
                 //1.Create HTMl string with placeholder test
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMString.expenseElement;
                 //1.Create HTMl string with placeholder test
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
           
            
           
            
            //2.Replace placeholder text with actual data
            newHTML = html.replace('%id%',obj.id);
            newHTML = newHTML.replace('%description%',obj.description);
            newHTML = newHTML.replace('%value%',formatNumber(obj.value,type));
            
      
            //3.Insert HTML int the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);//element ka if else nae check tae hr
        },
            //class nae del ma loke pl id nae loke mhr malo  
          //id ko mu t lo getEleByID,use parent for move up
        deleteListItem : function(selectorID){
            var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
           
        },
        clearFields : function(){//delete data from input field(des,value),
            var fields,fieldsArr;  
            fields = document.querySelectorAll(DOMString.inputDescription+','+DOMString.inputValue);//DOMString htal ka inputValue nae des ko del mhr malo
            fieldsArr = Array.prototype.slice.call(fields);//list form malo array pro chg-array is con, con yae nout mhr proto lite-field is list so get help from call.
            fieldsArr.forEach(function(current,index,array){
                current.value = '';//empty caz we want to delete-loop pat tine current ko empty string twr loke
            })
            fieldsArr[0].focus();//cursor have to display in des-fieldsArr contain0&1
        },
        displayBudget : function(obj){//display calculated result in UI-obj is display budget
           var type;
           obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget,type) ;
            document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMString.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
           if(obj.percentage > 0){
               document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + "%";
           }else{
               document.querySelector(DOMString.percentageLabel).textContent = '-----';
           } 
        },
        //creating nodeList
        displayPercentage : function(percentage){
           var fields = document.querySelectorAll(DOMString.expensePercLable);//return node list
           var nodeListforEach = function(List, callBack){
               for(var i = 0;i<List.length;i++){
                   callBack(List[i],i);
               }
           } 
           nodeListforEach(fields,function(current,index){
               //creating nodeList(1.fields,2.anonymousFun)
                //DO some stuff
                if(percentage[index] > 0){
                       current.textContent = percentage[index] + '%';
                   }else{
                       current.textContent = '---';
                   }
                
            })
        },
       displayMonth : function(){
           var now,year,month;
            now = new Date();
//           var myBirthday =  new Date(2020,8,30);
           year = now.getFullYear();
           month = now.getMonth();
           months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
           document.querySelector(DOMString.dateLabel).textContent = months[month] +' '+ year;
       } 
     }
    
})();
            



//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
    
    var setupEventListener = function(){
        //group events=private fun,ctrlAddItem & so dont export data(amhan ka, they have to run when items are added->the fun need to be ex content)
        var DOM = UICtrl.getDOMString();//UICtrl mhr shi tae property ko phan mhr ma lo
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);//module ma tu lo public chg ya ml 1.up
        document.addEventListener('keypress',function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
          
    })
 document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);//call value from dom string
    }
    
    var updateBudget = function(){
       // 1. Calculate the budget(invert budget to integer)
        budgetCtrl.calculateBudget();
        //2.return the budget
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
        
    }
    
      var updatePercentages = function(){
          //ctrlAddItem ka khw-loke p tr nae percent ko update mhr malo,delete item-item delete p yin lal call
//        1.Calculate percentage
        budgetCtrl.calculatePercentage();
//        2.Read percentage from the budget controller
        var percentage = budgetCtrl.getPercentage();
        
//        3.update the UI with new percentage
        UICtrl.displayPercentage(percentage);
    }
    
      var ctrlAddItem = function(){
          var input,newItem;
          //add or remove new item-item add p tr nae tan del phoe4.
      
        // 1. Get the field input data
        input = UICtrl.getInput();//for putting data(query twy)
//       console.log(input);//obj htwet lr lo, input var htal ko htae lite tl
//      
    if(input.description !== '' && !isNaN(input.value) && input.value > 0){
        // 2. Add the item to the budget controller
             newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem,input.type);//input htal pr tae type ko u 
        //4.clear fields
        UICtrl.clearFields();
        //5.Calculate and update Budget(after clear,have to update budget)
        updateBudget();
        //6.Calculate and update percentage
        updatePercentages();
         }
    }
      
       
    
  
    
     var ctrlDeleteItem = function(event){
         var itemID,splitID,type;
         itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;//if click del, all data should 0,.id=show id
         if(itemID){//itemID shi yin del ml
             splitID = itemID.split('-');
             type = splitID[0];//check inc or exp
             var ID = parseInt(splitID[1]);//string anay nae so tw del ma loke wo, so we use parseInt
             
             //1.delete the item from ds
             budgetCtrl.deleteItem(type,ID);
             //2.delete from ui
             UICtrl.deleteListItem(itemID);
             //3.update and show the new budget
             updateBudget();
             //4.calculate and update percentage
             updatePercentages();
             
         }
     }//event nhate mha delete mhr malo event para lo-event listener ka return obj ko event ka phan
   
    
    return{//setupEventListener ka private malo
     
              init : function(){
        //          console.log('application start');
                  //3. Display the budget on the UI 
        UICtrl.displayBudget({
            budget : 0,
            totalInc : 0,
            totalExp : 0,
            percentage : -1
        });
                     UICtrl.displayMonth();
                  console.log("Application start");
                  setupEventListener();
              }
          }  
})(budgetController,UIController);
controller.init();