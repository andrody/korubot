const columnify = require("columnify")

const listInfo = (commands, message) => {
    const info = columnify(
        [
        //     {
        //     "Nome:": "Koruja Software LTDA",
        //     "CNPJ:": "29.376.668/0001-10 (29376668000110)",
        //     "Endereço:": "AV ENG HUMBERTO MONTE 2929, 402 BS, PICI",
        //     "CEP:": "60440-593",
        //     "Inscrição Municipal:": "479.303-0",
        //     "CPF do Representante:": "036.907.703-27",
        //     // "CNAE-1:": "62.02-3-00 - Desenvolvimento e licenciamento de programas de computador customizáveis",
        //     // "CNAE-2:": "62.09-1-00 - Suporte técnico, manutenção e outros serviços em tecnologia da informação",
        //     "IPTU:": "798637-8",
        //     "Banco:": "077 - Banco Inter S.A.",
        //     "Ag Banco:": "0001",
        //     "Cc Banco:": "1146052-0",
        //     "Cod Operador:": "69408478",
        //     "Trello:": "https://trello.com/b/VQt7lfBK/koruja",
        //     "Inter:": "https://contadigitalpro.bancointer.com.br/"
        // }, 
        {
            key: "+Nome",
            value: "Koruja Software LTDA"
        },
        {
            key: "+CNPJ",
            value: "29.376.668/0001-10 (29376668000110)"
        },
        {
            key: "+Endereço",
            value: "AV ENG HUMBERTO MONTE 2929, 402 BS, PICI"
        },
        {
            key: "+CEP",
            value: "60440-593"
        },
        {
            key: "+Insc. Municipal",
            value: "479.303-0"
        },
        {
            key: "+CPF Repres.",
            value: "036.907.703-27"
        },
        {
            key: "+CNAE-1",
            value: "62.02-3-00 - Desenvolvimento e licenciamento de programas..."
        },
        {
            key: "+CNAE-2",
            value: "62.09-1-00 - Suporte técnico, manutenção e outros serviços..."
        },
        {
            key: "+IPTU",
            value: "798637-8"
        },
        {
            key: "-Banco",
            value: "077 - Banco Inter S.A."
        },
        {
            key: "-Ag Banco",
            value: "0001"
        },
        {
            key: "-Cc Banco",
            value: "1146052-0"
        },
        {
            key: "-Cod Operador",
            value: "69408478"
        },
        {
            key: "Trello",
            value: "https://trello.com/b/VQt7lfBK/koruja"
        },
        {
            key: "Inter",
            value: "https://contadigitalpro.bancointer.com.br"
        },
    ],
        {
            columns: [
                "key",
                "value",
            ],
            minWidth: 20,
            showHeaders: false,
        }
    )
    message.channel.send("```diff\n" + info + "```")
}

module.exports = {
    listInfo
}