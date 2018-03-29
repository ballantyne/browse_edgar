const path        = require('path');
const ParseTable  = require(path.join(__dirname, 'parse_table'));

module.exports = function(html) {
  return ParseTable('#formDiv div table.tableFile[summary="Document Format Files"]', html);
}



// module.exports = function(html) { 
//   // console.log(html);  
//   var $ = cheerio.load(html);
//   var headers = $('#formDiv div table.tableFile[summary="Document Format Files"] tr th');
//   var cells = $('#formDiv div table.tableFile[summary="Document Format Files"] tr td');
//   headers = _.map(headers, function(header) { 
//     return header.children[0] 
//   });
//   // headers = _.filter(headers, function(h) { return h == 'text'});
//   headers = _.map(headers, function(k) {  
//     if (k.type == 'text') {
//       return k.data.toLowerCase() 
//     } else {
//       return k.children[0].data.toLowerCase();  
//     }
//   });
  
//   cells = _.map(cells, function(cell) {
//     return cell.children[0];
//   })
//   var entries = [];
//   var index = 1;
//   var current_entry = [];
  
//   for (i = 0; i < cells.length; i++) {
//     var cell = cells[i];
//     if (cell.type == 'text') {
//       cell.data = cell.data.trim();
//       if (parseInt(cell.data).toString() == cell.data) {
//         current_entry.push(parseInt(cell.data));
//       } else if (cell.data == '') {
//         current_entry.push(null);
//       } else {
//         current_entry.push(cell.data);
//       }
//     } 
//     if (cell.type == 'tag' && cell.name == 'a') {
//       current_entry.push("http://www.sec.gov"+cell.attribs.href)
//     }
//     if (index == headers.length) {
//       index = 1;
//       var obj = _.object(headers, current_entry);
//       entries.push(obj);
//       current_entry = [];
//     } else {
//       index += 1;
//     }
//   }
//   // var rows = _.values(documents.children().children());

//   // rows.shift();
//    // = _.map(cells, function(row) { return row.children });
//   // console.log(headers);
//   console.log(entries)
//   var data = {};
//   return entries;
// }
