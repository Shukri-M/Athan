const express = require('express');
const webpush = require('web-push');

const app = express();


const publicVapidKey = BEanh9MotqWSOATpymCvKBsGtqKJ8uKfX_N9YpG2fKcdfJYGQiluOqVRwXLFrK8rM8SyF3GRZf3MADRQnNagqz0 ;
const privateVapidKey = c6qpZLsip2KCJgPIEC9WWAsiMN_zpbnhEcwkGn-y7yw ;

webpush.setVapidDetails('mailto:Adhanspprt@gmail.com', publicVapidKey, privateVapidKey);

app.use(express.json());

let pushSubscription;

app.post('/subscribe', (req, res) => {
    pushSubscription = req.body;
    res.status(201).json({});
});

app.post('/send-notification', (req, res) => {
    const payload = JSON.stringify(req.body);

    webpush.sendNotification(pushSubscription, payload)
        .then(result => {
            res.status(200).json({ message: 'Notification sent successfully.' });
        })
        .catch(error => {
            console.error('Error sending notification:', error);
            res.status(500).json({ error: 'Error sending notification.' });
        });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
