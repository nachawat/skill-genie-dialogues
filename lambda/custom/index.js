/* eslint-disable  func-names */
/* eslint-disable  no-console */

/**
 * package.json needed dependencies
 * 
 *  "ask-sdk-core": "^2.0.7",
 *  "ask-sdk-model": "^1.4.1",
 * 
 */

/**
 * We need to import the ASK SDK module
 */
const Alexa = require('ask-sdk-core');

const dialogIntents = ['TravelIntent', 'OrderIntent'];
/**
 * Handler to handle LaunchRequestHandler requests sent by Alexa 
 * Note : this type of request is send when the user invokes your skill without providing a specific intent.
 */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Bienvenue chez le Génie des Dialogues. Je vous propose quelques exemples de dialogues. Il suffit de vous laissez guider!';
        const intentForDialog = dialogIntents[Math.floor(Math.random() * dialogIntents.length)];
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDelegateDirective({
                name: intentForDialog,
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    },
};

/**
 * Handler to handle TravelIntent requests sent by Alexa 
 * Note : this request is sent when the user makes a request that corresponds to NumberGuessIntent intent defined in your intent schema.
 */
const CompletedTravelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'TravelIntent'
            && handlerInput.requestEnvelope.request.dialogState === 'COMPLETED';
    },
    handle(handlerInput) {
        const { requestEnvelope, responseBuilder } = handlerInput;
        const slots = requestEnvelope.request.intent.slots
        const slotValues = getSlotValues(slots);
        let speechText = '';

        if (handlerInput.requestEnvelope.request.confirmationStatus === 'DENIED') {
            speechText = 'J\'ai annulé votre voyage de ';
        } else {
            speechText = 'Très bon choix! Voici le récapitulatif de votre voyage : Vous partez de ';
        }
        speechText += slotValues.origin.spoken
            + " pour aller à "
            + slotValues.destination.spoken
            + " le " + slotValues.date.spoken;
        switch (slotValues.time.spoken) {
            case "MO":
                speechText += " au matin";
                break;
            case "NI":
                speechText += " dans la nuit";
                break;
            case "AF":
                speechText += " dans l'après-midi";
                break;
            case "EV":
                speechText += " au soir";
                break;
            default:
                break;
        }
        // generate response
        return responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

const StartedInProgressOrderIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'OrderIntent' &&
            request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();
    },
};

const CoffeeGivenOrderIntentHandler = {
    canHandle(handlerInput) {
        if (handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "OrderIntent") {
            const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);
            return slotValues.drink.spoken
                && slotValues.drink.id === 'coffee'
                && !slotValues.coffeeRoast.spoken
        }
        return false;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Je peux vous proposer un café court, allongé ou noisette. Lequel préférez-vous ?')
            .reprompt('Voulez-vous un café court, allongé ou noisette ?')
            .addElicitSlotDirective('coffeeRoast')
            .getResponse();
    }
};

const TeaGivenOrderIntentHandler = {
    canHandle(handlerInput) {
        if (handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "OrderIntent") {
            const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);
            return slotValues.drink.spoken
                && slotValues.drink.id === 'tea'
                && !slotValues.teaType.spoken
        }
        return false;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Quel type de thé voulez-vous : darjeeling, vert ou à la pomme ?")
            .reprompt("Vous préférez du thé vert, darjeeling ou la pomme ?")
            .addElicitSlotDirective('teaType')
            .getResponse();
    }
};

const CompletedOrderIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "OrderIntent"
            && handlerInput.requestEnvelope.request.dialogState === "COMPLETED";
    },
    handle(handlerInput) {
        const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);
        const drink = slotValues.drink.spoken;
        let type;

        if (slotValues.drink.id === 'coffee') {
            type = slotValues.coffeeRoast.resolved;
        } else if (slotValues.drink.id === 'tea') {
            type = slotValues.teaType.resolved;
        }

        const speechText = `Je prépare votre commande : un ${drink} ${type} !`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

/**
 * Handler to handle AMAZON.HelpIntent requests sent by Alexa 
 * Note : this request is sent when the user makes a request that corresponds to AMAZON.HelpIntent intent defined in your intent schema.
 */
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        // set help prompt & reprompt messages
        const speechText = 'Je vous propose quelques exemples de dialogues. Il suffit de vous laissez guider!';
        const intentForDialog = dialogIntents[Math.floor(Math.random() * dialogIntents.length)];
        // use responseBuilder to generate the JSON response
        return handlerInput.responseBuilder
            .speak(speechText)
            .addDelegateDirective({
                name: intentForDialog,
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    },
};

/**
 * Handler to handle AMAZON.CancelIntent & AMAZON.StopIntent requests sent by Alexa 
 * Note : this request is sent when the user makes a request that corresponds to AMAZON.CancelIntent & AMAZON.StopIntent intents defined in your intent schema.
 */
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        // set cancel and stop prompt
        // Note : we want to close the Skill's session hence we don't provide a reprompt
        // If no reprompt is set, then the JSON response do not contain the shouldEndSession parameter 
        // which is equivalent to closing the session
        const speechText = 'Au revoir !';
        // use responseBuilder to generate the JSON response
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    },
};

