


// var splitargs = require("splitargs")
// const commandLineUsage = require("command-line-usage")
// var argv = require("minimist")(splitargs(a))
// const mongoose = require("mongoose")
// // const RichEmbed = require("../discord").RichEmbed
// var differenceInHours = require("date-fns/difference_in_hours")

// const test = async () => {
//     console.log('PORRA')
//     const tasks = await TaskModel.model.find({ status: "OPEN" })
//     console.log('tasks.length', tasks.length)
//     tasks.map(t => {
//     })
// }
// console.log(differenceInHours(mongoose.Types.ObjectId("5bf48a947acc712cf05ac6d1").getTimestamp(), new Date()))

// test()
// console.log('process.argv.slice(2)', process.argv.slice(2))
// console.log("argv processado = ", argv)

// const sections = [
//     {
//         header: "A typical app",
//         content: "Generates something {italic very} important."
//     },
//     {
//         header: "Options",
//         optionList: [
//             {
//                 name: "input",
//                 typeLabel: "{underline file}",
//                 description: "The input to process."
//             },
//             {
//                 name: "help",
//                 description: "Print this usage guide."
//             }
//         ]
//     }
// ]
// const usage = commandLineUsage(sections)
// console.log(usage)

// var program = require('commander');
// program
//   .version('0.0.1')
//   .command('tt [optional]', 'blabla')

//   program.parse(a)
//   console.log(program.parse(process.argv))
//   console.log(program.add)
//   console.log(program.option)

// const https = require("https")
// https
//     .get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", resp => {
//         console.log('ENTROU AQUI 1')
//         let data = ""

//         // A chunk of data has been recieved.
//         resp.on("data", chunk => {
//             data += chunk
//         })

//         // The whole response has been received. Print out the result.
//         resp.on("end", () => {
//             console.log(JSON.parse(data).explanation)
//         })
//     })
//     .on("error", err => {
//         console.log("Error: " + err.message)
//     })
