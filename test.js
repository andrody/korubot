var a = "ko add -m 'vamos para a feira' -u romerio"
console.log(splitargs(a))
var splitargs = require('splitargs');
const commandLineUsage = require('command-line-usage')
var argv = require('minimist')(splitargs(a))

// console.log('process.argv.slice(2)', process.argv.slice(2))
console.log('argv processado = ', argv)

const sections = [
    {
      header: 'A typical app',
      content: 'Generates something {italic very} important.'
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'input',
          typeLabel: '{underline file}',
          description: 'The input to process.'
        },
        {
          name: 'help',
          description: 'Print this usage guide.'
        }
      ]
    }
  ]
  const usage = commandLineUsage(sections)
  console.log(usage)


// var program = require('commander');
// program
//   .version('0.0.1')
//   .command('tt [optional]', 'blabla')

//   program.parse(a)
//   console.log(program.parse(process.argv))
//   console.log(program.add)
//   console.log(program.option)