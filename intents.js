module.exports = function(app)
{
    app.intent("CustomStopIntent", 
            {
                "slots": { },
                "utterances": 
                    ["{Goodbye|Thanks} Alexa {|I feel much better now}",
                     "{Goodbye|Thanks} Alexa {|I feel a lot better now}",
                    ]
            }, 
            stopIntent );

    app.intent ("DesperateIntent",
            {
                "slots": { },
                "utterances":
                    [ "I want to {hurt|kill} myself",
                      "My life feels so worthless",
                      "I {want to| am considering to} {hurt myself|kill myself|suicide}",
                      "I want to die",
                    ]
            },
            desperateWrapper );
    app.intent ("EmotionIntent",
            {
                "slots": { 
                    "Emotion": "EMOTIONS",
                    "thePerson": "AMAZON.US_FIRST_NAME",
                    "Adjectives": "ADJECTIVES",
                },
                "utterances":[ 
                    "I {feel|cannot help feeling|can't help feeling} {-|Emotion}",
                    "I {am|am feeling} {-|Emotion}",
                    "{-|thePerson} {called|calls|keeps calling} me names. and it makes me {-|Emotion}",
                    "{-|Emotion} is all {I am feeling|I'm feeling|I feel}",
                    "There {is not|isn't} much I can do about being {-|Emotion}",
                    "{-|thePerson} is {is|are|was|were|am} {-|Adjectives}"
                ]
            },
            parseEmotion);

    
    app.intent("AMAZON.HelpIntent",
            {"slots":{},
             "utterances": ["I have a problem"] },
            promptForProblems);

    app.intent("freeForm", positiveEncouragement );

    app.intent ( "AMAZON.StopIntent",stopIntent);
            
}

function stopIntent (request, response) {
    console.log ( "SessionEnd Intent." );
    response.say ( "Have a nice day!" );
    positiveEncouragement ( request, response );
    
    response.shouldEndSession(true);
}

function parseHelpWrapper ( request, response ) {
    var thePerson = request.slot ( "thePerson" );
    if ( thePerson ) {
        console.log("freeform_text\nIt's about " + thePerson);
        // do some parsing, to replace below line
        response.say ( "I see. Tell me more about " +
                ( (thePerson == "I") ? "it" : thePerson ) );
    }
    else 
        positiveEncouragement ( request, response );
    response.shouldEndSession(false);
}

function generatePositiveEncouragement () {
    const responses = [
        "Try talking to people who you trust in, and positive vibes.",
        "Please remember when you are scared or frightened. never forget the times when you felt happy. When the day is dark. always remember happy days."
    ];
    return response[getRandomInt (0, response.length-1)];
}
function positiveEncouragement ( request, response ) {
    response.say ( generateResponeToDesperate() );
}

function promptForProblems (request, response) {
    console.log ( "Parsing freefrom input" );
    response.say ( "I see. Please tell me more" );
    response.shouldEndSession(false);
}

function parseEmotion ( request, response ) {
    var emotion = request.slot ( "Emotion" );
    var thePerson = request.slot ( "thePerson" );
    console.log ( "Parsing emotion: " + emotion );
    if ( thePerson )
        console.log ( "It's about " + thePerson );
    if ( emotion ) {
        response.say ( "I'm sorry that you are feeling " + 
                emotion + ".How about you go into more detail? ");
    }
    else 
        parseHelpWrapper ( request, response );
    response.shouldEndSession(false);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateResponeToDesperate () {
    const response = [
        "Remember that there’s always somebody who cares about you. If you want to talk to someone more, please contact a suicide hotline. ",
    ];
    return response[getRandomInt (0, response.length-1)];
}
function desperateWrapper ( request, response ) {
    response.say ( generateResponeToDesperate () );
    response.shouldEndSession ( false );
}
