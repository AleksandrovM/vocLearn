var fs = require("fs");
var read = require('read');
var shuffle = require('shuffle-array');

var count = 0;
var trues = 0;
var badAnss = [];

var fileName = process.argv[2] || 'input.txt';

read({ prompt : "Direction of words:(0,1)" }, function (err, dir) {
        fs.readFile(fileName, 'utf8' , function (err, data) {
        if (err) return console.error(err);
            
            let strs = JSON.stringify(data);
            strs = strs.replace(/"/g, '');
            let strsMas = strs.split('\\r\\n');
            
            strsMas = strsMas.filter((el) => {
                if(el.indexOf('-') < 0 || el.length < 3)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            });

            strsMas = strsMas.map((el) => {
                let twoWords = el.split('-');                
                let obj = {
                    first : twoWords[1 - dir].trim(),
                    second : twoWords[dir].trim(),                
                };                
                return obj;
            });

            shuffle(strsMas);

            count = strsMas.length;
            
            let iterator = engTest(strsMas);

            rrr(iterator);          
        });
    });
  
function rrr(itr, aans)
{   
    qst = itr.next(aans);
    
    if(qst.done)
    {   
        console.log(`RESULT ${trues} of ${count} \n`);
        
        count = badAnss.length;
        if(count == 0)
        {
            return;
        }
        
        trues = 0;
        iterator = engTest(badAnss);
        badAnss = [];
         
        rrr(iterator);
                
        return;
    }

    read({ prompt : `${qst.value.first}: ` }, function (err, ans) {
        if(ans.toLowerCase() !== qst.value.second.toLowerCase())
        {
            console.log(' U ENTERED ' + ans + `, NEED ${qst.value.second}`);
        }            
        if(ans == 'q')
        {                  
            return;
        }
        rrr(itr, ans);       
        });
};
 
function *engTest(mas){
    for(let i = 0; i < mas.length; i++)
    {
        let ans = yield mas[i];
       
        if(ans.toLowerCase() === mas[i].second.toLowerCase())
        {
            console.log(' RIGHT');
            trues++;
        }
        else if(ans.toLowerCase().substring(0,3) === mas[i].second.toLowerCase().substring(0,3))
        {
            console.log(' ALMOST');
            badAnss.push(mas[i])
        }
        else
        {
            console.log(' no');
            badAnss.push(mas[i]);
        }
    }
}
