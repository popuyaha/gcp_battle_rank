const functions = require('firebase-functions')

exports.updateBoard = functions.firestore
  .document('GAME_BOARD_100/{gameId}')
  .onUpdate((change, context) => {
    // Get an object representing the current document
    const newValue = change.after.data()

    // ...or the previous value before this update
    const previousValue = change.before.data()
    console.log(newValue, previousValue, context, '내용이')
    return change
  })

exports.createBoard = functions.firestore
  .document('GAME_BOARD_100/{gameId}')
  .onCreate((snapShot, context) => {
    // Get an object representing the current document
    console.log(context.params, '신규 context')
    const data = snapShot.data()
    console.log(data, '데이터는 무엇인가')
    return snapShot
  })

exports.deleteBoard = functions.firestore
  .document('GAME_BOARD_100/{gameId}')
  .onDelete((snapShot, context) => {
    const deletedValue = snapShot.data()
    console.log(deletedValue, context, '지워지는것들')
  })
