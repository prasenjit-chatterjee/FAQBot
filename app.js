var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

var intentList = require('./models/intentList');
var centreentity = require('./models/centreentity');
var productentity = require('./models/productentity');
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat bot
var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());         // Register in-memory state storage
server.post('/api/messages', connector.listen());

//=========================================================
// Recognizers
//=========================================================

var qnarecognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: 'ec308e69-e5d3-4d62-a312-4362f4059929',
    subscriptionKey: '396d979ab8824a91ab1e4d88bc69dd33',
    top: 4
});

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a5891720-2573-4298-903b-850345877d41?subscription-key=c82081f88b644837b284aaa3fffe9a6c&verbose=true&timezoneOffset=0&q='
var luisrecognizer = new builder.LuisRecognizer(model);

//=========================================================
// Bot Dialogs
//=========================================================
var intents = new builder.IntentDialog({ recognizers: [luisrecognizer, qnarecognizer] });
//var intents = new builder.IntentDialog({ recognizers: [luisrecognizer] })
bot.dialog('/', intents);

intents.matches(intentList.centre, (session, args) => {
    session.beginDialog(intentList.centre);
})
    .matches(intentList.productprice, (session) => {
        session.beginDialog(intentList.productprice);
    })
    .matches('qna', [
        function (session, args, next) {
            var answerEntity = builder.EntityRecognizer.findEntity(args.entities, 'answer');
            session.send(answerEntity.entity);
        }
    ])
    .onDefault((session, args) => {        
        session.endConversation("Sorry! could not get your question.");
    });


var countryItems = ["India", "UK", "China"];
var stateItems = ["S1", "S2", "S3"];
var cityItems = ["C1", "C2", "C3"];
var corfirmItems = ["Yes", "No"];
var productItems = ["P1", "P2"];


bot.dialog(intentList.centre, [
    function (session) {
        builder.Prompts.choice(session, "Select Country :", countryItems,
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.choice(session, "Select State :", stateItems,
                { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.choice(session, "Select City :", cityItems,
                { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.choice(session, "Search Result : Did I resolve your query?", corfirmItems,
                { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        if (results.response) {
            session.endDialog("Thank for your feedback!");
        }
    }
]);

bot.dialog(intentList.productprice, [
    function (session) {
        builder.Prompts.choice(session, "Select Country :", countryItems,
            { listStyle: builder.ListStyle.button });
    },
    function (session) {
        builder.Prompts.choice(session, "Select Product :", productItems,
            { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.choice(session, "Price of " + results.response.entity + " is 500 : Did I resolve your query?", corfirmItems,
                { listStyle: builder.ListStyle.button });
        }
    },
    function (session, results) {
        if (results.response) {
            session.endDialog("Thank for your feedback!");
        }
    }
]);
