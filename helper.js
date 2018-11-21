// Discord Imports
const commands = [
    ["ko task add <description> _ _ _ _ ", "adiciona nova tarefa"],
    ["ko task list [-a all] _ _ _ _ _ _ ", "lista as tarefas"],
    ["ko done <task_number> _ _ _ _ _ _ ", "conclui a tarefa do numero especificado"],
    ["ko delete <task_number> _ _ _ _ _ ", "cancela a tarefa do numero especificado"],
    // ["ko folgar", "sinaliza que irá folgar amanhã, logo não fará nenhuma tarefa"],
]

const showCommands = message => {
    message.channel.send([":page_with_curl: Lista de comandos :page_with_curl:\n", ...commands.map(c => `\`${c[0]}\` ${c[1]}`)])
}

module.exports = {
    showCommands
}

// const showCommands = message => {
//     const embed = RichEmbed
//         .setTitle("Comandos")
//         .addField("adiciona nova tarefa", "ko task add <description>", true)
//         .addField("lista as tarefas","ko task list [-a all]", true)
//         .addField("conclui a tarefa do numero especificado","ko done <task_number>", true)
//         .addField("deleta a tarefa do numero especificado","ko delete <task_number>", true)
//     message.channel.send(embed)
// }
