***Steps to clean up code***

1. Create a controller and seperate all routes. Routes should only contain the route and connect the the controller. Example: 

const ChatController = require('../controllers/ChatController');
// Route to fetch all messages for a specific chat
router.get('/conversations/:chatId', ChatController.getMessagesByChatId);

2. Seperate out calculations (in utilities), services (the logic), and schema from the model (Offer and Transaction). There should be seperation and not all in one file. CHATGPT file: "Managing App Complexity".