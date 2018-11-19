// Discord Imports
const discord = require("./discord")

const commands = [
    ["ko add <description>", "adiciona nova tarefa"],
    ["ko tasks [-a all]", "lista as tarefas abertas"],
    ["ko done <task_number>", "conclui a tarefa do numero especificado"],
    ["ko arregar <task_number>", "cancela a tarefa do numero especificado"],
    ["ko folgar", "sinaliza que irá folgar amanhã, logo não fará nenhuma tarefa"],
]

const showCommands = msg => {
    msg.channel.send([':page_with_curl: Lista de comandos :page_with_curl:\n', ...commands.map(c => `**${c[0]}** - ${c[1]}`)])
}

module.exports = {
    showCommands
}