/**
 * Handler to handle SessionEndedRequest request sent by Alexa
 * Note : this type of request is send when the current skill session ends for any reason other than your code closing the session.
 */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // log the reason why the session was ended
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        if (handlerInput.requestEnvelope.request.error) {
            console.log(`Session ended with error: ${JSON.stringify(handlerInput.requestEnvelope.request.error)}`);
        }
        // use responseBuilder to generate the JSON response (empty response)
        return handlerInput.responseBuilder.getResponse();
    },
};

/**
 * Handler to catch exceptions from other Handler
 */
const GlobalErrorHandler = {
    canHandle(handlerInput, error) {
        // Note : an error has at least .message & .type properties which you can use filter exceptions
        return true;
    },
    handle(handlerInput, error) {
        // find file and line for error
        const stack = error.stack.split('\n');
        let errorLoc = stack[1].substring(stack[1].lastIndexOf('/') + 1, 900);
        errorLoc = errorLoc.slice(0, -1);
        const file = errorLoc.substring(0, errorLoc.indexOf(':'));
        let line = errorLoc.substring(errorLoc.indexOf(':') + 1, 900);
        line = line.substring(0, line.indexOf(':'));
        // log the error
        console.log("==== ERROR ======");
        console.log("Type : " + error.type);
        console.log("Message : " + error.message);
        console.log("File : " + file);
        console.log("Line : " + line);
        console.log("Stack : " + error.stack);
        // provide a prompt to let the user know we could not understand him
        // tip : better to ask to reformulate than repeat (aka try another utterance)
        const speechText = "Désolé, je n'ai pas compris. Pouvez-vous reformuler?";
        // use responseBuilder to generate the JSON response
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

/**
 * Request Interceptor to log the request sent by Alexa
 */
const LogRequestInterceptor = {
    process(handlerInput) {
        // Log Request
        console.log("==== REQUEST ======");
        console.log(JSON.stringify(handlerInput.requestEnvelope, null, 2));
    }
}
/**
 * Response Interceptor to log the response made to Alexa
 */
const LogResponseInterceptor = {
    process(handlerInput, responseOutput) {
        // Log Response
        console.log("==== RESPONSE ======");
        console.log(JSON.stringify(responseOutput, null, 2));
    }
}

/**
 * We define the ASK SDK SkillBuilder to be used
 */
const skillBuilder = Alexa.SkillBuilders.custom();

/**
 * We add the needed behavior to the newly created SkillBuilder
 * .addRequestHandlers(...) 
 * => Request handlers are responsible for handling one or more types of incoming requests
 * => We need to register the handlers defined above to be used 
 * .addErrorHandlers(...)
 * => Error handlers are similar to request handlers, but are instead responsible for handling one or more types of errors.
 * => We need to register the error handlers defined above to be used
 * .addRequestInterceptors(...)
 * .addResponseInterceptors(...)
 * => The SDK supports request and response interceptors that execute before and after RequestHandler execution, respectively. 
 * => We need to register the interceptors defined above to be used
 */
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        CompletedTravelIntentHandler,
        CoffeeGivenOrderIntentHandler,
        TeaGivenOrderIntentHandler,
        StartedInProgressOrderIntentHandler,
        CompletedOrderIntentHandler,       
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(GlobalErrorHandler)
    .addRequestInterceptors(LogRequestInterceptor)
    .addResponseInterceptors(LogResponseInterceptor)
    .lambda();

/**
 * Function to extract slot values from request json
 * and gather an array where each item has the following properties
 * .spoken     =>  the value heared by Alexa
 * .resolved    =>  the main value resolved by Alexa on the given Slot Type
 * .isValidated =>  boolean to indicated whether the heared value is the main value
 * .ERstatus    =>  status on whether Entity Resolution (ER) found a match
 */
function getSlotValues(filledSlots) {
    const slotValues = {};

    Object.keys(filledSlots).forEach((item) => {
        const name = filledSlots[item].name;
        slotValues[name] = {};

        // Extract the nested key 'code' from the ER resolutions in the request
        let erStatusCode;
        try {
            erStatusCode = (((((filledSlots[item] || {}).resolutions ||
                {}).resolutionsPerAuthority[0] || {}).status || {}).code);
        } catch (e) {
            console.log('erStatusCode e:' + e)
        }

        switch (erStatusCode) {
            case 'ER_SUCCESS_MATCH':
                slotValues[name].spoken = filledSlots[item].value;
                slotValues[name].resolved = filledSlots[item].resolutions
                    .resolutionsPerAuthority[0].values[0].value.name;
                slotValues[name].isValidated = filledSlots[item].value ===
                    filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name;
                slotValues[name].id = filledSlots[item].resolutions
                    .resolutionsPerAuthority[0].values[0].value.id;
                slotValues[name].ERstatus = erStatusCode;
                break;

            default: // ER_SUCCESS_NO_MATCH, undefined
                slotValues[name].spoken = filledSlots[item].value;
                slotValues[name].resolved = filledSlots[item].value;
                slotValues[name].isValidated = false;
                slotValues[name].id = 0;
                slotValues[name].ERstatus = erStatusCode === undefined ? 'undefined' : erStatusCode;
                break;
        }
    }, this);

    return slotValues;
}