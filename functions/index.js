const functions = require("firebase-functions");
const admin= require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const database= admin.database();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.newNodeDetected= functions.database.ref('users/{userId}').onCreate((snapshot, context)=> {
    const name= snapshot.val();
    console.log(name);
});

exports.nodeChanged= functions.database.ref('users/{userId}').onUpdate((change, context)=> {
    const before= change.before.val();
    const after= change.after.val();
    const userId= context.params.userId;

    console.log(userId);
    console.log(before);
    console.log(after);

    database.ref('metadata/lastChangedName/').set(userId + "changed his information");
});


exports.pushDataEveryMinute= functions.pubsub.schedule('0 0 25 * *').onRun((context)=> {
    let date= new Date();
    database.ref('metadata/lastUpdated/').set(date.getTime());

    return null;
});
