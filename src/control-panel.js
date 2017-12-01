import { Dispatcher, Store } from './flux';

//This the dispatcher, Primary job is execute all the function in the listener's array
const controlPanelDispatcher = new Dispatcher();

const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_FONT_SIZE_PREFERENCE = 'UPUPDATE_FONT_SIZE_PREFERENCE';

//This is action, Only actions can modify data in a store.
//Dispatcher does NOT modify data.
const userNameUpdateAction = function (name) {
    return {
        //This the way to show that  type of action it is.
        type: UPDATE_USERNAME,
        //This is the first param for the action UPDATE_USERNAME
        value: name
    }
};

//Action just creates an object out of a param given.
const fontSizePreferenceUpdateAction = function (size) {
    //Create the object
    let result = {
        //Which gives a type to the object.
        type: UPDATE_FONT_SIZE_PREFERENCE,
        value: size
    };
    return result;
}


//Notice the {} around target. This means from the object's callback function will be a object.
//From which the target key is selected and passed down
document.getElementById('userNameInput').addEventListener('input', function ({ target }) {
    const name = target.value;
    console.log('Dispatching ', name);

    //Old way, This way we are passing the ActionType here
    //controlPanelDispatcher.dispatch('TODO_NAMEINPUTACTION');
    controlPanelDispatcher.dispatch(userNameUpdateAction(target.value));

});

document.forms.fontSizeForm.fontSize.forEach(function (element) {
    element.addEventListener('change', function (sender) {
        //Old way, This way we are passing the ActionType here
        //controlPanelDispatcher.dispatch('TODO_FONTUPDATEACTION');
        const { target } = sender
        //Foreach listener i will pass this function
        controlPanelDispatcher.dispatch(fontSizePreferenceUpdateAction(target.value));
    })
}, this);

//Creating a Store Class
class UserPrefsStore extends Store {
    //Overridding the Store's getInitialState function
    getInitialState() {
        return {
            userName: 'Jim',
            fontSize: 'small'
        }
    }

    __onDispatch(action) {
        console.log('Store is recevied dispatch ', action);
        //There is the action handler
        switch (action.type) {
            case UPDATE_USERNAME:
                this.__state.userName = action.value;
                //Interesting, This code will trigger all the listner's who were registered to this store.
                this.__emitChange();
                break;
            case UPDATE_FONT_SIZE_PREFERENCE:
                this.__state.fontSize = action.value;
                this.__emitChange();
                break;

            default:
                //No change occured so DO run the emit method.
                break;
        }

    }

    //Getter of the state
    getUserPreference() {
        return this.__state;
    }
}

//When you call this contstructor, we are registering the function UserPrefsStore's__onDispatch to the dispatcher.
const userPrefsStore = new UserPrefsStore(controlPanelDispatcher);

//This is the listener to the store, Once the store is update this listener is ran.
userPrefsStore.addListener(function (state) {
    console.info('Current state is ', state)

    //We will update the DOM here so that the new state is show on the website.
    //This line will update the text on the Website
    document.getElementById('userName').innerText = state.userName;


    let fontSizeTemp = '24px';
    if (state.fontSize === 'small') {
        fontSizeTemp = '16px';
    }
    //This is interesting, We can use document to get the CSS of a tag
    document.getElementsByClassName('container')[0].style.fontSize = fontSizeTemp;

    //This is use to make the radiobuttom bigger
    document.forms.fontSizeForm.fontSize.value = fontSizeTemp;
});


//This is a dummy for the register.
controlPanelDispatcher.register(function (action) {
    console.info('Received action ...', action);
})

