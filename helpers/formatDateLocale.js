module.exports = function(dateY) {
  let date = new Date(dateY);
  let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return `${date.toLocaleDateString('pt-BR', options)} ${date.toLocaleTimeString()}`
}

// const formatDate = require('./../helpers/formatDateLocale')
// console.log(formatDate('2018-04-12T23:40:08.000Z'))
