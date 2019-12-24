function number(num) {
  if(num==null){
    return 0;
  } else if (num < 10000) {
    return num
  } else {
    let amount = 0;
    amount = (num / 10000).toFixed(1);
    return amount + ' 万'
  }
  
};
module.exports = {
  number: number
}