const admin = require('firebase-admin')
const functions = require('firebase-functions')
const firebase = require('firebase')
const serviceAccount = require('./line-hack-760b1-firebase-adminsdk-nnkhp-84fccb4da8.json')

admin.initializeApp({
    apiKey: "AIzaSyCd5zLpFxRrTVGjrAK4Pt9WiuN-amBrePg",
    authDomain: "line-hack-760b1.firebaseapp.com",
    databaseURL: "https://line-hack-760b1.firebaseio.com",
    projectId: "line-hack-760b1",
    storageBucket: "line-hack-760b1.appspot.com",
    messagingSenderId: "888915503852",
    credential: admin.credential.cert(serviceAccount)
})

const realtimeDatabase = admin.database()

const { dialogflow, Permission, Image, SimpleResponse, Carousel, Suggestions, UpdatePermission } = require('actions-on-google')

const app = dialogflow()

app.intent('Default Welcome Intent', welcomeIntent)
app.intent('Order the drink', orderTheDrink)
app.intent('Choose size', chooseSize)
app.intent('Order completed', finishORder)

function finishORder(conv,params) {
    conv.close(new SimpleResponse({
        speech: `<speak> ${params.size} ${conv.user.storage.menu} will serve to you soon. Thank you</speak>`,
        text: `${params.size} ${conv.user.storage.menu} will serve to you soon. Thank you`
    }))
}

function chooseSize(conv, _, option) {
    
    conv.ask(new SimpleResponse({
        speech: `<speak>What size do you want for your ${option}?</speak>`,
        text: `What size do you want for your ${option}?`
    }))

    conv.ask(new Suggestions(['Small', 'Medium', 'Large']))

    conv.user.storage.menu = option
}

function orderTheDrink(conv, _, confirmationGranted) {
    if (confirmationGranted) {
        conv.ask(new SimpleResponse({
            speech: `<speak>Hello ${conv.user.name.given}. <break time="1s" />What you want to order today?</speak>`,
            text: `Hello ${conv.user.name.given}. What you want to order today?`
        }))

        conv.ask(new Carousel({
            items: {
                // Add the first item to the carousel
                'Ice chocolate': {
                    synonyms: [
                        'Iced chocolate'
                    ],
                    title: 'Iced chocolate',
                    description: 'Iced chocolate / 100 THB',
                    image: new Image({
                        url: 'http://jabies.co.nz/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/i/c/ice_coffee.png',
                        alt: 'Iced chocolate',
                    }),
                },
                'Iced coffee': {
                    synonyms: [
                        'Iced coffee'
                    ],
                    title: 'Iced coffee',
                    description: 'Iced coffee / 120 THB',
                    image: new Image({
                        url: 'https://www.cobblestonene.com/wp-content/uploads/2018/02/original-19.jpeg',
                        alt: 'Iced coffee',
                    }),
                },
                'Iced matcha': {
                    synonyms: [
                        'Iced matcha'
                    ],
                    title: 'Iced matcha',
                    description: 'Iced matcha / 80 THB',
                    image: new Image({
                        url: 'https://epicmatcha.com/wp-content/uploads/2017/04/iced-salted-caramel-matcha-latte-recipe.jpg',
                        alt: 'Iced matcha',
                    }),
                }
            }
        }))
    } else {
        conv.close('Sorry, I need your information for order the drink.')
    }

}

function welcomeIntent (conv) {
    const options = {
        context: 'Hi I\'m line cafe. To send your drink',
        // Ask for more than one permission. User can authorize all or none.
        permissions: ['NAME', 'DEVICE_PRECISE_LOCATION']
    }
    conv.ask(new Permission(options))
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
