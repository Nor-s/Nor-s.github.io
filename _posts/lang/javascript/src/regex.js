var xArray;
var str = "fee fi fo fum";
var re = /\w+\s/g;
while ((xArray = re.exec(str))) console.log(xArray);
