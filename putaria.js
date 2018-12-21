const { USERS } = require("./constants")
const variations = [
    "com gosto",
    "até o talo",
    "laaa no fundo",
    "e saiu pela boca",
    "e ele gostou",
    "e ele gemeu alto",
    "e ele gritou GOSTOSOOOOO",
    "e ele disse se parar eu te mato",
    "tão forte que ele engravidou",
    "sem proteção e pegou AIDS",
    "e deixou só o bagaço",
    "de maneira tão bruta que hoje ele caga em pé",
    "e perfurou o estômago",
    "mas ele nem sentiu",
    "mas ele achou pequeno",
    "mas ele já tava acostumado e nem notou",
    "e ele AMOU! GENTE QUE BOM DEMAIS!",
    "e ele nunca mais quis tirar. Ficou pregado!",
    "e ele disse: 'Enfia tudo benhê! Que não tô nem sentido ainda'",
    "e a rolada fez cócegas",
    "e se ele apaixonou",
    "e os dois se apaixonaram e se comerem felizes para sempre",
    "e se casaram",
    "e assim começou a linda história de amor entre a rola e o cú",
    "mas ele só gosta de jebas grandes",
    "mas ele tinha um cinto de castidade e cortou o pinto fora",
    "mas o cú estava envenenado com tranquilizante e o estuprador foi posto para dormir e enrabado em seguida",
    "até sair sangue",
    "até sentir o cheiro de queimado",
    "até queimar a rosca",
    "até o sangue jorrar",
    "mas ele não gostou, pois tem que pagar o jantar primeiro",
    "e depois de ser comido cobrou 10 reais",
    "e chamou ele de minha vadia",
    "e tiveram um filho chamado filho da puta",
    "e tiveram que chamar o pedreiro para tampar o rombo",
    "e ele agradeceu a bondade",
    "e ele tomou no cu literalmente",
]

const putaria = message => {
    const variation = variations[Math.floor(Math.random() * variations.length)]
    if (message.content.toLowerCase().includes("pncdr")) {
        message.channel.send(
            USERS.find(e => e.discordUser == message.author.id).name +
                " enfiou o pau no cu do Romério " +
                variation
        )
    }
    if (message.content.toLowerCase().includes("pncdi")) {
        message.channel.send(
            USERS.find(e => e.discordUser == message.author.id).name +
                " enfiou o pau no cu do Isaac " +
                variation
        )
    }
    if (message.content.toLowerCase().includes("pncdb")) {
        message.channel.send(
            USERS.find(e => e.discordUser == message.author.id).name +
                " enfiou o pau no cu do Bruno " +
                variation
        )
    }
    if (message.content.toLowerCase().includes("pncda")) {
        message.channel.send(
            USERS.find(e => e.discordUser == message.author.id).name +
                " tentou enfiar o pau no cu do Andrew, mas como Andrew é o meu criador, o pau foi desviado e acabou sendo enfiado no Isaac e " +
                USERS.find(e => e.discordUser == message.author.id).name +
                " morreu de sífilis"
        )
    }
}

module.exports = putaria
