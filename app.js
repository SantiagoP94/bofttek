const { createBot, createProvider, createFlow, addKeyword, addChild } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const bot = require('@bot-whatsapp/bot')


/**AQUI INICIA FLUJO IMPRESORA */
const flow2_1impresoras = addKeyword(['1','falta de papel']).addAnswer(['Por favor enviar correo para generar ticket'])
const flow2_2impresoras = addKeyword(['2','toner']).addAnswer(['Por favor enviar correo para generar ticket'])
const flow2_3impresoras = addKeyword(['3','otras fallas']).addAnswer(['Enviar ubicación y usuario para generar ticket'])

const flow1impresoras = addKeyword(['1', 'siguiente']).addAnswer(
    ['por favor enviar correo electronico para generar ticket'],
    null,
)
const flow2impresoras = addKeyword(['2', 'Impresora con problemas','problemas impresora']).addAnswer(
                        [
                            '1. Falta de papel?',
                            '2. Sin toner?',
                            '3. Otras fallas'
                        ],
                        {
                            capture:true,
                            buttons:[{body:'volver al inicio'}]
                        },
                        null,
                        [flow2_1impresoras, flow2_2impresoras, flow2_3impresoras])

const flow3impresoras = addKeyword(['3', 'siguiente']).addAnswer(['Enviar usuario para generar ticket'])

const flowImpresoras = addKeyword(['1', 'impresora', 'impresoras','1. Impresoras','uno','atras']).addAnswer(
    [
        '1. No instalada',
        '2. Impresora con problemas',
        '3. Usuario Print Viajero (Papercut)',
    ],
    {
        capture:true
    },
    null,
    [flow1impresoras,flow2impresoras,flow3impresoras]
)
/**AQUI FINALIZA FLUJO IMPRESORA */

/******************************************************************************************************** */

/**AQUI INICIA FLUJO GOOGLE DRIVE */
const flow1GoogleDrive = addKeyword(['password', 'reset','1']).addAnswer(
    ['Recuerde que el usuario de Google Drive es el mismo de Correo',
        'Si esto no funcionó por favor enviar ubicación y usuario para generar ticket']
    )
const flow2GoogleDrive = addKeyword(['unidad', 'unidad G:','2','No aparece unidad g']).addAnswer(
    ['Busque la app de Google Drive en el inicio o la barra de tareas y ejecutela',
        'Si esto no funcionó por favor enviar ubicación y usuario para generar ticket']
    )
const flow3GoogleDrive = addKeyword(['3', 'acceso carpeta compartida','carpeta compartida','carpeta','compartida'])
                        .addAnswer(['Recuerde que cada carpeta tiene su dueño',
                         'y es quien debe autorizar el acceso',
                         'Si esto no funciono, por favor enviar usuario y carpeta para generar ticket'])

const flowGoogleDrive = addKeyword(['2', 'google','google drive','drive','2. Google Drive']).addAnswer(
    [
        '1. Reset Password',
        '2. No aparece unidad G:',
        '3. Acceso a carpeta compartida',
    ],
    {
        buttons:[
            {
                body: '1. Reset Password'
            },
            {
                body: '2. No aparece unidad G:'
            },
            {
                body: '3. Acceso a carpeta compartida'
            },
        ]
    },
    null,
    [flow1GoogleDrive,flow2GoogleDrive,flow3GoogleDrive]
)
/**AQUI FINALIZA FLUJO GOOGLE DRIVE */

/******************************************************************************************************** */

/**AQUI INICIA FLUJO PASSWORD */
const flow1windows = addKeyword(['1', 'windows','cuenta windows']).addAnswer(
    [
        'Enviar usuario para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'atras'
            }
        ]
    },
    (ctx) =>{
        return ctx.body
    }
    )
const flow2correo = addKeyword(['2', 'correo','correo electronico']).addAnswer(
    [
        'Enviar usuario para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'atras'
            }
        ]
    },
    (ctx) =>{
        return ctx.body
    }
    )
const flow3sap = addKeyword(['3', 'sap','cuenta sap']).addAnswer(
    [
        'Ya intentaste recuperar la cuenta a través del cliente SAP?',
        'Sino funciono. Enviar usuario SAP y ambiente para generar ticket',
        'O presiona atras para volver al menú anterior'
    ],
    {
        buttons:[
            {
                body:'atras'
            }
        ]
    },
    )
const flow4vpn = addKeyword(['4', 'vpn','cuenta vpn']).addAnswer(
    [
        'Recuerde que el usuario VPN corresponde al usuario Windows',
        'y no al del correo por lo tanto no debe ser ingresado el dominio de correo',
        'Si esto no funciono. Enviar usuario VPN(Windows) para generar ticket'
    ],
    {
        buttons:[
            {
                body:'atras'
            }
        ]
    },
    )

