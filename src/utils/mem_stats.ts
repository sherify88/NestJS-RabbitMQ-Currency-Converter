// 'use strict'

// // A very simple nodeJS script that demonstrates how you can access
// // memory usage information similar to how free -m works on the
// // Raspberry Pi. Goes with µCast #14. http://youtu.be/EqyVlTP4R5M
 
 
// // Usage: node pi_mem.js
// // Example Output
// //
// // total    used    free    cached
// // 469      65      404     31
// // Memory Usage:    7%

// var fs = require('fs');

// export var PiStats = function(){

//   var memInfo :any= {};
//   var currentCPUInfo :any= {total:0, active:0};
//   var lastCPUInfo:any = {total:0, active:0};

//   function getValFromLine(line){
//     var match = line.match(/[0-9]+/gi);
//     if(match !== null)
//       return parseInt(match[0]);
//     else
//       return null;
//   }

//   var getMemoryInfo = function(cb){
//     fs.readFile('/proc/meminfo', 'utf8', function(err, data){
//       if(err){
//         cb(err);
//         return;
//       }
//       var lines = data.split('\n');
//       memInfo.total = Math.floor(getValFromLine(lines[0]) / 1024);
//       memInfo.free = Math.floor(getValFromLine(lines[1]) / 1024);
//       memInfo.cached = Math.floor(getValFromLine(lines[3]) / 1024);
//       memInfo.used = memInfo.total - memInfo.free;
//       memInfo.percentUsed = Math.ceil(((memInfo.used - memInfo.cached) / memInfo.total) * 100);

//       cb(null, memInfo);
//     });
//   };

//   var calculateCPUPercentage = function(oldVals, newVals){
//     var totalDiff = newVals.total - oldVals.total;
//     var activeDiff = newVals.active - oldVals.active;
//     return Math.ceil((activeDiff / totalDiff) * 100);
//   };

//   var getCPUInfo = function(cb){
//     lastCPUInfo.active = currentCPUInfo.active;
//     lastCPUInfo.idle = currentCPUInfo.idle;
//     lastCPUInfo.total = currentCPUInfo.total;

//     fs.readFile('/proc/stat', 'utf8', function(err, data){
//       if(err){
//         if(cb !== undefined)
//           cb(err);
//         return;
//       }
//       var lines = data.split('\n');
//       var cpuTimes = lines[0].match(/[0-9]+/gi);
//       currentCPUInfo.total = 0;
//       // We'll count both idle and iowait as idle time
//       currentCPUInfo.idle = parseInt(cpuTimes[3]) + parseInt(cpuTimes[4]);
//       for (var i = 0; i < cpuTimes.length; i++){
//         currentCPUInfo.total += parseInt(cpuTimes[i]);
//       }
//       currentCPUInfo.active = currentCPUInfo.total - currentCPUInfo.idle
//       currentCPUInfo.percentUsed = calculateCPUPercentage(lastCPUInfo, currentCPUInfo);

//       if(cb !== undefined)
//         cb(null, currentCPUInfo);
//     });
//   };

//   return{
//     getMemoryInfo: getMemoryInfo,
//     getCPUInfo: getCPUInfo,
//     printMemoryInfo: function(){
//       getMemoryInfo(function(err, data){
//         console.log("total\tused\tfree\tcached");
//         console.log( data.total + "\t" + data.used + "\t" + data.free + "\t" + data.cached );
//         console.log("Memory Usage:\t" + data.percentUsed + "%");
//       });
//     },
//     printCPUInfo: function(){
//       getCPUInfo(function(err, data){
//         console.log("Current CPU Usage: " + data.percentUsed + "%");
//       });
//     }
//   };
// }();

// PiStats.printMemoryInfo();
// console.log("")
// // setInterval(PiStats.printCPUInfo, 1000);