const flowPassword = addKeyword(['3', 'password','password cuentas','3. Password Cuentas']).addAnswer(
    [
        'Con que cuenta presentas problemas:',
        '1. Cuenta Windows',
        '2. Cuenta Correo Electrónico',
        '3. Cuenta SAP',
        '4. Cuenta VPN',
    ],
    {
        buttons:[
            {
                body:'1. Cuenta Windows'
            },
            {
                body:'2. Cuenta Correo Electrónico'
            },
            {
                body:'3. Cuenta SAP'
            },
            {
                body:'4. Cuenta VPN'
            },
            {
                body:'atras'
            }
        ],
        capture:true
    },
    async (ctx,{fallback})=>{
        if (ctx.body.includes('atras')){
            return fallback()
        }
    },
    [flow1windows,flow2correo,flow3sap,flow4vpn]
)
/**AQUI FINALIZA FLUJO PASSWORD */

/******************************************************************************************************** */
/**
 *  INICIO FLUJO GRACIAS
 */
const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        'Ha sido un placer',
        'De nada, con mucho gusto',
    ]
)
/**
 *  FIN FLUJO GRACIAS
 */

/******************************************************************************************************** */

/**AQUI INICIA FLUJO SOFTWARE */
const flow1Thinkcell = addKeyword(['1','thinkcell','thinkcell','think']).addAnswer(
    ['La licencia de Thinkcell tiene un Valor de USD 240 anual',
        'Si deseas la licencia por favor enviar',
        'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'
    ])

const flow2SmartSheet = addKeyword(['2','smartsheet','SmartSheet']).addAnswer(
    ['Licencia de Smartsheet tiene un Valor de USD 300 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'])

const flow3AutoCAD = addKeyword(['3','autocad','AutoCAD']).addAnswer(
    ['Licencia de Autocad tiene un Valor de USD 700 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'])

const flow4Acrobat = addKeyword(['4','acrobat','Acrobat']).addAnswer(
    ['Licencia de Acrobat tiene un Valor de USD 260 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'])

const flow5Photoshop = addKeyword(['5','Photoshop','photoshop']).addAnswer(
    ['Licencia de Photoshop tiene un Valor de USD 600 anual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'])

const flow6Visio = addKeyword(['6','visio','Visio']).addAnswer(
    ['Licencia de Visio tiene un Valor de USD 46,7 mensual',
    'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'])

const flow7Project = addKeyword(['7','project','Project']).addAnswer(
    ['La Licencia de Project tiene un Valor de USD 46,7 mensual',
        'Si deseas la licencia por favor enviar',
        'Enviar CECO de cargo, Aprobador y Nombre de Usuario para generar Ticket'
    ])

const flow8Apps = addKeyword(['8','otras aplicaciones','Apps']).addAnswer(
    ['Solicitar Nombre de Aplicación, usuario y generar ticket'])

const flowSoftware = addKeyword(['4','software','solicitud software','4. Solicitud Software']).addAnswer(
    [
        '1. Thinkcell',
        '2. Smartsheet',
        '3. AutoCAD',
        '4. Acrobat',
        '5. Photoshop',
        '6. Visio',
        '7. Project',
        '8. Otras Aplicaciones'
    ],
    null,
    null,
    [flow1Thinkcell, flow2SmartSheet, flow3AutoCAD, flow4Acrobat, flow5Photoshop, flow6Visio, flow7Project,flow8Apps ]
)
/**AQUI FINALIZA FLUJO SOFTWARE */

const flowPrincipal = addKeyword(['hola','Hola como estas?','volver al inicio'])
    .addAnswer('🙌 Hola bienvenido a este *Bofttek*')
    .addAnswer(
        [
            'Estamos para ayudarte con tu inconveniente',
            'por favor indica el número o presiona un boton al cual deseas tener acceso:',
        ],
        {
            buttons:[
                {
                    body: 'impresoras'
                },
                {
                    body: 'google drive'
                },
                {
                    body: 'password cuentas'
                },
                {
                    body: 'solicitud software'
                }
            ]
        },
        null,        
        // (ctx,{fallback})=> {
        //     if (!ctx.body.includes(['1. Impresoras',
        //                     '2. Google Drive','3. Password Cuentas',
        //                     '4. Solicitud Software'])) {
        //         return fallback()
        //     }
        // },
        [flowImpresoras, flowGoogleDrive, flowPassword, flowSoftware]
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })    
    QRPortalWeb({bot:'bofttek'})
}

main()